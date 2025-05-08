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
import { sendDebugLog } from "./utils/debugLogs";

if (typeof window !== "undefined") {
  const isMobile = window.innerWidth < 500;
  window.debugInfo = {
    mobile: isMobile,
    userAgent: navigator.userAgent,
    screen: {
      width: window.innerWidth,
      height: window.innerHeight
    }
  };
  console.log("🧪 Booting cruise-viewer", window.debugInfo);
  sendDebugLog({ type: "boot", ...window.debugInfo });
}

if (typeof window !== "undefined" && window.innerWidth < 500) {
  console.log("📱 Forcing loginWithRedirect() on mobile startup");
  const params = new URLSearchParams(window.location.search);
  const isReturningFromAuth = params.has("code") || params.has("error");
  const alreadyRedirecting = sessionStorage.getItem("loginStarted");

  if (!isReturningFromAuth && !alreadyRedirecting) {
    sessionStorage.setItem("loginStarted", "true");
    sendDebugLog({ type: "mobile-login-init", params: Object.fromEntries(params.entries()) });
    window.location.href = `https://${config.auth0.domain}/authorize?` +
      new URLSearchParams({
        client_id: config.auth0.clientId,
        redirect_uri: window.location.origin,
        response_type: "code",
        audience: "https://cruise-viewer-api",
        scope: "openid profile email",
      });
  }
}

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
  domain={config.auth0.domain}
  clientId={config.auth0.clientId}
  authorizationParams={{
    redirect_uri: window.location.origin,
    audience: "https://cruise-viewer-api",
    scope: "openid profile email offline_access read:users create:users_app_metadata read:users_app_metadata update:users_app_metadata delete:users_app_metadata",
    response_mode: isIOS ? "web_message" : "query",
    prompt: isIOS ? "login" : undefined
  }}
  cacheLocation="localstorage"
  useRefreshTokens={true}
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
sendDebugLog({ type: "render-complete", location: window.location.href });
