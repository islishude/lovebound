import { describe, expect, it } from 'vitest'
import {
  DESTINATIONS_STORAGE_KEY,
  loadDestinations,
  resetDestinationsStorage,
  saveDestinations,
} from './storage'

const FALLBACK_DESTINATIONS = [
  {
    id: 'fallback',
    name: '杭州',
    tagline: 'fallback',
    mood: 'fallback',
    reason: 'fallback',
    coupleTask: 'fallback',
    color: '#ffffff',
  },
]

function createStorage(seed = {}) {
  const entries = new Map(Object.entries(seed))

  return {
    getItem(key) {
      return entries.has(key) ? entries.get(key) : null
    },
    removeItem(key) {
      entries.delete(key)
    },
    setItem(key, value) {
      entries.set(key, value)
    },
  }
}

describe('storage utils', () => {
  it('returns fallback destinations when storage is empty', () => {
    const storage = createStorage()

    expect(loadDestinations(FALLBACK_DESTINATIONS, storage)).toEqual(
      FALLBACK_DESTINATIONS,
    )
  })

  it('merges stored destinations with fallback additions when payload is valid', () => {
    const storedDestinations = [
      {
        id: 'fallback',
        name: '厦门',
        tagline: 'stored',
        mood: 'stored',
        reason: 'stored',
        coupleTask: 'stored',
        color: '#000000',
      },
    ]
    const storage = createStorage({
      [DESTINATIONS_STORAGE_KEY]: JSON.stringify(storedDestinations),
    })

    expect(loadDestinations(FALLBACK_DESTINATIONS, storage)).toEqual(
      storedDestinations,
    )
  })

  it('keeps stored custom destinations and appends missing built-in entries', () => {
    const storedDestinations = [
      {
        id: 'custom',
        name: '成都',
        tagline: 'custom',
        mood: 'custom',
        reason: 'custom',
        coupleTask: 'custom',
        color: '#000000',
      },
    ]
    const storage = createStorage({
      [DESTINATIONS_STORAGE_KEY]: JSON.stringify(storedDestinations),
    })

    expect(loadDestinations(FALLBACK_DESTINATIONS, storage)).toEqual([
      ...storedDestinations,
      ...FALLBACK_DESTINATIONS,
    ])
  })

  it('falls back when storage payload is malformed', () => {
    const storage = createStorage({
      [DESTINATIONS_STORAGE_KEY]: '{"broken":true',
    })

    expect(loadDestinations(FALLBACK_DESTINATIONS, storage)).toEqual(
      FALLBACK_DESTINATIONS,
    )
  })

  it('saves and resets destinations', () => {
    const storage = createStorage()
    const customDestinations = [
      {
        id: 'custom',
        name: '成都',
        tagline: 'custom',
        mood: 'custom',
        reason: 'custom',
        coupleTask: 'custom',
        color: '#f0f0f0',
      },
    ]

    saveDestinations(customDestinations, storage)

    expect(storage.getItem(DESTINATIONS_STORAGE_KEY)).toBe(
      JSON.stringify(customDestinations),
    )

    resetDestinationsStorage(storage)

    expect(storage.getItem(DESTINATIONS_STORAGE_KEY)).toBeNull()
  })
})
