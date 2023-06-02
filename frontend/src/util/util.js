function formatUnitNumerusClausus(unit, quantity) {
    if (unit === undefined || unit.toLowerCase() === "unit") {
        if (quantity === 1) {
            return unit
        } else {
            return unit + "s"
        }
    }

    return unit
}

export {formatUnitNumerusClausus}