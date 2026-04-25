import { buildDefaultDestinationPool } from './destinationFactory'

/**
 * @typedef {Object} Destination
 * @property {string} id
 * @property {string} name
 * @property {'city' | 'food' | 'culture' | 'water' | 'mountain' | 'grassland' | 'desert' | 'plateau'} preferenceCategory
 * @property {string} tagline
 * @property {string} mood
 * @property {string} reason
 * @property {string} coupleTask
 * @property {string} color
 */

export const WHEEL_DESTINATION_COUNT = 12

/**
 * @type {Destination[]}
 */
export const DEFAULT_DESTINATION_POOL = buildDefaultDestinationPool()

export const DEFAULT_DESTINATIONS = DEFAULT_DESTINATION_POOL
