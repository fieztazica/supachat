import { Profile } from './../types/index';
import { useRouter } from 'next/router';
/* eslint-disable react-hooks/exhaustive-deps */
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { createClient, User, Session, PostgrestResponse } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { Database } from '@/types/supabase';

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
);

export const useSupabase = () => {
  const supabase = useSupabaseClient<Database>();

  const [currentUser, setCurrentUser] = useState<Profile | null | undefined>(null)
  const [session, setSession] = useState<Session | null | undefined>()

  // const { data: { user } } = await supabase.auth.getUser()

  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log(event, session)
    setSession(session)
  })

  useEffect(() => {
    (async () => {
      const getCurrentUser = async () => {
        if (session?.user.id) {
          const { data: currentUser } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id);

          if (currentUser?.length) {
            const foundUser = currentUser[0]
            await supabase
              .channel(`public:profiles:id=eq.${foundUser.id}`)
              .on(
                'postgres_changes',
                {
                  event: "UPDATE",
                  schema: "public",
                  table: "profiles",
                  filter: `id=eq.${foundUser.id}`
                },
                (payload: any) => {
                  setCurrentUser(payload.new)
                }
              )
              .subscribe()
            return foundUser
          } else {
            return null
          }
        }
      }
      const foundUser = await getCurrentUser()
      setCurrentUser(foundUser)
    })()
  }, [session])
  return { currentUser, session, supabase }
}