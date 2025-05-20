import { useEffect, useState } from 'react';
import { config } from '../config';

export function useFavorites(user, apiToken) {
  const [favorites, setFavorites] = useState([]);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!user?.email || !apiToken) return;
    fetchUserFavorites(apiToken, user.email).then(setFavorites);
  }, [user, apiToken]);

  const toggleFavorite = (code) => {
    setFavorites((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code].slice(-20)
    );
    setIsDirty(true);
  };

  const saveFavorites = async () => {
    try {
      const res = await fetch(`${config.apiBaseUrl}/admin-api/user/favorites`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({ email: user.email, favorites }),
      });
      if (!res.ok) throw new Error('Failed to save');
      setIsDirty(false);
    } catch (err) {
      console.error('Save favorites failed:', err);
    }
  };

  return { favorites, toggleFavorite, saveFavorites, isDirty };
}

async function fetchUserFavorites(token, email) {
  try {
    const res = await fetch(`${config.apiBaseUrl}/admin-api/user?email=${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch');
    const { data } = await res.json();
    return data?.user?.app_metadata?.favorites || [];
  } catch {
    return [];
  }
}