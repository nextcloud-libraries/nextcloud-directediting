# @nextcloud/directediting

This library provides standardised functions for direct-editing interaction between the Nextcloud app and the clients.

## Installation

// TODO

## Usage
```js
import { DirectEditEmit, DirectEditListen } from '@nextcloud/directediting'

const MyApp = {
    registerEvents() {
        DirectEditListen.onClose(this.close)
    },
    
    async startup() {
        this.registerEvents()
        DirectEditEmit.loading()
        await this.load()
        DirectEditEmit.loaded()
    },
    
    close() {
        /* save changes, unmount, destroy ... */
        DirectEditEmit.close()
    },
    
    async load() { /* load the app... */ },
}
```
