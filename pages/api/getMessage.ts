// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { messageList } from '@/stores'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<typeof messageList>
) {
  res.status(200).json(messageList)
}
