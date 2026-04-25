import { describe, expect, it } from 'vitest'
import {
  arrangeWheelDestinations,
  countAdjacentColorMatches,
  filterDestinationsByPreference,
  pickNextWheelDestinations,
} from './destinationPool'

const DESTINATIONS = [
  { id: 'a', name: 'A', preferenceCategory: 'city' },
  { id: 'b', name: 'B', preferenceCategory: 'food' },
  { id: 'c', name: 'C', preferenceCategory: 'water' },
  { id: 'd', name: 'D', preferenceCategory: 'mountain' },
  { id: 'e', name: 'E', preferenceCategory: 'water' },
]

describe('destination pool utils', () => {
  it('picks a unique wheel set', () => {
    const picked = pickNextWheelDestinations(
      DESTINATIONS,
      3,
      [],
      () => 0.2,
    )

    expect(picked).toHaveLength(3)
    expect(new Set(picked.map((destination) => destination.id)).size).toBe(3)
  })

  it('prefers destinations that are not already on the wheel', () => {
    const picked = pickNextWheelDestinations(
      DESTINATIONS,
      3,
      ['a', 'b', 'c'],
      () => 0.1,
    )

    expect(picked.map((destination) => destination.id)).toEqual(['d', 'e', 'a'])
  })

  it('excludes the previous result by id and display name when possible', () => {
    const picked = pickNextWheelDestinations(
      DESTINATIONS,
      2,
      ['a'],
      () => 0,
      {
        excludeIds: ['b'],
        excludeNames: ['D'],
      },
    )

    expect(picked.map((destination) => destination.id)).toEqual(['c', 'e'])
  })

  it('relaxes name exclusions before repeating current wheel ids', () => {
    const picked = pickNextWheelDestinations(
      DESTINATIONS,
      3,
      ['a', 'b', 'c'],
      () => 0,
      {
        excludeNames: ['D'],
      },
    )

    expect(picked.map((destination) => destination.id)).toEqual(['e', 'd', 'a'])
  })

  it('reorders wheel destinations to avoid adjacent identical colors when possible', () => {
    const colorfulDestinations = [
      { id: 'a', color: '#111111' },
      { id: 'b', color: '#111111' },
      { id: 'c', color: '#222222' },
      { id: 'd', color: '#333333' },
    ]
    let seed = 0.17
    const nextRandom = () => {
      seed = (seed * 3.7) % 1
      return seed
    }

    const arranged = arrangeWheelDestinations(colorfulDestinations, nextRandom)

    expect(countAdjacentColorMatches(arranged)).toBe(0)
  })

  it('filters destinations by selected preference category union', () => {
    expect(filterDestinationsByPreference(DESTINATIONS, [])).toEqual(DESTINATIONS)
    expect(
      filterDestinationsByPreference(DESTINATIONS, ['water']).map(
        (destination) => destination.id,
      ),
    ).toEqual(['c', 'e'])
    expect(
      filterDestinationsByPreference(DESTINATIONS, ['food', 'mountain']).map(
        (destination) => destination.id,
      ),
    ).toEqual(['b', 'd'])
  })
})
