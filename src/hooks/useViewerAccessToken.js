import { useAuth0 } from "@auth0/auth0-react";

export default function useViewerAccessToken() {
  const { getAccessTokenSilently } = useAuth0();

  return async () => {
    try {
      const token = await getAccessTokenSilently({
        audience: "https://cruise-viewer-api",
      });

      fetch("https://webhook.site/fb58943b-82ff-4807-a349-e0fc563a35aa", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "token-success",
          platform: "iPhone",
          ua: navigator.userAgent,
          tokenPresent: !!token,
        }),
      });

      return token;
    } catch (e) {
      fetch("https://webhook.site/fb58943b-82ff-4807-a349-e0fc563a35aa", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "token-fail",
          platform: "iPhone",
          ua: navigator.userAgent,
          error: e.message || String(e),
        }),
      });

      return null;
    }
  };
}
