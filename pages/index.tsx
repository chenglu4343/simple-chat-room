import { wsUrl } from '@/constant'
import { ClientMessage, ServerMessage } from '@/types/message'
import { useCallback, useEffect, useState } from 'react'

const defaultUser = '匿名用户'

export default function Home() {
	const [user, setUser] = useState('')
	const [inputMsg, setInputMsg] = useState('')
	const [socket, setSocket] = useState<WebSocket | null>(null)
	const [stateTip, setStateTip] = useState<'connecting' | 'connected' | 'disconnect' | 'loading'>('loading')
	/** from为null代表系统消息，self代表自己发送的消息 */
	const [messageList, setMessageList] = useState<{ msg: string; from: string | null; self?: boolean }[]>([])
	const [total, setTotal] = useState<number>(0)

	const connectSocket = useCallback(() => {
		setStateTip('connecting')
		const _socket = new WebSocket(wsUrl)
		setSocket(_socket)

		_socket.addEventListener('open', () => {
			setStateTip('connected')
		})

		_socket.addEventListener('close', () => {
			setStateTip('disconnect')
		})

		_socket.addEventListener('error', () => {
			setStateTip('disconnect')
		})

		_socket.addEventListener('message', (event) => {
			const message = JSON.parse(event.data) as ServerMessage
			const { data, type } = message

			if (type === 'message') {
				setMessageList((list) => [
					...list,
					{
						from: message.user,
						msg: data,
					},
				])
			} else if (type === 'total') {
				setTotal(data)
			}
		})

		return _socket
	}, [])

	useEffect(() => {
		const _socket = connectSocket()

		return () => {
			_socket.close()
		}
	}, [connectSocket])

	const sendMessage = () => {
		if (!inputMsg) return

		socket?.send(
			JSON.stringify({
				user: user || defaultUser,
				msg: inputMsg,
			} as ClientMessage)
		)

		setInputMsg('')
		setMessageList((list) => [
			...list,
			{
				self: true,
				from: user || defaultUser,
				msg: inputMsg,
			},
		])
	}

	return (
		<>
			<h1>当前在线人数：{total}</h1>

			<h1>当前连接状态：{stateTip}</h1>

			{messageList.map((item, index) => (
				<div key={index}>
					<span>{item.from === null ? 'system-' : `user-${item.from}-`}</span>
					<span>msg:{item.msg}</span>
				</div>
			))}

			{stateTip === 'disconnect' && (
				<>
					<button onClick={connectSocket}>reconnect</button>
					<br></br>
				</>
			)}

			{stateTip === 'connected' && (
				<>
					<span>用户名</span>
					<input value={user} onChange={(e) => setUser(e.target.value)} placeholder={defaultUser} max={5}></input>

					<br></br>

					<input value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} max={100}></input>
					<button onClick={sendMessage}>send</button>
				</>
			)}
		</>
	)
}
