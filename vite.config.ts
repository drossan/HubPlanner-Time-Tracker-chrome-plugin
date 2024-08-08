import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'

import { resolve } from 'path';

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@ui': resolve(__dirname, 'src/ui'),
			'@hooks': resolve(__dirname, 'src/hooks'),
			'@projectTypes': resolve(__dirname, 'types.d.ts'),
		},
	},
	build: {
		target: "esnext",
		rollupOptions: {
			output: {
				assetFileNames: `assets/[name].[ext]`
			}
		},
	},
});
