export type Prefix = { value: number; abbreviation: string; key: string }

export const SI_PREFIXES: Readonly<Prefix[]> = [
    { value: 1e24, abbreviation: "Y", key: "yotta" },
    { value: 1e21, abbreviation: "Z", key: "zetta" },
    { value: 1e18, abbreviation: "E", key: "exa" },
    { value: 1e15, abbreviation: "P", key: "peta" },
    { value: 1e12, abbreviation: "T", key: "tera" },
    { value: 1e9, abbreviation: "G", key: "giga" },
    { value: 1e6, abbreviation: "M", key: "mega" },
    { value: 1e3, abbreviation: "k", key: "kilo" },
    { value: 1e2, abbreviation: "h", key: "hecto" },
    { value: 1e1, abbreviation: "da", key: "deca" },
    { value: 1e-1, abbreviation: "d", key: "deci" },
    { value: 1e-2, abbreviation: "c", key: "centi" },
    { value: 1e-3, abbreviation: "m", key: "milli" },
    { value: 1e-6, abbreviation: "µ", key: "micro" },
    { value: 1e-9, abbreviation: "n", key: "nano" },
    { value: 1e-12, abbreviation: "p", key: "pico" },
    { value: 1e-15, abbreviation: "f", key: "femto" },
    { value: 1e-18, abbreviation: "a", key: "atto" },
    { value: 1e-21, abbreviation: "z", key: "zepto" },
    { value: 1e-24, abbreviation: "y", key: "yocto" },
]

export type Unit = {
    key: string
    value: number
    zero?: number
    abbreviation: string
    plural: string
    si?: true
}

export type UnitTable = Readonly<Array<Unit>>

export const LENGTH_SINGLE_UNITS: UnitTable = [
    { key: "meter", value: 1, abbreviation: "m", plural: "meters", si: true },
    { key: "inch", value: 0.0254, abbreviation: "in", plural: "inches" },
    { key: "foot", value: 0.3048, abbreviation: "ft", plural: "feet" },
    { key: "yard", value: 0.9144, abbreviation: "yd", plural: "yards" },
    { key: "mile", value: 1609.344, abbreviation: "mi", plural: "miles" },
]
// 1 pound = 453.59237 grams
export const MASS_SINGLE_UNITS: UnitTable = [
    { key: "gram", value: 1, abbreviation: "g", plural: "grams", si: true },
    { key: "ounce", value: 28.3495231, abbreviation: "oz", plural: "ounces" },
    { key: "pound", value: 453.59237, abbreviation: "lb", plural: "pounds" },
    { key: "ton", value: 907184.74, abbreviation: "t", plural: "tons" },
]

export const TEMP_SINGLE_UNITS: UnitTable = [
    { key: "kelvin", value: 1, abbreviation: "K", plural: "K" },
    {
        key: "celsius",
        value: 1,
        zero: -273.15,
        abbreviation: "C",
        plural: "°C",
    },
    {
        key: "fahrenheit",
        value: 5 / 9,
        zero: -459.67,
        abbreviation: "F",
        plural: "°F",
    },
]

export type CoreUnit = { factor: number; quantity: string; zero: number }

export const UNITS_TABLE = new Map<string, CoreUnit>()

function setMultipleKeys(
    keys: string[],
    unit: Unit,
    quantity: string,
    prefixValue = 1
) {
    for (const key of keys) {
        UNITS_TABLE.set(key, {
            factor: unit.value * prefixValue,
            zero: unit.zero ?? 0,
            quantity: quantity,
        })
    }
}

function addUnitsToTable(units: UnitTable, quantity: string) {
    units.forEach((unit) => {
        setMultipleKeys(
            [unit.key, unit.plural, unit.abbreviation],
            unit,
            quantity
        )

        if (unit.si) {
            SI_PREFIXES.forEach((prefix) => {
                setMultipleKeys(
                    [
                        prefix.key + unit.key,
                        prefix.key + unit.plural,
                        prefix.abbreviation + unit.abbreviation,
                    ],
                    unit,
                    quantity,
                    prefix.value
                )
            })
        }
    })
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
