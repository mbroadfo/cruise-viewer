import { useAuth0 } from "@auth0/auth0-react";

function useAccessToken() {
  const { getAccessTokenSilently, loginWithRedirect } = useAuth0();

  const getCachedAccessToken = async () => {
    try {
      return await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://cruise-admin-api",
        },
      });
    } catch (err) {
      if (err.error === "missing_refresh_token" || err.error === "login_required") {
        // Prompt the user to log in again
        await loginWithRedirect();
      } else {
        throw err;
      }
    }
  };

  return { getCachedAccessToken };
}
