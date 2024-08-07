/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

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
export class DirectEditListen {
	/**
	 * Close event, which is sent when the app is closed via the client (e.g. back button).
	 */
	onClose(handler: Handler): void {
		this.handlePostMessageEvent(EventType.Close, handler)
	}

	/**
	 * Post asset event is triggered when client sends an asset (such as an attachment) to the app.
	 */
	onPostAsset(handler: Handler): void {
		this.handlePostMessageEvent(EventType.PostAsset, handler)
	}

	/**
	 * Grab focus event is triggered when the client returns focus to the app, so the app my remove any idle screens or
	 * re-initialises any timed-out connections.
	 */
	onGrabFocus(handler: Handler): void {
		this.handlePostMessageEvent(EventType.GrabFocus, handler)
	}

	private handlePostMessageEvent(type: EventType, handler:  Handler): void {
		window.addEventListener('message', (event ) => {
			if (event.data.type === type) {
				handler(event.data)
			}
		})
	}
}
