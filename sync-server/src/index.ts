import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';

import { DocumentManager } from '@y-sweet/sdk';

declare module 'bun' {
	interface Env {
		YS_CONNECTION_STRING: string | undefined;
		SYNC_SERVER_PORT: string | undefined;
	}
}

const connectionString = Bun.env.YS_CONNECTION_STRING;
if (!connectionString) {
	throw new Error('YS_CONNECTION_STRING NOT SET');
}

const manager = new DocumentManager(connectionString);

const app = new Elysia()
	.use(swagger()) // /swagger
	.use(cors())
	.post('/yjs', async () => {
		// TODO: Authenticate
		// TODO: Save a document by user
		const clientToken = await manager.getOrCreateDocAndToken('demo-demo-demo');
		return JSON.stringify(clientToken);
	})
	.listen(Bun.env.SYNC_SERVER_PORT ?? 4321);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
