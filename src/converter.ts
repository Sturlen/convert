export type Prefix = { value: number; abbreviation: string; key: string }

export const SI_PREFIXES: Readonly<Record<string, Prefix>> = {
    yotta: { value: 1e24, abbreviation: "Y", key: "yotta" },
    zetta: { value: 1e21, abbreviation: "Z", key: "zetta" },
    exa: { value: 1e18, abbreviation: "E", key: "exa" },
    peta: { value: 1e15, abbreviation: "P", key: "peta" },
    tera: { value: 1e12, abbreviation: "T", key: "tera" },
    giga: { value: 1e9, abbreviation: "G", key: "giga" },
    mega: { value: 1e6, abbreviation: "M", key: "mega" },
    kilo: { value: 1e3, abbreviation: "k", key: "kilo" },
    hecto: { value: 1e2, abbreviation: "h", key: "hecto" },
    deca: { value: 1e1, abbreviation: "da", key: "deca" },
    deci: { value: 1e-1, abbreviation: "d", key: "deci" },
    centi: { value: 1e-2, abbreviation: "c", key: "centi" },
    milli: { value: 1e-3, abbreviation: "m", key: "milli" },
    micro: { value: 1e-6, abbreviation: "µ", key: "micro" },
    nano: { value: 1e-9, abbreviation: "n", key: "nano" },
    pico: { value: 1e-12, abbreviation: "p", key: "pico" },
    femto: { value: 1e-15, abbreviation: "f", key: "femto" },
    atto: { value: 1e-18, abbreviation: "a", key: "atto" },
    zepto: { value: 1e-21, abbreviation: "z", key: "zepto" },
    yocto: { value: 1e-24, abbreviation: "y", key: "yocto" },
} as const

export type Unit = {
    value: number
    abbreviation: string
    plural: string
    si?: true
}

export const LENGTH_SINGLE_UNITS: Readonly<Record<string, Unit>> = {
    meter: { value: 1, abbreviation: "m", plural: "meters", si: true },
    inch: { value: 0.0254, abbreviation: "in", plural: "inches" },
    foot: { value: 0.3048, abbreviation: "ft", plural: "feet" },
    yard: { value: 0.9144, abbreviation: "yd", plural: "yards" },
    mile: { value: 1609.344, abbreviation: "mi", plural: "miles" },
} as const

// 1 pound = 453.59237 grams
export const WEIGHT_SINGLE_UNITS: Readonly<Record<string, Unit>> = {
    gram: { value: 1, abbreviation: "g", plural: "grams", si: true },
    pound: { value: 453.59237, abbreviation: "lb", plural: "pounds" },
} as const

export type CoreUnit = { factor: number; coreId: string }

export const UNITS_TABLE = new Map<string, CoreUnit>()

function addUnitsToTable(units: Readonly<Record<string, Unit>>) {
    for (const [unitName, unit] of Object.entries(units)) {
        UNITS_TABLE.set(unitName, {
            factor: unit.value,
            coreId: unitName,
        })
        UNITS_TABLE.set(unit.plural, {
            factor: unit.value,
            coreId: unitName,
        })
        UNITS_TABLE.set(unit.abbreviation, {
            factor: unit.value,
            coreId: unitName,
        })
        if (unit.si) {
            Object.entries(SI_PREFIXES).forEach(([prefixName, prefix]) => {
                UNITS_TABLE.set(prefixName + unitName, {
                    factor: unit.value * prefix.value,
                    coreId: `${prefixName}-${unitName}`,
                })
                UNITS_TABLE.set(prefixName + unit.plural, {
                    factor: unit.value * prefix.value,
                    coreId: `${prefixName}-${unitName}`,
                })
                UNITS_TABLE.set(prefix.abbreviation + unit.abbreviation, {
                    factor: unit.value * prefix.value,
                    coreId: `${prefixName}-${unitName}`,
                })
            })
        }
    }
}

addUnitsToTable(LENGTH_SINGLE_UNITS)
addUnitsToTable(WEIGHT_SINGLE_UNITS)

export function convertUnit(amount: number, from: string, to: string): number {
    const from_unit = UNITS_TABLE.get(from)?.factor
    const to_unit = UNITS_TABLE.get(to)?.factor

    if (from_unit === undefined) {
        throw new Error(`Unknown unit: ${from}`)
    }

    if (to_unit === undefined) {
        throw new Error(`Unknown unit: ${to}`)
    }

    return (amount * from_unit) / to_unit
}
