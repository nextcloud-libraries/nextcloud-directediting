interface _Window extends Window {
	webkit ?: any,
}
declare var window: _Window;

type Attributes = {
	[id: string]: any;
}

/**
 * May be used to hint to the client how a file download should be handled. It is up to the clients to implement the
 * specific handling behaviour.
 *
 * 	@link DirectEditEmit.downloadAs
 */
export enum DownloadType {
	/** No special handling */
	Default = 'default',
	/** File should be printed */
	Print = 'print',
	/** File should be shown in a presentation view */
	SlideShow = 'slideshow'
}

/**
 * Lists the functions for emitting events to the client. The handling of each event is left to the client.
 */
export class DirectEditEmit {
	private readonly interfaceName: string

	/**
	 * A custom interface name may be provided. A different interface name should only be provided in exceptional cases,
	 * such as for backward-compatibility or in cases where multiple apps are emitting events at the same time.
	 */
	constructor (interfaceName: string = 'NextcloudDirectEditInterface') {
		this.interfaceName = interfaceName
	}

	/**
	 * Informs the client that the document is being closed.
	 */
	close(): void {
		this.post('close')
	}

	/**
	 * Requests the client to download the file.
	 * Optionally a download type can be specified which can infer additional handling.
	 * @see DownloadType
	 */
	downloadAs(url: string, type: DownloadType = DownloadType.Default): void {
		this.post('downloadAs', { url, type })
	}

	/**
	 * Request the client to rename the document.
	 */
	fileRename(newName: string): void {
		this.post('fileRename', { newName })
	}

	/**
	 * Request the client to follow the hyperlink.
	 */
	hyperlink(url: string): void {
		this.post('hyperlink', { url } )
	}

	/**
	 * Requests the clients for an image attachment.
	 */
	insertImage(): void {
		this.post('insertImage')
	}

	/**
	 * Informs the client that the document is loading.
	 */
	loading(): void {
		this.post('loading')
	}

	/**
	 * Informs the client that the document has finished loading.
	 */
	loaded(): void {
		this.post('loaded')
	}

	/**
	 * Requests the client to insert the clipboard contents.
	 */
	paste(): void {
		this.post('paste')
	}

	/**
	 * Request the client to share the document.
	 */
	share(): void {
		this.post('share')
	}

	/**
	 * Determines whether there is a direct-edit interface available which will listen to the emitted events.
	 */
	isInterfaceAvailable(): boolean {
		return this.getInterface() !== null || this.getIOsInterface() !== null;
	}

	private post(messageName: string, attributes: Attributes = {}) {
		let attributesString: string|null = null
		try {
			attributesString = JSON.stringify(attributes)
		} catch (e) { }

		// Forward to mobile handler
		const directEditInterface = this.getInterface()
		if (directEditInterface && typeof directEditInterface[messageName] === 'function') {
			if (Object.keys(attributes).length === 0 || typeof attributesString === 'undefined') {
				directEditInterface[messageName]()
			} else {
				directEditInterface[messageName](attributesString)
			}
		}

		// iOS webkit fallback
		let message: any = messageName
		if (Object.keys(attributes).length > 0) {
			message = {
				MessageName: messageName,
				Values: attributes,
			}
		}

		const iosInterface = this.getIOsInterface()
		if (iosInterface) {
			iosInterface.postMessage(message)
		}
	}

	private getInterface(): any {
		return window[this.interfaceName] ?? null;
	}

	private getIOsInterface(): MessagePort|null {
		if (!window.webkit || !window.webkit.messageHandlers) {
			return null;
		}

		return window.webkit.messageHandlers[this.interfaceName] ?? null;
	}
}
