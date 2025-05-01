import { useAuth0 } from '@auth0/auth0-react';

export function useAccessToken() {
  const { getAccessTokenSilently } = useAuth0();

  const getCachedAccessToken = async () => {
    return await getAccessTokenSilently({
      authorizationParams: {
        audience: 'https://https://cruise-admin-api',
      },
    });
  };

  return { getCachedAccessToken };
}
