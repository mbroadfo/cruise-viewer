import { useAuth0 } from "@auth0/auth0-react";
import { sendDebugLog } from "../utils/debugLog";

let hasLoggedToken = false;

export default function useViewerAccessToken() {
  const { getAccessTokenSilently } = useAuth0();

  return async () => {
    try {
      const token = await getAccessTokenSilently({
        audience: "https://cruise-viewer-api",
      });

      if (!hasLoggedToken) {
        sendDebugLog({
          type: "token-success",
          platform: /iPhone|iPad|iPod/.test(navigator.userAgent) ? "iOS" : "other",
          ua: navigator.userAgent,
          tokenPresent: !!token,
        });
        hasLoggedToken = true;
      }

      return token;
    } catch (e) {
      sendDebugLog({
        type: "token-fail",
        platform: /iPhone|iPad|iPod/.test(navigator.userAgent) ? "iOS" : "other",
        ua: navigator.userAgent,
        error: e.message || String(e),
      });
      return null;
    }
  };
}
