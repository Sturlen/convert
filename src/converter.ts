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
    names: string[]
    value: number
    zero?: number
    abbrs: string[]
    si?: true
}

export type UnitTable = Readonly<Array<Unit>>

export const LENGTH_SINGLE_UNITS: UnitTable = [
    { names: ["meter", "meters"], value: 1, abbrs: ["m"], si: true },
    { names: ["inch", "inches"], value: 0.0254, abbrs: ["in"] },
    { names: ["foot", "feet"], value: 0.3048, abbrs: ["ft"] },
    { names: ["yard", "yards"], value: 0.9144, abbrs: ["yd"] },
    { names: ["mile", "miles"], value: 1609.344, abbrs: ["mi"] },
]
// 1 pound = 453.59237 grams
export const MASS_SINGLE_UNITS: UnitTable = [
    { names: ["gram", "grams"], value: 1, abbrs: ["g"], si: true },
    { names: ["ounce", "ounces"], value: 28.3495231, abbrs: ["oz"] },
    { names: ["pound", "pounds"], value: 453.59237, abbrs: ["lb", "lbs"] },
    { names: ["ton", "tons"], value: 907184.74, abbrs: ["t"] },
]

export const TEMP_SINGLE_UNITS: UnitTable = [
    { names: ["kelvin"], value: 1, abbrs: ["K"] },
    {
        names: ["celsius"],
        value: 1,
        zero: -273.15,
        abbrs: ["C"],
    },
    {
        names: ["fahrenheit"],
        value: 5 / 9,
        zero: -459.67,
        abbrs: ["F"],
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
        setMultipleKeys([...unit.names, ...unit.abbrs], unit, quantity)

        if (unit.si) {
            SI_PREFIXES.forEach((prefix) => {
                setMultipleKeys(
                    [
                        ...unit.names.map((name) => prefix.key + name),
                        ...unit.abbrs.map((abbr) => prefix.abbreviation + abbr),
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
