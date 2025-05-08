const DEBUG_THROTTLE_MS = 2000;
let lastDebugTime = 0;
let debugQueue = [];

const processDebugQueue = () => {
  if (debugQueue.length === 0 || Date.now() - lastDebugTime < DEBUG_THROTTLE_MS) return;
  
  const data = debugQueue.shift();
  lastDebugTime = Date.now();
  
  try {
    fetch("https://webhook.site/65614e4e-8b3c-4597-b801-ded39852e6e5", {
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

export const sendDebugLog = (data) => {
  debugQueue.push(data);
  processDebugQueue();
};