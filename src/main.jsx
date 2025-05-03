import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import TripViewer from "./TripViewer.jsx";
import PortalAdmin from "./pages/PortalAdmin.jsx";
import "./index.css";
import { config } from "./config";
import { Toaster } from 'react-hot-toast';

const onRedirectCallback = (appState) => {
  console.log("🔄 Redirecting to:", appState?.returnTo);
  window.history.replaceState(
    {},
    document.title,
    appState?.returnTo || window.location.pathname
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain={config.auth0.domain}
      clientId={config.auth0.clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
      onRedirectCallback={onRedirectCallback}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TripViewer />} />
          <Route path="/admin" element={<PortalAdmin />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" /> 
    </Auth0Provider>
  </React.StrictMode>
);
