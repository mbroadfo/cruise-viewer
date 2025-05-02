import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";

export function useAccessToken() {
  const { getAccessTokenSilently, loginWithRedirect } = useAuth0();

  const getCachedAccessToken = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://cruise-admin-api",
          scope: 'create:users read:user delete:users',
        },
      });
      return token;
    } catch (err: any) {
      console.error("🔒 Auth error while fetching token:", err);
      // Don't auto-redirect, let the component decide what to do
      throw err;
    }
  }, [getAccessTokenSilently]);

  const forceReLogin = useCallback(async () => {
    await loginWithRedirect();
  }, [loginWithRedirect]);

  return { getCachedAccessToken, forceReLogin };
}
