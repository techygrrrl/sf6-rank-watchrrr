import EventEmitter from 'node:events'

export const EVENT_RANK_CHANGED = 'rankChanged'

export const rankEmitter = new EventEmitter()
