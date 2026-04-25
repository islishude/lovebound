export const DESTINATIONS_STORAGE_KEY = 'lovebound.destinations'
export const DESTINATIONS_COPY_VERSION = '2026-04-city-copy-v3'
export const DESTINATIONS_COPY_VERSION_KEY =
  'lovebound.destinations-copy-version'

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

function rememberDestinationsCopyVersion(storage) {
  try {
    storage.setItem(DESTINATIONS_COPY_VERSION_KEY, DESTINATIONS_COPY_VERSION)
  } catch {
    // Destination data itself is more important than the migration marker.
  }
}

function mergeDestinationsWithFallback(
  storedDestinations,
  fallbackDestinations,
  shouldRefreshFallbackCopy = false,
) {
  const fallbackDestinationById = new Map(
    fallbackDestinations.map((destination) => [destination.id, destination]),
  )
  const normalizedStoredDestinations = shouldRefreshFallbackCopy
    ? storedDestinations.map(
      (destination) => fallbackDestinationById.get(destination.id) ?? destination,
    )
    : storedDestinations
  const storedDestinationIds = new Set(
    normalizedStoredDestinations.map((destination) => destination.id),
  )
  const fallbackAdditions = fallbackDestinations.filter(
    (destination) => !storedDestinationIds.has(destination.id),
  )

  return [...normalizedStoredDestinations, ...fallbackAdditions]
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
    const shouldRefreshFallbackCopy =
      activeStorage.getItem(DESTINATIONS_COPY_VERSION_KEY) !==
      DESTINATIONS_COPY_VERSION

    if (!isDestinationArray(parsedValue)) {
      return fallback
    }

    const destinations = mergeDestinationsWithFallback(
      parsedValue,
      fallback,
      shouldRefreshFallbackCopy,
    )

    rememberDestinationsCopyVersion(activeStorage)

    return destinations
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
  rememberDestinationsCopyVersion(activeStorage)
}

export function resetDestinationsStorage(storage) {
  const activeStorage = getStorage(storage)

  if (!activeStorage) {
    return
  }

  activeStorage.removeItem(DESTINATIONS_STORAGE_KEY)
  activeStorage.removeItem(DESTINATIONS_COPY_VERSION_KEY)
}
