import { Channel } from "@/types";
import { Database } from "@/types/supabase";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { NextRouter } from "next/router";

export const handleJoin = ({
    router, user, toast, supabase, channels, channel
}: {
    router: NextRouter,
    user: User | null,
    toast?: any,
    supabase: SupabaseClient<Database>,
    channels: any,
    channel: Channel
}) => {
    try {
        (async () => {
            if (!user || !supabase) {
                return router.push(
                    `/login?redirectTo=${encodeURIComponent(window.location.href)}`
                );
            }
            if (!!channels.includes(channel))
                return router.push(`/chat/${channel.id}`);

            const { data: isExist, error: existError } = await supabase
                .from("members")
                .select()
                .eq("channel_id", channel.id)
                .eq("user_id", user.id)
                .limit(1)
                .single();

            if (existError || !isExist) {
                const { error: insertError } = await supabase.from("members").insert([
                    {
                        channel_id: channel.id,
                        user_id: user.id,
                        is_joined: channel.is_private ? false : true,
                        joined_at: channel.is_private ? null : new Date().toISOString(),
                    },
                ]);

                if (insertError) {
                    throw insertError
                } else {
                    if (channel.is_private) {
                        toast({
                            title: `Asked!`,
                            status: "success",
                        });
                    } else {
                        router.push(`/chat/${channel.id}`);
                    }
                }
            }

            if (isExist) {
                if (isExist.is_joined) {
                    router.push(`/chat/${channel.id}`);
                } else {
                    throw new Error("You have already asked!")
                }
            }
        })();
    } catch (error: any) {
        console.error(error);
        // if (error.redirect) {
        //     router.push(error.redirect);
        // } else {
            toast({
                title: `${error.message}`,
                status: "error",
            });
        // }

    }

};