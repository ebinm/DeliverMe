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

const PUT_FETCH_OPTIONS = {
    method: "PUT",
    credentials: "include",
    headers: {
        "Content-Type": "application/json"
    }
}

const POST_FETCH_OPTIONS = {
    method: "POST",
    credentials: "include",
    headers: {
        "Content-Type": "application/json"
    }
}

export {PUT_FETCH_OPTIONS, POST_FETCH_OPTIONS, formatUnitNumerusClausus, tryLoadFromLocalStorage}