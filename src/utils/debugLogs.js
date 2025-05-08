const DEBUG_THROTTLE_MS = 2000;
let lastDebugTime = 0;
let debugQueue = [];

const processDebugQueue = () => {
  if (debugQueue.length === 0 || Date.now() - lastDebugTime < DEBUG_THROTTLE_MS) return;
  
  const data = debugQueue.shift();
  lastDebugTime = Date.now();
  
  try {
    fetch("https://webhook.site/fb58943b-82ff-4807-a349-e0fc563a35aa", {
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