'use client';
import { useEffect } from 'react';
import { useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react';

export default function InitUserToDatabase() {
  const { session } = useSessionContext();
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (!session?.user) return;

    const syncUser = async () => {
      const { id, user_metadata } = session.user;

      const { error } = await supabase
        .from('user_profiles')
        .upsert([
          {
            id,
            username: user_metadata?.username || 'Unknown',
          },
        ]);

      if (error) {
        console.error('❌ Error syncing user to user_profiles:', error.message);
      } else {
        console.log('✅ Synced user to user_profiles');
      }
    };

    syncUser();
  }, [session, supabase]);

  return null;
}
