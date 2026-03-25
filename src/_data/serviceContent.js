const imports = require("./serviceContentImports");
const overrides = require("./serviceContentOverrides");

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeValue(baseValue, overrideValue) {
  if (overrideValue === undefined) {
    return baseValue;
  }

  if (Array.isArray(overrideValue)) {
    return overrideValue;
  }

  if (isObject(baseValue) && isObject(overrideValue)) {
    const merged = { ...baseValue };

    for (const [key, value] of Object.entries(overrideValue)) {
      merged[key] = mergeValue(baseValue[key], value);
    }

    return merged;
  }

  return overrideValue;
}

const merged = {};
const slugs = new Set([...Object.keys(imports), ...Object.keys(overrides)]);

for (const slug of slugs) {
  merged[slug] = mergeValue(imports[slug] || {}, overrides[slug] || {});
}

module.exports = merged;
