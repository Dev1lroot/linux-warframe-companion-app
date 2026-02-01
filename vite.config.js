import { fileURLToPath, URL } from 'node:url'
import fs from 'fs'
import path from 'path'
import { parse } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(
{
	plugins:
	[
		vue(),
		vueDevTools(),
	],
	resolve:
	{
		alias:
		{
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	server:
	{
		proxy:
		{
			'/api/warframe/WorldState':
			{
				target: 'https://api.warframe.com/cdn/worldState.php',
				changeOrigin: true,
				rewrite: (p) => p.replace(/^\/api\/warframe\/WorldState/, ''),
			},
		},
		middlewareMode: false,
	},
	middleware: (req, res, next) =>
	{
		const url = parse(req.url, true)
		const match = url.pathname.match(/^\/api\/json\/(.+)$/)

		if (!match) return next()

		const file = match[1]
		const filePath = path.resolve('api/json', `${file}.json`)

		if (!fs.existsSync(filePath))
		{
			res.statusCode = 404
			return res.end('Not found')
		}

		res.setHeader('Content-Type', 'application/json')
		res.end(fs.readFileSync(filePath))
	},
})
