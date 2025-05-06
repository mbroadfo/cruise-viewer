// src/config.js

export const config = {
    auth0: {
      domain: import.meta.env.VITE_AUTH0_DOMAIN,
      clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    },
    tripDataUrl: import.meta.env.VITE_TRIP_DATA_URL,
    fallbackImage: import.meta.env.VITE_FALLBACK_IMAGE,
    apiBaseUrl: "https://62rbm8zvak.execute-api.us-west-2.amazonaws.com/prod",
  };
  