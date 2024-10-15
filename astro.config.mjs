// @ts-check
import { defineConfig } from 'astro/config';

import node from '@astrojs/node';
import { refreshContent } from './src/refreshContent';

// https://astro.build/config
export default defineConfig({
	output: 'server',
	adapter: node({
		mode: 'standalone',
	}),
	integrations: [refreshContent],
});
