import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import TripViewer from "./TripViewer.jsx";
import PortalAdmin from "./pages/PortalAdmin.jsx";
import "./index.css";
import { config } from "./config";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain={config.auth0.domain}
      clientId={config.auth0.clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: config.auth0.audience,
        scope: "openid profile email offline_access",
      }}
      cacheLocation="memory"
      useRefreshTokens={true}
    >
      <BrowserRouter>
        <ErrorBoundary fallback={<div style={{color: 'white'}}>Error occurred</div>}>
          <Routes>
            <Route path="/" element={<TripViewer />} />
            <Route path="/admin" element={<PortalAdmin />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>
);
