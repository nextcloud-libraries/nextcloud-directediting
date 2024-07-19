<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

# @nextcloud/directediting

[![REUSE status](https://api.reuse.software/badge/github.com/nextcloud-libraries/nextcloud-directediting)](https://api.reuse.software/info/github.com/nextcloud-libraries/nextcloud-directediting)

This library provides standardised functions for direct-editing interaction between the Nextcloud app and the clients.

## Installation

// TODO

## Usage
```js
import { DirectEditEmit, DirectEditListen } from '@nextcloud/directediting'

const directEditListen = new DirectEditisten()
const directEditEmit = new DirectEditEmit()

const MyApp = {
    registerEvents() {
        directEditListen.onClose(this.close)
    },
    
    async startup() {
        this.registerEvents()
        directEditEmit.loading()
        await this.load()
        directEditEmit.loaded()
    },
    
    close() {
        /* save changes, unmount, destroy ... */
        directEditEmit.close()
    },
    
    async load() { /* load the app... */ },
}
```
