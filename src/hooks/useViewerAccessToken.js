import { useAuth0 } from "@auth0/auth0-react";
import { sendDebugLog } from "../utils/debugLogs";

export default function useViewerAccessToken() {
  const { getAccessTokenSilently, loginWithRedirect } = useAuth0();

  return async () => {
    try {
      const token = await getAccessTokenSilently({
        audience: "https://cruise-viewer-api",
        timeoutInSeconds: 10,
        detailedResponse: false,  // you can also try `true` to inspect token details if needed
        scope: "openid profile email offline_access"
      });

      if (!token) {
        sendDebugLog({
          type: "auth_failure",
          context: "getAccessTokenSilently returned null",
          ua: navigator.userAgent,
          timestamp: new Date().toISOString()
        });
        return null;
      }

      sendDebugLog({
        type: "token-success",
        platform: /iPhone|iPad|iPod/.test(navigator.userAgent) ? "iOS" : "other",
        tokenPresent: !!token,
        timestamp: new Date().toISOString()
      });

      return token;
    } catch (e) {
      const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

      sendDebugLog({
        type: "token-fail",
        platform: isIOS ? "iOS" : "other",
        ua: navigator.userAgent,
        error: e.message || String(e),
        code: e.error,
        stack: e.stack,
        timestamp: new Date().toISOString()
      });

      if (e.error === "missing_refresh_token") {
        await loginWithRedirect({
          appState: { returnTo: window.location.pathname },
          authorizationParams: {
            prompt: "login",
            response_mode: isIOS ? "web_message" : "query",
            scope: "openid profile email offline_access"
          }
        });
        return null;
      }

      throw e;
    }
  };
}
