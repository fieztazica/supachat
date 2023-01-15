// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { User } from '@supabase/supabase-js'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function getUser(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'John Doe' })
}
