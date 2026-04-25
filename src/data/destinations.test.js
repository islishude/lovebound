import { describe, expect, it } from 'vitest'
import {
  DEFAULT_DESTINATION_POOL,
  WHEEL_DESTINATION_COUNT,
} from './destinations'
import { PREFERENCE_CATEGORIES } from './preferences'

function getDestinationCopy(name) {
  const destination = DEFAULT_DESTINATION_POOL.find((item) => item.name === name)

  expect(destination).toBeTruthy()

  return [
    destination.mood,
    destination.tagline,
    destination.reason,
    destination.coupleTask,
  ].join(' ')
}

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

  it('assigns every default destination to one of the preference categories', () => {
    const categoryIds = new Set(PREFERENCE_CATEGORIES.map((category) => category.id))

    expect(
      DEFAULT_DESTINATION_POOL.every((destination) =>
        categoryIds.has(destination.preferenceCategory),
      ),
    ).toBe(true)

    PREFERENCE_CATEGORIES.forEach((category) => {
      expect(
        DEFAULT_DESTINATION_POOL.some(
          (destination) => destination.preferenceCategory === category.id,
        ),
      ).toBe(true)
    })
  })

  it('uses place-aware copy for representative city destinations', () => {
    expect(getDestinationCopy('厦门')).toMatch(/鼓浪屿|沙坡尾|环岛路|海/)
    expect(getDestinationCopy('成都')).toMatch(/茶馆|火锅|锦江|玉林/)
    expect(getDestinationCopy('杭州')).toMatch(/西湖|灵隐|运河/)
    expect(getDestinationCopy('西安')).toMatch(/城墙|钟鼓楼|唐风|古都/)
    expect(getDestinationCopy('拉萨')).toMatch(/八廓|布达拉宫|甜茶|高原/)
    expect(getDestinationCopy('呼伦贝尔')).toMatch(/草原|额尔古纳|边境/)
  })
})
