// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { supabaseBeClient } from '@/lib/supabaseClient'
import { Channel } from '@/types'
import { User } from '@supabase/supabase-js'
import type { NextApiRequest, NextApiResponse } from 'next'

export type ResponseData = {
  channel?: Channel | null,
  error?: any | null
}

export default async function getChannelByVanityURL(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const supabase = supabaseBeClient;

    const { inviteId } = req.query;

    const { data: channel, error } = await supabase
      .from("channels")
      .select("*")
      .eq(`vanity_url`, inviteId)
      .limit(1)
      .single();

    if (error || !channel) {
      return res.status(404).json({
        error
      })
    }

    res.status(200).json({
      channel
    })
  } catch (error: any) {
    res.status(500).json({
      error
    })
  }

}
