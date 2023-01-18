import { Channel, Profile } from './../types/index';
import { useRouter } from 'next/router';
/* eslint-disable react-hooks/exhaustive-deps */
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { createClient, User, Session, PostgrestResponse } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { Database } from '@/types/supabase';
import { groupBy } from 'lodash';

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

// export const useChannels = async () => {
//   const { supabase, user, session } = useSupabase();
//   const [channels, setChannels] = useState<Channel[] | null | undefined>(null)

//   useEffect(() => {
//     (async () => {
//       const getUserChannels = async () => {

//       }
//     })()
//   }, [session])
// }

export const useSupabase = () => {
  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  const session = useSession()
  const [channels, setChannels] = useState<{ list: Channel[], members: any } | null | undefined>(null)
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

      const getUserChannels = async () => {
        if (user?.id) {
          const { data: userChannelsData } = await supabase
            .from('members')
            .select(`channels(*)`)
            .eq("user_id", user.id)

          const userChannels = await userChannelsData?.map(c => c.channels as Channel)

          if (userChannels) {
            const { data: membersInChannels } = await supabase
              .from('members')
              .select(`channel_id, profiles(*)`)
              .in(`channel_id`, userChannels.map(c => c.id))

            await supabase
              .channel(`public:channels:id=in.${userChannels.map(c => c.id)}`)
              .on(
                'postgres_changes',
                {
                  event: "*",
                  schema: "public",
                  table: "channels",
                  filter: `id=in.${userChannels.map(c => c.id)}`
                },
                (payload: any) => {
                  setChannels(payload.new)
                }
              )
              .subscribe()
            return { list: userChannels, members: groupBy(membersInChannels, "channel_id") };
          } else {
            return null
          }
        }
      }
      const userProfile = await getUserProfile()
      const userChannels = await getUserChannels()
      setProfile(userProfile)
      setChannels(userChannels)
    })()
  }, [session])
  return { profile, session, supabase, user, channels }
}