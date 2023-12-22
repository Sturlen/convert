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

export const LENGTH_UNITS: Record<string, Unit> = {
    ...LENGTH_SINGLE_UNITS,
}

for (const [unitName, unit] of Object.entries(LENGTH_SINGLE_UNITS)) {
    LENGTH_UNITS[unitName + "s"] = unit
    LENGTH_UNITS[unit.abbreviation] = unit
    LENGTH_UNITS[unit.plural] = unit
}

export type PrefixedUnit = { prefix?: Prefix; unit: Unit }

function findPrefix(input: string): Prefix | undefined {
    const prefix_entry = Object.entries(SI_PREFIXES).find(([prefixName]) =>
        input.startsWith(prefixName)
    )
    if (prefix_entry) {
        return prefix_entry[1]
    }
}

function findAbbrivatedPrefix(input: string): Prefix | undefined {
    const prefix_entry = Object.entries(SI_PREFIXES).find(
        ([_, { abbreviation }]) => input.startsWith(abbreviation)
    )
    if (prefix_entry) {
        return prefix_entry[1]
    }
}

function findUnitWithOrWithoutPlurals(input: string): Unit | undefined {
    return LENGTH_UNITS[input]
}

export function parseUnit(input: string): PrefixedUnit {
    const found_unit = findUnitWithOrWithoutPlurals(input)
    const found_prefix = findPrefix(input)
    const found_abbrivated_prefix = findAbbrivatedPrefix(input)
    if (found_unit) {
        return { unit: found_unit }
    } else if (found_prefix) {
        const unit_string = input.slice(found_prefix.key.length)
        const unit = LENGTH_UNITS[unit_string]
        if (!unit) {
            throw new Error(`Unknown prefixed unit: ${unit_string}`)
        }
        return { prefix: found_prefix, unit: LENGTH_UNITS.meter }
    } else if (found_abbrivated_prefix) {
        const unit_string = input.slice(
            found_abbrivated_prefix.abbreviation.length
        )
        const unit = LENGTH_UNITS[unit_string]
        if (!unit) {
            throw new Error(`Unknown abbreviated prefixed unit: ${unit_string}`)
        }
        return { prefix: found_abbrivated_prefix, unit: LENGTH_UNITS.meter }
    } else {
        throw new Error(`Unknown unit: ${input}`)
    }
}

export function convert(
    amount: number,
    from: PrefixedUnit,
    to: PrefixedUnit
): number {
    const factor_from = (from.prefix?.value ?? 1) * from.unit.value
    const factor_to = (to.prefix?.value ?? 1) * to.unit.value
    return (amount * factor_from) / factor_to
}

export function convertUnit(amount: number, from: string, to: string): number {
    const from_unit = parseUnit(from)
    const to_unit = parseUnit(to)
    return convert(amount, from_unit, to_unit)
}
