/* eslint-disable react-hooks/exhaustive-deps */
import { createClient, User, Session, PostgrestResponse } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

export const supabase = createClient(
  `${process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL}`,
  `${process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
)
export const useSupabase =  () => {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(null)
  const [session, setSession] = useState<Session | null | undefined>()

  
// const { data: { user } } = await supabase.auth.getUser()


  supabase.auth.onAuthStateChange(async (_event, session) => {
    setSession(session as Session | null)
  })

  useEffect(() => {
    (async () => {
      const getCurrentUser = async () => {
        if (session?.user.id) {
          const { data: currentUser } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id) as PostgrestResponse<User>

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