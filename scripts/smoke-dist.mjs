// Loads the built package through its own name (package self-reference), exactly as a consumer would in plain
// Node, to catch module-format and export-map problems that bundlers and Jest hide. Run after `yarn build`.
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

import Emittify from '@iremlopsum/emittify'
import ReactEmittify from '@iremlopsum/emittify/react'

const require = createRequire(import.meta.url)

const emitter = new Emittify({ cachedEvents: ['rating'] })
emitter.send('rating', 0)
assert.equal(emitter.getCache('rating', 4), 0, 'ESM import: core send/getCache')

assert.equal(typeof new ReactEmittify().useEventListener, 'function', 'ESM import: react entry')

const required = require('@iremlopsum/emittify')
assert.equal(new required.default().constructor, Emittify, 'require(): core entry (via require(esm))')

const EmittifyMock = require('@iremlopsum/emittify/mock').default
const mock = new EmittifyMock(() => () => undefined)
assert.equal(typeof mock.send, 'function', 'require(): mock entry')
assert.throws(() => new EmittifyMock(), /no spy factory found/, 'mock: helpful error without jest/vi')

console.log(`dist smoke test passed on Node ${process.version}`)
