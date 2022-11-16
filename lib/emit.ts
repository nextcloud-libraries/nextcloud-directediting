interface _Window extends Window {
	webkit ?: any,
	DirectEditingMobileInterface: MessagePort|undefined,
}
declare var window: _Window;

type Attributes = {
	[id: string]: any;
}

/**
 * May be used to hint to the client how a file download should be handled. It is up to the clients to implement the
 * specific handling behaviour:
 * 	- Default: No special handling
 * 	- Print: File should be printed
 * 	- Slideshow: File should be shown in a presentation view
 *
 * 	@see DirectEditEmit#downloadAs
 */
export enum DownloadType {
	Default = 'default',
	Print = 'print',
	SlideShow = 'slideshow'
}

/**
 * Lists the functions for emitting events to the client. The handling of each event is left to the client.
 */
export const DirectEditEmit = {
	/**
	 * Informs the client that the document is being closed.
	 */
	close(): void {
		post('close')
	},

	/**
	 * Requests the client to download the file.
	 * Optionally a download type can be specified which can infer additional handling.
	 * @see DownloadType
	 */
	downloadAs(url: string, type: DownloadType = DownloadType.Default): void {
		post('downloadAs', { url, type })
	},

	/**
	 * Request the client to rename the document.
	 */
	fileRename(newName: string): void {
		post('fileRename', { newName })
	},

	/**
	 * Request the client to follow the hyperlink.
	 */
	hyperlink(url: string): void {
		post('hyperlink', { url } )
	},

	/**
	 * Requests the clients for an image attachment.
	 */
	insertImage(): void {
		post('insertImage')
	},

	/**
	 * Informs the client that the document is loading.
	 */
	loading(): void {
		post('loading')
	},

	/**
	 * Informs the client that the document has finished loading.
	 */
	loaded(): void {
		post('loaded')
	},

	/**
	 * Requests the client to insert the clipboard contents.
	 */
	paste(): void {
		post('paste')
	},

	/**
	 * Request the client to share the document.
	 */
	share(): void {
		post('share')
	},
}

function post(messageName: string, attributes: Attributes = {}) {
	console.debug(`DirectEdit post: ${messageName}`, { attributes })
	let attributesString: string|null = null
	try {
		attributesString = JSON.stringify(attributes)
	} catch (e) { }

	// Forward to mobile handler
	if (window.DirectEditingMobileInterface && typeof window.DirectEditingMobileInterface[messageName] === 'function') {
		if (attributesString === null || typeof attributesString === 'undefined') {
			window.DirectEditingMobileInterface[messageName]()
		} else {
			window.DirectEditingMobileInterface[messageName](attributesString)
		}
	}

	let message: any = messageName
	if (Object.keys(attributes).length > 0) {
		message = {
			MessageName: messageName,
			Values: attributes,
		}
	}

	// iOS webkit fallback
	if (
		window.webkit
		&& window.webkit.messageHandlers
		&& window.webkit.messageHandlers.DirectEditingMobileInterface
	) {
		window.webkit.messageHandlers.DirectEditingMobileInterface.postMessage(message)
	}
	window.postMessage(message) // TODO: does this make sense?
}
