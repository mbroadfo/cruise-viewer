import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function useViewerAccessToken() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const viewerToken = await getAccessTokenSilently({
          audience: "https://cruise-viewer-api",
          scope:
            "openid profile email offline_access create:users_app_metadata read:users_app_metadata update:users_app_metadata delete:users_app_metadata",
        });
        setToken(viewerToken);
      } catch (err) {
        console.error("🔐 Failed to fetch viewer token:", err);
      }
    };

    if (isAuthenticated) fetchToken();
  }, [getAccessTokenSilently, isAuthenticated]);

  return token;
}
