import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";


export default function ForceReLogin() {
  const { loginWithRedirect } = useAuth0();

  useEffect(() => {
    loginWithRedirect({
      authorizationParams: {
        audience: "https://cruise-admin-api",
        scope: "openid profile email offline_access",
      },
    });
  }, [loginWithRedirect]);

  return <p>Redirecting for re-authentication...</p>;
}
