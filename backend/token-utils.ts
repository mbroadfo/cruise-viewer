import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

export async function getManagementToken(): Promise<string> {
  const clientId = import.meta.env.VITE_AUTH0_MGMT_CLIENT_ID;
  const audience = "https://dev-jdsnf3lqod8nxlnv.us.auth0.com/api/v2/";

  // 🔐 Fetch secret from Secrets Manager
  const secretsClient = new SecretsManagerClient({ region: "us-west-2" });
  const secretResponse = await secretsClient.send(new GetSecretValueCommand({
    SecretId: "cruise-finder-secrets"
  }));

  const secrets = JSON.parse(secretResponse.SecretString || "{}");
  const clientSecret = secrets.AUTH0_MGMT_CLIENT_SECRET;

  const res = await fetch("https://dev-jdsnf3lqod8nxlnv.us.auth0.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      audience: audience,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Auth0 token error: ${err.error || res.statusText}`);
  }

  const data = await res.json();
  return data.access_token;
}
