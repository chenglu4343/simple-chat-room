import { MyMessage } from '@/types/message'

export const messageList: MyMessage[] = []

export function addMessage(message: MyMessage) {
  messageList.push(message)
  setTimeout(() => {
    const index = messageList.findIndex(item => item === message)
    if (index !== -1) {
      messageList.splice(index, 1)
    }
  }, 3000)
}
