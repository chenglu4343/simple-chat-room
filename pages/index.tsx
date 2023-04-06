import { useEffect, useState, useRef } from 'react'
import { nanoid } from 'nanoid'
import { MyMessage } from '@/types/message'
import { Input } from 'antd'
import styles from '@/styles/Home.module.scss'

import 'antd/dist/reset.css';

const defaultUser = '匿名用户'

export default function Home() {
	const listRef = useRef<HTMLDivElement | null>(null)
	const [isBottom, setIsBottom] = useState(true)
	const [user, setUser] = useState('')
	const [inputMsg, setInputMsg] = useState<string | undefined>(undefined)
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
		}, 1000)

		return () => {
			clearInterval(interval)
		}
	}, [messageList])

	useEffect(() => {
		const element = listRef.current
		if (element && isBottom) {
			element.scrollTo({
				behavior: 'auto',
				top: element.scrollHeight
			})
		}
	}, [messageList, isBottom])

	const handleScroll = () => {
		const element = listRef.current
		if (element) {
			if (Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) < 5) {
				setIsBottom(true)
			} else {
				setIsBottom(false)
			}
		}
	}

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

		/** fix：enter过后留有空白符 */
		setTimeout(() => {
			setInputMsg(undefined)
		})
		setMessageList((list) => [
			...list,
			{
				...message,
				self: true,
			},
		])
	}

	return (
		<main className={styles.main}>
			<h1 className={styles.header}>这是基于next jsAPI 轮询的简单在线聊天室</h1>

			<div className={styles['msg-list']} ref={listRef} onScroll={handleScroll}>
				{messageList.map((item, index) => (
					<div key={index} className={`${styles['msg-container']} ${item.self && styles.self}`}>
						<div className={styles.user}>{item.user}</div>
						<div className={styles.msg}>{item.msg}</div>
					</div>
				))}
			</div>

			<div className={styles.footer}>
				<span>用户名:</span>
				<Input value={user} onChange={(e) => setUser(e.target.value)} placeholder={defaultUser} maxLength={5}></Input>

				<span>消息:</span>
				<Input.TextArea value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} maxLength={100} placeholder='message' showCount onPressEnter={sendMessage}></Input.TextArea>
			</div>
		</main>
	)
}
