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
) {
  const limit = Math.min(count, destinations.length)
  const currentIdSet = new Set(currentIds)
  const freshPool = destinations.filter(
    (destination) => !currentIdSet.has(destination.id),
  )
  const results = drawRandomItems(freshPool, limit, random)

  if (results.length === limit) {
    return results
  }

  const usedIds = new Set(results.map((destination) => destination.id))
  const fallbackPool = destinations.filter(
    (destination) => !usedIds.has(destination.id),
  )

  return [
    ...results,
    ...drawRandomItems(fallbackPool, limit - results.length, random),
  ]
}

export function reconcileWheelDestinationIds(
  destinations,
  currentIds,
  count,
  random = Math.random,
) {
  const limit = Math.min(count, destinations.length)
  const validIds = new Set(destinations.map((destination) => destination.id))
  const keptIds = currentIds.filter((id) => validIds.has(id)).slice(0, limit)

  if (keptIds.length === limit) {
    return keptIds
  }

  const keptIdSet = new Set(keptIds)
  const fillerDestinations = pickNextWheelDestinations(
    destinations.filter((destination) => !keptIdSet.has(destination.id)),
    limit - keptIds.length,
    [],
    random,
  )

  return [...keptIds, ...fillerDestinations.map((destination) => destination.id)]
}

export function promoteDestinationToWheel(currentIds, destinationId, count) {
  return [destinationId, ...currentIds.filter((id) => id !== destinationId)].slice(
    0,
    count,
  )
}
