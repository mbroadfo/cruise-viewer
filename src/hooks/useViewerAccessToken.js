import { useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function useViewerAccessToken() {
  const { getAccessTokenSilently } = useAuth0();

  const getViewerToken = useCallback(() => {
    return getAccessTokenSilently({
      audience: "https://cruise-viewer-api",
      scope: "openid profile email offline_access create:users_app_metadata read:users_app_metadata update:users_app_metadata delete:users_app_metadata",
    });
  }, [getAccessTokenSilently]);

  return getViewerToken;
}
