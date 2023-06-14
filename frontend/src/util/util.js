function formatUnitNumerusClausus(unit, quantity) {
    if (unit === undefined || unit.toLowerCase() === "unit") {
        if (quantity === 1) {
            return unit || "Unit"
        } else {
            return (unit || "Unit") + "s"
        }
    }

    return unit
}

function tryLoadFromLocalStorage(key, setValue, fallback) {
    try {
        // We do not want to load "nullish" data from the cache
        const stored = JSON.parse(window.localStorage.getItem(key))
        if (stored && (!Array.isArray(stored) || stored.length > 0)) {
            setValue(stored || fallback)
            return true
        }
        return false
    } catch (ignored) {
        return false
    }
}

export {formatUnitNumerusClausus, tryLoadFromLocalStorage}