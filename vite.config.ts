import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, mkdirSync } from 'fs';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
	plugins: [
		{
			name: 'custom-copy',
			writeBundle() {
				mkdirSync('dist/images', { recursive: true });
				copyFileSync('public/manifest.json', 'dist/manifest.json');
				copyFileSync('public/popup.html', 'dist/popup.html');
				copyFileSync('public/tracker.html', 'dist/tracker.html');
				copyFileSync('public/images/icon-16.png', 'dist/images/icon-16.png');
				copyFileSync('public/images/icon-48.png', 'dist/images/icon-48.png');
				copyFileSync('public/images/icon-128.png', 'dist/images/icon-128.png');
				copyFileSync('public/images/play.png', 'dist/images/play.png');
				copyFileSync('public/images/stop.png', 'dist/images/stop.png');
			}
		}
	],
	css: {
		postcss: {
			plugins: [
				tailwindcss,
				autoprefixer,
			],
		},
	},
	build: {
		rollupOptions: {
			input: {
				background: resolve(__dirname, 'src/background.ts'),
				content: resolve(__dirname, 'src/content.ts'),
				popup: resolve(__dirname, 'src/popup.ts'),
				tracker: resolve(__dirname, 'src/tracker.ts'),
				css: resolve(__dirname, 'src/index.css'),
			},
			output: {
				entryFileNames: `src/[name].js`,
				chunkFileNames: `src/[name].js`,
				assetFileNames: `assets/[name].[ext]`
			}
		},
		outDir: 'dist',
		emptyOutDir: true
	},
});
