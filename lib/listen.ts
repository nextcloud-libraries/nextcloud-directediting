interface Handler { (data:any): void }

enum EventType {
	Close= 'close',
	PostAsset= 'postAsset',
	GrabFocus= 'grabFocus'
}

export const Listen = {
	onClose(handler: Handler): void {
		handlePostMessageEvent(EventType.Close, handler)
	},

	onPostAsset(handler: Handler): void {
		handlePostMessageEvent(EventType.PostAsset, handler)
	},

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
