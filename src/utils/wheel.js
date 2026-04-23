export function normalizeRotation(rotation) {
  return ((rotation % 360) + 360) % 360
}

export function getSegmentAngle(count) {
  return count > 0 ? 360 / count : 0
}

export function getTargetRotationAngle(count, selectedIndex) {
  if (count < 1 || selectedIndex < 0 || selectedIndex >= count) {
    return 0
  }

  const segmentAngle = getSegmentAngle(count)
  const centerAngle = segmentAngle * selectedIndex + segmentAngle / 2
  return normalizeRotation(360 - centerAngle)
}

export function calculateWheelRotation({
  count,
  selectedIndex,
  previousRotation = 0,
  spins = 6,
}) {
  if (count < 1) {
    return previousRotation
  }

  const targetAngle = getTargetRotationAngle(count, selectedIndex)
  const currentAngle = normalizeRotation(previousRotation)
  let delta = spins * 360 + targetAngle - currentAngle

  if (delta <= 0) {
    delta += 360
  }

  return previousRotation + delta
}

export function pickDestinationIndex(count, randomValue = Math.random()) {
  if (count < 1) {
    return -1
  }

  return Math.min(count - 1, Math.floor(randomValue * count))
}
