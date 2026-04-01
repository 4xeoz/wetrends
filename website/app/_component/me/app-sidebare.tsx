'use client';

import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import { AdminSidebar } from './admin-sidebar';

export function AppSidebar() {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    image?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const session = await getSession();
        if (session?.user) {
          setUser({
            id: session.user.id as string,
            name: session.user.name as string,
            email: session.user.email as string,
            image: session.user.image as string,
          });
        }
      } catch (error) {
        console.error('[Sidebar] Failed to fetch user:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, []);

  return <AdminSidebar user={user} />;
}
