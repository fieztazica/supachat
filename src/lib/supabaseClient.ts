import { Channel, Member, Profile } from './../types/index';
import { useRouter } from 'next/router';
/* eslint-disable react-hooks/exhaustive-deps */
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { createClient, User, Session, PostgrestResponse, RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { Database } from '@/types/supabase';
import { useForceUpdate } from '@chakra-ui/react';

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

export const useChannel = (channelId: number) => {
  const { channels, supabase } = useSupabase()
  const [members, setMembers] = useState<Profile[] | null | undefined>(null)
  const channel = channels.find((c) => c.id === channelId)
  if (!channel) return null;

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
  const [profile, setProfile] = useState<Profile | null | undefined>(null)
  const [channels, setChannels] = useState<Channel[]>([]);

  useEffect(() => {
    (async () => {
      if (!session?.user.id) return;
      const getUserProfile = async () => {
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
              (payload: RealtimePostgresChangesPayload<Profile>) => {
                setProfile(payload.new as Profile)
              }
            )
            .subscribe()
          return userProfile
        } else {
          return null
        }
      }

      const getUserChannels = async () => {
        const { data: userChannelsData } = await supabase
          .from("members")
          .select(`channel:channels(*)`)
          .eq("user_id", session.user.id)
          .eq("is_joined", true);

        if (!!userChannelsData) {
          const userChannels = Array.isArray(userChannelsData)
            ? userChannelsData.map((d) => d.channel as Channel)
            : userChannelsData === null
              ? []
              : [userChannelsData];

          await supabase
            .channel(
              `public:channels`
            )
            .on(
              "postgres_changes",
              {
                event: "UPDATE",
                schema: "public",
                table: "channels",
                // filter: `id=in.(${userChannels.map((c) => c.id).join(",")})`,
              },
              (payload: RealtimePostgresChangesPayload<Channel>) => {
                // if (!(userChannels.includes(payload.new as Channel) || userChannels.includes(payload.old as Channel))) return;

                const oldChannel = payload.old as Channel;
                const newChannel = payload.new as Channel;

                if (userChannels.some((c) => c.id === oldChannel.id || c.id === newChannel.id)) {
                  // console.log("channels", payload);
                  // setChannels((old) => {
                  //   const newChannels = [...old];
                  //   const index = old.findIndex(
                  //     (c) => c.id === oldChannel.id
                  //   );
                  //   newChannels.splice(index, 1, newChannel);
                  //   return newChannels;
                  // });
                  (async () => {
                    setChannels(await getUserChannels());
                  })
                }
              }
            )
            .subscribe();

          return userChannels;
        } else {
          return [];
        }
      };

      const fetchChannelOnEvent = async () => {
        await supabase
          .channel(`active:public:members:user_id=eq.${session.user.id}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "members",
              filter: `user_id=eq.${session.user.id}`,
            },
            (payload: RealtimePostgresChangesPayload<Member>) => {
              (async () => {
                // console.log("members", payload);

                setChannels(await getUserChannels());

                // if (!!payload.eventType) {
                //   const newPayload = payload.new as Member;
                //   const oldPayload = payload.old as Member;

                //   const { data, error } = await supabase
                //     .from("channels")
                //     .select()
                //     .eq("id", newPayload.channel_id)
                //     .single();

                //   if (!!data) {
                //     switch (payload.eventType) {
                //       case "INSERT":
                //         setChannels((old) => [...old, data]);
                //         break;
                //       case "DELETE":
                //         setChannels((old) =>
                //           old.filter((c) => c.id !== oldPayload.channel_id)
                //         );
                //         break;
                //       case "UPDATE":
                //         setChannels(await getUserChannels());
                //         break;
                //     }
                //   }
                // }
              })();
            }
          )
          .subscribe();
      };

      setChannels(await getUserChannels());
      fetchChannelOnEvent();

      const userProfile = await getUserProfile()
      setProfile(userProfile)
    })()
  }, [session])
  return { profile, session, supabase, user, channels }
}