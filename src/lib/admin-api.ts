import { useAuth0 } from '@auth0/auth0-react';

export function useAdminApi() {
  const { getAccessTokenSilently } = useAuth0();

  const listUsers = async () => {
    const token = await getAccessTokenSilently();

    const response = await fetch('https://jwkw1ft2g7.execute-api.us-west-2.amazonaws.com/admin-api/users', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const data = await response.json();
    return data;
  };

  return { listUsers };
}
