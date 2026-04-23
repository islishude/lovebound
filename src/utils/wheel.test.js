import { describe, expect, it } from 'vitest'
import {
  calculateWheelRotation,
  getSegmentAngle,
  getTargetRotationAngle,
  normalizeRotation,
  pickDestinationIndex,
} from './wheel'

describe('wheel utils', () => {
  it('normalizes rotations into 0-359 range', () => {
    expect(normalizeRotation(725)).toBe(5)
    expect(normalizeRotation(-45)).toBe(315)
  })

  it('calculates the correct segment angle', () => {
    expect(getSegmentAngle(2)).toBe(180)
    expect(getSegmentAngle(12)).toBe(30)
  })

  it('points the selected segment center to the top pointer', () => {
    expect(getTargetRotationAngle(4, 0)).toBe(315)
    expect(getTargetRotationAngle(2, 1)).toBe(90)
  })

  it('creates forward-only wheel rotation that lands on the target angle', () => {
    const nextRotation = calculateWheelRotation({
      count: 8,
      selectedIndex: 3,
      previousRotation: 725,
      spins: 5,
    })

    expect(nextRotation).toBeGreaterThan(725)
    expect(normalizeRotation(nextRotation)).toBe(
      getTargetRotationAngle(8, 3),
    )
  })

  it('picks indices within range', () => {
    expect(pickDestinationIndex(4, 0)).toBe(0)
    expect(pickDestinationIndex(4, 0.99)).toBe(3)
    expect(pickDestinationIndex(0)).toBe(-1)
  })
})
