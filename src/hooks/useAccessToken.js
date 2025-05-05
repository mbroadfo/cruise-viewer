import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";

export function useAccessToken() {
  const { getAccessTokenSilently } = useAuth0();

  const getViewerToken = useCallback(async () => {
    try {
      return await getAccessTokenSilently({
        audience: "https://cruise-viewer-api",
        scope: "openid profile email offline_access",
      });
    } catch (err) {
      console.error("🔐 Failed to get viewer token:", err);
      throw err;
    }
  }, [getAccessTokenSilently]);

  const getAdminToken = useCallback(async () => {
    try {
      return await getAccessTokenSilently({
        audience: "https://cruise-admin-api",
        scope: "create:users read:user delete:users",
      });
    } catch (err) {
      console.error("🔐 Failed to get admin token:", err);
      throw err;
    }
  }, [getAccessTokenSilently]);

  return { getViewerToken, getAdminToken };
}
