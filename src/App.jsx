import { useEffect, useMemo, useState } from "react";
import { Brand } from "./components/Brand";
import { ContactScreen } from "./components/ContactScreen";
import { IntroScreen } from "./components/IntroScreen";
import { PrivacyDialog } from "./components/PrivacyDialog";
import { QuestionScreen } from "./components/QuestionScreen";
import { SuccessScreen } from "./components/SuccessScreen";
import { questions } from "./data/questions";
import { initializeAnalytics, trackEvent } from "./services/analytics";
import { retryQueuedLeads, submitLead } from "./services/leadService";
import { readAttribution } from "./utils/attribution";
import { calculateQualification } from "./utils/qualification";

const storageKey = "fdv_incompany_quiz_state_v1";

function readSavedState() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey));
    if (saved && saved.screen !== "success") return saved;
  } catch {
    return null;
  }
  return null;
}

function App() {
  const saved = useMemo(readSavedState, []);
  const [screen, setScreen] = useState(saved?.screen ?? "intro");
  const [questionIndex, setQuestionIndex] = useState(saved?.questionIndex ?? 0);
  const [answers, setAnswers] = useState(saved?.answers ?? {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [queued, setQueued] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const attribution = useMemo(() => readAttribution(), []);

  useEffect(() => {
    initializeAnalytics();
    retryQueuedLeads();
    window.addEventListener("online", retryQueuedLeads);
    return () => window.removeEventListener("online", retryQueuedLeads);
  }, []);

  useEffect(() => {
    if (screen === "success") {
      sessionStorage.removeItem(storageKey);
      return;
    }
    sessionStorage.setItem(
      storageKey,
      JSON.stringify({ screen, questionIndex, answers }),
    );
  }, [screen, questionIndex, answers]);

  const startQuiz = () => {
    trackEvent("QuizStarted", attribution);
    setScreen("question");
  };

  const answerQuestion = (value) => {
    if (isTransitioning) return;
    const question = questions[questionIndex];
    const nextAnswers = { ...answers, [question.id]: value };
    setAnswers(nextAnswers);
    setIsTransitioning(true);

    window.setTimeout(() => {
      if (questionIndex === 4) trackEvent("QuizHalfway", attribution);
      if (questionIndex === questions.length - 1) {
        setScreen("contact");
        trackEvent("ContactFormViewed", attribution);
      } else {
        setQuestionIndex((current) => current + 1);
      }
      setIsTransitioning(false);
    }, 180);
  };

  const goBack = () => {
    if (screen === "contact") {
      setScreen("question");
      setQuestionIndex(questions.length - 1);
      return;
    }
    if (questionIndex === 0) {
      setScreen("intro");
      return;
    }
    setQuestionIndex((current) => current - 1);
  };

  const sendLead = async (contact) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError("");
    const qualification = calculateQualification(answers);

    try {
      const result = await submitLead({
        contact: {
          name: contact.name.trim(),
          phone: contact.phone.replace(/\D/g, ""),
          email: contact.email.trim().toLowerCase(),
          jobTitle: contact.jobTitle.trim(),
          company: contact.company.trim(),
        },
        consent: {
          accepted: contact.consent,
          textVersion: "v1",
        },
        quiz: {
          answers,
          ...qualification,
        },
        attribution,
        source: "Meta Ads",
        unit: "Ribeirão Preto",
        offer: "Diagnóstico InCompany",
        initialStage: "Novo lead: Diagnóstico InCompany",
        pageUrl: window.location.href,
      });

      const wasQueued = result.status === "queued";
      setQueued(wasQueued);
      setScreen("success");
      if (!wasQueued) {
        trackEvent(
          "Lead",
          { priority: qualification.priority, bottleneck: qualification.dominantBottleneck },
          result.reference,
        );
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar agora. Revise os dados e tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="background-line background-line--left" aria-hidden="true" />
      <div className="background-line background-line--right" aria-hidden="true" />
      <header className="site-header">
        <Brand />
      </header>
      <main className="quiz-card">
        {screen === "intro" ? <IntroScreen onStart={startQuiz} /> : null}
        {screen === "question" ? (
          <QuestionScreen
            question={questions[questionIndex]}
            questionIndex={questionIndex}
            total={questions.length}
            selectedValue={answers[questions[questionIndex].id]}
            onAnswer={answerQuestion}
            onBack={goBack}
          />
        ) : null}
        {screen === "contact" ? (
          <ContactScreen
            onSubmit={sendLead}
            onBack={goBack}
            isSubmitting={isSubmitting}
            submitError={submitError}
            onPrivacy={() => setPrivacyOpen(true)}
          />
        ) : null}
        {screen === "success" ? <SuccessScreen queued={queued} /> : null}
      </main>
      <footer className="site-footer">
        <span>Seus dados são tratados com cuidado.</span>
        <button type="button" onClick={() => setPrivacyOpen(true)}>
          Como tratamos seus dados
        </button>
      </footer>
      <PrivacyDialog open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </div>
  );
}

export default App;
