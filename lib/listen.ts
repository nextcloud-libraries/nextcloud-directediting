/**
 * Handler function type for event handling functions.
 * @param data - The data received from the post message.
 * @see DirectEditListen
 */
export type Handler = { (data:any): void }

enum EventType {
	Close= 'close',
	PostAsset= 'postAsset',
	GrabFocus= 'grabFocus'
}

/**
 * Provides the set of events that can be handled by the app. These events are triggered by the clients and may be in
 * response to a previously emitted event or as action performed in the client UI.
 */
export const DirectEditListen = {
	/**
	 * Close event, which is sent when the app is closed via the client (e.g. back button).
	 */
	onClose(handler: Handler): void {
		handlePostMessageEvent(EventType.Close, handler)
	},

	/**
	 * Post asset event is triggered when client sends an asset (such as an attachment) to the app.
	 */
	onPostAsset(handler: Handler): void {
		handlePostMessageEvent(EventType.PostAsset, handler)
	},

	/**
	 * Grab focus event is triggered when the client returns focus to the app, so the app my remove any idle screens or
	 * re-initialises any timed-out connections.
	 */
	onGrabFocus(handler: Handler): void {
		handlePostMessageEvent(EventType.GrabFocus, handler)
	}
}

function handlePostMessageEvent(type: EventType, handler:  Handler): void {
	window.addEventListener('message', (event ) => {
		// TODO: check origin?
		if (event.data.type === type) {
			handler(event.data)
		}
	})
}
