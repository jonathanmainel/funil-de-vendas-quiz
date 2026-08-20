const pixelId = import.meta.env.VITE_META_PIXEL_ID?.trim();

export function initializeAnalytics() {
  if (!pixelId || window.fbq) return;

  const load = () => {
    const fbq = function (...args) {
      fbq.callMethod ? fbq.callMethod(...args) : fbq.queue.push(args);
    };
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = "2.0";
    window.fbq = fbq;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/pt_BR/fbevents.js";
    document.head.appendChild(script);

    fbq("init", pixelId);
    fbq("track", "PageView");
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(load, { timeout: 2000 });
  } else {
    window.setTimeout(load, 1);
  }
}

export function trackEvent(name, payload = {}, eventId) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...payload });

  if (!window.fbq) return;
  if (name === "Lead") {
    window.fbq("track", "Lead", payload, eventId ? { eventID: eventId } : undefined);
  } else {
    window.fbq("trackCustom", name, payload);
  }
}
