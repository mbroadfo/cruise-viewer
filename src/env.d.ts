interface ImportMetaEnv {
    readonly VITE_AUTH0_MGMT_CLIENT_ID: string;
    readonly VITE_AUTH0_DOMAIN: string;
    readonly VITE_AUTH0_AUDIENCE: string;
    // Add more as needed...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  