import { isPreferenceCategory } from '../data/preferences'

function drawRandomItems(items, count, random = Math.random) {
  const pool = [...items]
  const results = []
  const limit = Math.min(count, pool.length)

  while (results.length < limit) {
    const index = Math.floor(random() * pool.length)
    const [picked] = pool.splice(index, 1)
    results.push(picked)
  }

  return results
}

function shuffleItems(items, random = Math.random) {
  const nextItems = [...items]

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    const current = nextItems[index]

    nextItems[index] = nextItems[swapIndex]
    nextItems[swapIndex] = current
  }

  return nextItems
}

export function filterDestinationsByPreference(
  destinations,
  selectedPreferenceCategories = [],
) {
  const selectedCategorySet = new Set(
    selectedPreferenceCategories.filter(isPreferenceCategory),
  )

  if (selectedCategorySet.size === 0) {
    return destinations
  }

  return destinations.filter((destination) =>
    selectedCategorySet.has(destination.preferenceCategory),
  )
}

export function countAdjacentColorMatches(destinations) {
  if (destinations.length < 2) {
    return 0
  }

  let matches = 0

  for (let index = 0; index < destinations.length; index += 1) {
    const current = destinations[index]
    const next = destinations[(index + 1) % destinations.length]

    if (current.color === next.color) {
      matches += 1
    }
  }

  return matches
}

export function arrangeWheelDestinations(destinations, random = Math.random) {
  if (destinations.length < 2) {
    return destinations
  }

  let bestOrder = [...destinations]
  let bestScore = countAdjacentColorMatches(bestOrder)
  const attempts = Math.max(24, destinations.length * 12)

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const candidate = shuffleItems(destinations, random)
    const score = countAdjacentColorMatches(candidate)

    if (score < bestScore) {
      bestOrder = candidate
      bestScore = score
    }

    if (score === 0) {
      return candidate
    }
  }

  return bestOrder
}

export function pickNextWheelDestinations(
  destinations,
  count,
  currentIds = [],
  random = Math.random,
  options = {},
) {
  const limit = Math.min(count, destinations.length)
  const excludedIdSet = new Set([
    ...currentIds,
    ...(options.excludeIds ?? []),
  ])
  const excludedNameSet = new Set(options.excludeNames ?? [])
  const freshPool = destinations.filter(
    (destination) =>
      !excludedIdSet.has(destination.id) &&
      !excludedNameSet.has(destination.name),
  )
  const results = drawRandomItems(freshPool, limit, random)

  if (results.length === limit) {
    return results
  }

  const usedIds = new Set(results.map((destination) => destination.id))
  const relaxedNamePool = destinations.filter(
    (destination) =>
      !usedIds.has(destination.id) && !excludedIdSet.has(destination.id),
  )
  const relaxedResults = drawRandomItems(
    relaxedNamePool,
    limit - results.length,
    random,
  )

  results.push(...relaxedResults)

  if (results.length === limit) {
    return results
  }

  relaxedResults.forEach((destination) => usedIds.add(destination.id))
  const fallbackPool = destinations.filter(
    (destination) => !usedIds.has(destination.id),
  )

  return [
    ...results,
    ...drawRandomItems(fallbackPool, limit - results.length, random),
  ]
}
