import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
import { MyMessage } from '@/types/message'

const defaultUser = '匿名用户'

export default function Home() {
	const [user, setUser] = useState('')
	const [inputMsg, setInputMsg] = useState('')
	/** from为null代表系统消息，self代表自己发送的消息 */
	const [messageList, setMessageList] = useState<(MyMessage & { self?: boolean })[]>([])

	useEffect(() => {
		const interval = setInterval(() => {
			fetch('/api/getMessage', {
				method: 'GET',
			})
				.then((res) => res.json())
				.then((data: MyMessage[]) => {
					data.forEach((message) => {
						if (messageList.every((item) => item.id !== message.id)) {
							setMessageList((list) => [...list, message])
						}
					})
				})
		}, 3000)

		return () => {
			clearInterval(interval)
		}
	}, [messageList])

	const sendMessage = async () => {
		if (!inputMsg) return

		const id = nanoid()

		const message = {
			id,
			user: user || defaultUser,
			msg: inputMsg,
		}

		fetch('/api/sendMessage', {
			method: 'POST',
			body: JSON.stringify(message),
		})

		setInputMsg('')
		setMessageList((list) => [
			...list,
			{
				...message,
				self: true,
			},
		])
	}

	return (
		<>
			<h5>这是基于next jsAPI 轮询的简单在线聊天室</h5>

			{messageList.map((item, index) => (
				<div key={index}>
					<span>{`user-${item.user}-`}</span>
					<span>msg:{item.msg}</span>
				</div>
			))}

			<span>用户名</span>
			<input value={user} onChange={(e) => setUser(e.target.value)} placeholder={defaultUser} max={5}></input>

			<br></br>

			<input value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} max={100}></input>
			<button onClick={sendMessage}>send</button>
		</>
	)
}
