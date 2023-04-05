// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { addMessage } from '@/stores'
import { MyMessage } from '@/types/message'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === 'POST') {
    const data: MyMessage = JSON.parse(req.body)
    addMessage(data)
    console.log('POST', data)
    res.status(200).json({})
  }

}
