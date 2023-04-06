/* eslint-disable @next/next/no-title-in-document-head */
import { Html, Main, NextScript, Head } from 'next/document'

export default function Document() {
	return (
		<Html lang="zh">
			<Head>
				<title>在线聊天室</title>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
