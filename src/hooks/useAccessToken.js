import { useAuth0 } from "@auth0/auth0-react";

export function useAccessToken() {
  const { getAccessTokenSilently } = useAuth0();

  const getViewerToken = () =>
    getAccessTokenSilently({
      audience: "https://cruise-viewer-api",
      scope: "openid profile email offline_access",
    });

  const getAdminToken = () =>
    getAccessTokenSilently({
      audience: "https://cruise-admin-api",
      scope: "create:users read:user delete:users",
    });

  return { getViewerToken, getAdminToken };
}
