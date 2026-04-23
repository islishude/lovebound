import { describe, expect, it } from 'vitest'
import {
  DEFAULT_DESTINATION_POOL,
  WHEEL_DESTINATION_COUNT,
} from './destinations'

describe('destination data', () => {
  it('ships with a large domestic destination pool', () => {
    expect(DEFAULT_DESTINATION_POOL.length).toBeGreaterThanOrEqual(500)
  })

  it('keeps destination ids unique', () => {
    expect(new Set(DEFAULT_DESTINATION_POOL.map((item) => item.id)).size).toBe(
      DEFAULT_DESTINATION_POOL.length,
    )
  })

  it('uses a wheel size smaller than the destination pool', () => {
    expect(WHEEL_DESTINATION_COUNT).toBeLessThan(DEFAULT_DESTINATION_POOL.length)
  })
})
