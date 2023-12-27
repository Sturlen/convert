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
    zero?: number
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
export const MASS_SINGLE_UNITS: Readonly<Record<string, Unit>> = {
    gram: { value: 1, abbreviation: "g", plural: "grams", si: true },
    ounce: { value: 28.3495231, abbreviation: "oz", plural: "ounces" },
    pound: { value: 453.59237, abbreviation: "lb", plural: "pounds" },
    ton: { value: 907184.74, abbreviation: "t", plural: "tons" },
} as const

export const TEMP_SINGLE_UNITS: Readonly<Record<string, Unit>> = {
    kelvin: { value: 1, abbreviation: "K", plural: "K" },
    celsius: { value: 1, zero: -273.15, abbreviation: "C", plural: "°C" },
} as const

export type CoreUnit = { factor: number; quantity: string; zero: number }

export const UNITS_TABLE = new Map<string, CoreUnit>()

function addUnitsToTable(
    units: Readonly<Record<string, Unit>>,
    quantity: string
) {
    for (const [unitName, unit] of Object.entries(units)) {
        UNITS_TABLE.set(unitName, {
            factor: unit.value,
            zero: unit.zero ?? 0,
            quantity,
        })
        UNITS_TABLE.set(unit.plural, {
            factor: unit.value,
            zero: unit.zero ?? 0,
            quantity,
        })
        UNITS_TABLE.set(unit.abbreviation, {
            factor: unit.value,
            zero: unit.zero ?? 0,
            quantity,
        })
        if (unit.si) {
            Object.entries(SI_PREFIXES).forEach(([prefixName, prefix]) => {
                UNITS_TABLE.set(prefixName + unitName, {
                    factor: unit.value * prefix.value,
                    zero: unit.zero ?? 0,
                    quantity,
                })
                UNITS_TABLE.set(prefixName + unit.plural, {
                    factor: unit.value * prefix.value,
                    zero: unit.zero ?? 0,
                    quantity,
                })
                UNITS_TABLE.set(prefix.abbreviation + unit.abbreviation, {
                    factor: unit.value * prefix.value,
                    zero: unit.zero ?? 0,
                    quantity,
                })
            })
        }
    }
}

addUnitsToTable(LENGTH_SINGLE_UNITS, "Length")
addUnitsToTable(MASS_SINGLE_UNITS, "Mass")
addUnitsToTable(TEMP_SINGLE_UNITS, "Temperature")

export function convertUnit(amount: number, from: string, to: string): number {
    const from_unit = UNITS_TABLE.get(from)
    const to_unit = UNITS_TABLE.get(to)

    if (from_unit === undefined) {
        throw new Error(`Unknown unit: ${from}`)
    }

    if (to_unit === undefined) {
        throw new Error(`Unknown unit: ${to}`)
    }

    if (from_unit.quantity !== to_unit.quantity) {
        throw new Error(
            `Cannot convert "${from}" (${from_unit.quantity}) to "${to}" (${to_unit.quantity})`
        )
    }

    const from_zero = from_unit.zero
    const to_zero = to_unit.zero

    return ((amount - from_zero) * from_unit.factor) / to_unit.factor + to_zero
}
