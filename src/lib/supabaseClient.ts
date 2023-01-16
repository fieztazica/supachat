import { Profile } from './../types/index';
import { useRouter } from 'next/router';
/* eslint-disable react-hooks/exhaustive-deps */
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { createClient, User, Session, PostgrestResponse } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { Database } from '@/types/supabase';

export const supabaseBeClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const useProfile = () => {
  const { profile } = useSupabase()
  return profile;
}

export const getProfiles = async (userIds: string[]) => {

  return await supabaseBeClient
    .from('profiles')
    .select('*')
    .in('id', userIds)
}

export const getProfile = async (userId: string) => {
  
  return await supabaseBeClient
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .limit(1)
    .single();
}

export const useSupabase = () => {
  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  const session = useSession()
  const [profile, setProfile] = useState<Profile | null | undefined>(null)

  useEffect(() => {
    (async () => {
      const getUserProfile = async () => {
        if (session?.user.id) {
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .limit(1)
            .single();

          if (userProfile !== null) {
            await supabase
              .channel(`public:profiles:id=eq.${userProfile.id}`)
              .on(
                'postgres_changes',
                {
                  event: "UPDATE",
                  schema: "public",
                  table: "profiles",
                  filter: `id=eq.${userProfile.id}`
                },
                (payload: any) => {
                  setProfile(payload.new)
                }
              )
              .subscribe()
            return userProfile
          } else {
            return null
          }
        }
      }
      const userProfile = await getUserProfile()
      setProfile(userProfile)
    })()
  }, [session])
  return { profile, session, supabase, user }
}