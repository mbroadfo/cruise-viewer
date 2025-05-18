import { useAuth0 } from "@auth0/auth0-react";

export default function useViewerAccessToken() {
  const { getAccessTokenSilently, loginWithRedirect } = useAuth0();

  return async () => {
    try {
      const token = await getAccessTokenSilently({
        audience: "https://cruise-viewer-api",
        timeoutInSeconds: 10,
        detailedResponse: false,
        scope: "openid profile email offline_access"
      });

      if (!token) {
        return null;
      }

      return token;
    } catch (e) {
      const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

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
