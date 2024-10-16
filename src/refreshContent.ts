import type { AstroIntegration } from "astro";

export const refreshContent: AstroIntegration = {
	name: 'refreshContent',
	hooks: {
		'astro:server:setup': async ({ server, refreshContent }) => {
			// Register a dev server webhook endpoint
			server.middlewares.use('/_refresh', async (req, res) => {
				if (req.method !== 'POST') {
					res.statusCode = 405
					res.end('Method Not Allowed');
					return
				}
				if (refreshContent) {
					await refreshContent({
						loaders: ['file-loader'],
						context: {}
					});
					res.writeHead(200, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify({ message: 'Content refreshed successfully' }));
				}
			});
		}
	}
};