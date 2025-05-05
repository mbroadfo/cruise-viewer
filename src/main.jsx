import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import TripViewer from "./TripViewer.jsx";
import PortalAdmin from "./pages/PortalAdmin.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import "./index.css";
import { config } from "./config";
import { Toaster } from 'react-hot-toast';

const onRedirectCallback = (appState) => {
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
        audience: "https://cruise-viewer-api",
        scope: "openid profile email offline_access read:users create:users_app_metadata read:users_app_metadata update:users_app_metadata delete:users_app_metadata"
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
      onRedirectCallback={onRedirectCallback}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TripViewer />} />
          <Route path="/admin" element={<AdminRoute><PortalAdmin /></AdminRoute>} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </Auth0Provider>
  </React.StrictMode>
);
