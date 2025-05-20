const DEBUG_THROTTLE_MS = 2000;
let lastDebugTime = 0;
let debugQueue = [];

const processDebugQueue = () => {
  if (debugQueue.length === 0 || Date.now() - lastDebugTime < DEBUG_THROTTLE_MS) return;
  
  const data = debugQueue.shift();
  lastDebugTime = Date.now();
  
  try {
    fetch("https://webhook.site/705ffcfb-85d1-460e-b41b-a56097558904", {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        location: window.location.pathname,
        ...data
      })
    });
  } catch {
    // Fail silently
  }

  setTimeout(processDebugQueue, DEBUG_THROTTLE_MS);
};

const DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE === 'true';

if (DEBUG_MODE) {
  processDebugQueue();
}