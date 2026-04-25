export const DEFAULT_PREFERENCE_CATEGORY = 'city'

export const PREFERENCE_CATEGORIES = [
  { id: 'city', label: '城市新鲜' },
  { id: 'food', label: '美食烟火' },
  { id: 'culture', label: '古城人文' },
  { id: 'water', label: '海滨水边' },
  { id: 'mountain', label: '山水峡谷' },
  { id: 'grassland', label: '草原旷野' },
  { id: 'desert', label: '西北荒漠' },
  { id: 'plateau', label: '高原雪山' },
]

export const PREFERENCE_CATEGORY_IDS = PREFERENCE_CATEGORIES.map(
  (category) => category.id,
)

export function isPreferenceCategory(category) {
  return PREFERENCE_CATEGORY_IDS.includes(category)
}

export function getPreferenceCategoryLabel(category) {
  return (
    PREFERENCE_CATEGORIES.find((item) => item.id === category)?.label ??
    PREFERENCE_CATEGORIES[0].label
  )
}
