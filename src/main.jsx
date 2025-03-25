import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import TripViewer from "./TripViewer.jsx";
import "./index.css";

const domain = "dev-jdsnf3lqod8nxlnv.us.auth0.com";
const clientId = "cWyvoIKHMZZL7KhhU0LlZYFBzSbBywFJ";
const audience = "https://cruise-viewer-api";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience,
        scope: "openid profile email",
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <TripViewer />
    </Auth0Provider>
  </React.StrictMode>
);
