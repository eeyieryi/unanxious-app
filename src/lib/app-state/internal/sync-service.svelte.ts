// import { env } from '$env/dynamic/public';

// import { type Doc } from 'yjs';
// import { createYjsProvider, type YSweetProviderWithClientToken } from '@y-sweet/client';

export class SyncService {
	constructor() {
		throw new Error('NOT IMPLEMENTED');
	}
	// syncProvider = $state<YSweetProviderWithClientToken | null>(null);
	// doc = $state<Doc>();
	// docId: string;
	// constructor(d: Doc, docId: string) {
	// 	this.doc = d;
	// 	this.docId = docId;
	// }
	// async enableSync() {
	// 	if (!this.doc) return;
	// 	console.log('Enabling sync...');
	// 	this.syncProvider = await createYjsProvider(this.doc, this.docId, env.PUBLIC_SYNC_SERVER_URL, {
	// 		connect: true
	// 	});
	// }
	// disableSync() {
	// 	console.log('Disabling sync...');
	// 	this.syncProvider?.disconnect();
	// 	this.syncProvider = null;
	// }
}
