export const DESTINATIONS_STORAGE_KEY = 'travel-select.destinations'

const REQUIRED_FIELDS = [
  'id',
  'name',
  'tagline',
  'mood',
  'reason',
  'coupleTask',
  'color',
]

function getStorage(storage) {
  if (storage) {
    return storage
  }

  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage
}

function isDestination(candidate) {
  if (!candidate || typeof candidate !== 'object') {
    return false
  }

  return REQUIRED_FIELDS.every((field) => typeof candidate[field] === 'string')
}

function isDestinationArray(value) {
  return Array.isArray(value) && value.every(isDestination)
}

function mergeDestinationsWithFallback(storedDestinations, fallbackDestinations) {
  const storedDestinationIds = new Set(
    storedDestinations.map((destination) => destination.id),
  )
  const fallbackAdditions = fallbackDestinations.filter(
    (destination) => !storedDestinationIds.has(destination.id),
  )

  return [...storedDestinations, ...fallbackAdditions]
}

export function loadDestinations(fallback, storage) {
  const activeStorage = getStorage(storage)

  if (!activeStorage) {
    return fallback
  }

  try {
    const rawValue = activeStorage.getItem(DESTINATIONS_STORAGE_KEY)

    if (!rawValue) {
      return fallback
    }

    const parsedValue = JSON.parse(rawValue)
    return isDestinationArray(parsedValue)
      ? mergeDestinationsWithFallback(parsedValue, fallback)
      : fallback
  } catch {
    return fallback
  }
}

export function saveDestinations(destinations, storage) {
  const activeStorage = getStorage(storage)

  if (!activeStorage) {
    return
  }

  activeStorage.setItem(
    DESTINATIONS_STORAGE_KEY,
    JSON.stringify(destinations),
  )
}

export function resetDestinationsStorage(storage) {
  const activeStorage = getStorage(storage)

  if (!activeStorage) {
    return
  }

  activeStorage.removeItem(DESTINATIONS_STORAGE_KEY)
}
