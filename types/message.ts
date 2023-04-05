export type ServerMessage = {
  type: 'message',
  user: string | null,
  data: string
} | {
  type: 'total'
  data: number
}

export type ClientMessage = {
  user: string
  msg: string
}
