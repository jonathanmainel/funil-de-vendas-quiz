const makeWebhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL?.trim();
const demoStorageKey = "fdv_incompany_demo_leads_v1";
const queueStorageKey = "fdv_incompany_pending_leads_v1";

function readList(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function writeList(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

function toMakePayload(payload) {
  const values = {
    submission_id: payload.submissionId,
    submitted_at: payload.submittedAt,
    name: payload.contact.name,
    phone: payload.contact.phone,
    email: payload.contact.email,
    job_title: payload.contact.jobTitle,
    company: payload.contact.company,
    consent_accepted: String(payload.consent.accepted),
    consent_text_version: payload.consent.textVersion,
    role: payload.quiz.answers.role,
    team_size: payload.quiz.answers.team_size,
    process: payload.quiz.answers.process,
    goals: payload.quiz.answers.goals,
    followup: payload.quiz.answers.followup,
    insight_timing: payload.quiz.answers.insight_timing,
    crm_usage: payload.quiz.answers.crm_usage,
    declared_bottleneck: payload.quiz.answers.bottleneck,
    timeline: payload.quiz.answers.timeline,
    score_method: String(payload.quiz.scores.method),
    score_planning: String(payload.quiz.scores.planning),
    score_execution: String(payload.quiz.scores.execution),
    score_management: String(payload.quiz.scores.management),
    score_technology: String(payload.quiz.scores.technology),
    dominant_bottleneck: payload.quiz.dominantBottleneck,
    dominant_bottleneck_label: payload.quiz.dominantBottleneckLabel,
    priority: payload.quiz.priority,
    fit: String(payload.quiz.fit),
    source: payload.source,
    unit: payload.unit,
    offer: payload.offer,
    initial_stage: payload.initialStage,
    page_url: payload.pageUrl,
    ...payload.attribution,
  };

  return new URLSearchParams(values);
}

async function postLead(payload) {
  const response = await fetch(makeWebhookUrl, {
    method: "POST",
    body: toMakePayload(payload),
  });

  if (!response.ok) {
    throw new Error(`Falha no recebimento: ${response.status}`);
  }

  const responseBody = await response.json().catch(() => ({}));
  return { status: "recorded", reference: responseBody.id ?? payload.submissionId };
}

export async function submitLead(lead) {
  const payload = {
    ...lead,
    submissionId: lead.submissionId || createId(),
    submittedAt: new Date().toISOString(),
  };

  if (!makeWebhookUrl && import.meta.env.DEV) {
    writeList(demoStorageKey, [...readList(demoStorageKey), payload]);
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    return { status: "recorded", reference: payload.submissionId, demo: true };
  }

  if (!makeWebhookUrl) {
    throw new Error("O webhook do Make ainda não foi configurado.");
  }

  try {
    return await postLead(payload);
  } catch (error) {
    writeList(queueStorageKey, [
      ...readList(queueStorageKey),
      { payload, queuedAt: new Date().toISOString() },
    ]);
    return { status: "queued", reference: payload.submissionId, error };
  }
}

export async function retryQueuedLeads() {
  if (!makeWebhookUrl || !navigator.onLine) return;
  const queued = readList(queueStorageKey);
  if (queued.length === 0) return;

  const remaining = [];
  for (const item of queued) {
    try {
      await postLead(item.payload);
    } catch {
      remaining.push(item);
    }
  }
  writeList(queueStorageKey, remaining);
}
