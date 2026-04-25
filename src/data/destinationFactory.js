import chinaCities from '@province-city-china/city'
import { DEFAULT_PREFERENCE_CATEGORY } from './preferences'
import {
  CATEGORY_PRESETS,
  CATEGORY_PRESET_COPY_EXPANSIONS,
  CITY_COPY_OVERRIDES,
  CITY_PRESETS,
  CITY_PRESET_COPY_EXPANSIONS,
} from './destinationCopy'
import {
  CITY_PRESET_RULES,
  CITY_SUFFIXES,
  COLOR_PALETTE,
  DEFAULT_SCENIC_CATEGORY,
  PREFERENCE_CATEGORY_BY_CITY_PRESET,
  PREFERENCE_CATEGORY_BY_SCENIC_CATEGORY,
  SCENIC_CATEGORY_RULES,
  TARGET_COPY_OPTION_COUNT,
} from './destinationRules'
import { SCENIC_SPOTS_BY_REGION } from './scenicSpots'

function hashString(value) {
  return [...value].reduce((hash, char) => hash + char.charCodeAt(0), 0)
}

function pickBySeed(items, seed) {
  return items[seed % items.length]
}

function fillTemplate(template, name) {
  return template.replace(/\s*\{name\}\s*/g, name)
}

function mergeCopyOptions(primaryItems, fallbackItems) {
  return [...primaryItems, ...fallbackItems].slice(0, TARGET_COPY_OPTION_COUNT)
}

function expandPresetCopy(preset, expansion = {}) {
  return {
    ...preset,
    reasons: mergeCopyOptions(preset.reasons, expansion.reasons ?? []),
    tasks: mergeCopyOptions(preset.tasks, expansion.tasks ?? []),
  }
}

function mergePresetWithFallbackCopy(preset, fallbackPreset) {
  return {
    ...preset,
    reasons: mergeCopyOptions(preset.reasons, fallbackPreset.reasons),
    tasks: mergeCopyOptions(preset.tasks, fallbackPreset.tasks),
  }
}

function shortenCityName(name) {
  let nextName = name

  for (const suffix of CITY_SUFFIXES) {
    if (nextName.endsWith(suffix)) {
      nextName = nextName.slice(0, -suffix.length)
      break
    }
  }

  return nextName
}

function detectScenicCategory(name) {
  return (
    SCENIC_CATEGORY_RULES.find((rule) => rule.pattern.test(name))?.category ??
    DEFAULT_SCENIC_CATEGORY
  )
}

function cityMatchesRule(rule, cityName, city) {
  const hasMatchingName = rule.names?.some((name) => cityName.includes(name))
  const hasMatchingProvince = rule.provinceCodes?.includes(city?.province)

  return hasMatchingName || hasMatchingProvince
}

function detectCityPresetRule(cityName, city) {
  const rule = CITY_PRESET_RULES.find((candidate) =>
    cityMatchesRule(candidate, cityName, city),
  )

  return rule
}

function detectCityPresetName(cityName, city) {
  return detectCityPresetRule(cityName, city)?.preset ?? 'city'
}

function getCityFallbackPreset(cityName, city) {
  const presetName = detectCityPresetName(cityName, city)

  if (presetName === 'city') {
    return expandPresetCopy(
      CATEGORY_PRESETS.city,
      CATEGORY_PRESET_COPY_EXPANSIONS.city,
    )
  }

  return expandPresetCopy(
    CITY_PRESETS[presetName],
    CITY_PRESET_COPY_EXPANSIONS[presetName],
  )
}

function detectCityPreset(cityName, city) {
  const fallbackPreset = getCityFallbackPreset(cityName, city)
  const override = CITY_COPY_OVERRIDES[cityName]

  return override
    ? mergePresetWithFallbackCopy(override, fallbackPreset)
    : fallbackPreset
}

function detectCityPreferenceCategory(cityName, city) {
  return (
    PREFERENCE_CATEGORY_BY_CITY_PRESET[detectCityPresetName(cityName, city)] ??
    DEFAULT_PREFERENCE_CATEGORY
  )
}

function detectScenicPreset(name) {
  const category = detectScenicCategory(name)

  return expandPresetCopy(
    CATEGORY_PRESETS[category],
    CATEGORY_PRESET_COPY_EXPANSIONS[category],
  )
}

function detectScenicPreferenceCategory(name) {
  return (
    PREFERENCE_CATEGORY_BY_SCENIC_CATEGORY[detectScenicCategory(name)] ??
    PREFERENCE_CATEGORY_BY_SCENIC_CATEGORY[DEFAULT_SCENIC_CATEGORY]
  )
}

function createDestination({ id, name, source, city }) {
  const seed = hashString(id)
  const destinationName = source === 'city' ? shortenCityName(name) : name
  const preset =
    source === 'city'
      ? detectCityPreset(destinationName, city)
      : detectScenicPreset(name)
  const preferenceCategory =
    source === 'city'
      ? detectCityPreferenceCategory(destinationName, city)
      : detectScenicPreferenceCategory(name)

  return {
    id,
    name: destinationName,
    preferenceCategory,
    tagline: fillTemplate(pickBySeed(preset.taglines, seed + 1), destinationName),
    mood: pickBySeed(preset.moods, seed + 2),
    reason: fillTemplate(pickBySeed(preset.reasons, seed + 3), destinationName),
    coupleTask: fillTemplate(pickBySeed(preset.tasks, seed + 4), destinationName),
    color: pickBySeed(COLOR_PALETTE, seed + 5),
  }
}


export function buildDefaultDestinationPool() {
  const cityDestinations = chinaCities
    .filter((city) => !/行政区划/.test(city.name))
    .map((city) =>
      createDestination({
        id: `city-${city.code}`,
        name: city.name,
        source: 'city',
        city,
      }),
    )

  const scenicDestinations = Object.entries(SCENIC_SPOTS_BY_REGION).flatMap(
    ([region, spots], regionIndex) =>
      spots.map((spot, spotIndex) =>
        createDestination({
          id: `spot-${regionIndex}-${spotIndex}-${hashString(`${region}-${spot}`)}`,
          name: spot,
          source: 'spot',
        }),
      ),
  )

  return [...cityDestinations, ...scenicDestinations]
}
