const unit = "meter"

const SiPrefixes = new Map<
    string,
    { value: number; abbreviation: string; key: string }
>([
    ["yotta", { value: 1e24, abbreviation: "Y", key: "yotta" }],
    ["zetta", { value: 1e21, abbreviation: "Z", key: "zetta" }],
    ["exa", { value: 1e18, abbreviation: "E", key: "exa" }],
    ["peta", { value: 1e15, abbreviation: "P", key: "peta" }],
    ["tera", { value: 1e12, abbreviation: "T", key: "tera" }],
    ["giga", { value: 1e9, abbreviation: "G", key: "giga" }],
    ["mega", { value: 1e6, abbreviation: "M", key: "mega" }],
    ["kilo", { value: 1e3, abbreviation: "k", key: "kilo" }],
    ["hecto", { value: 1e2, abbreviation: "h", key: "hecto" }],
    ["deca", { value: 1e1, abbreviation: "da", key: "deca" }],
    ["deci", { value: 1e-1, abbreviation: "d", key: "deci" }],
    ["centi", { value: 1e-2, abbreviation: "c", key: "centi" }],
    ["milli", { value: 1e-3, abbreviation: "m", key: "milli" }],
    ["micro", { value: 1e-6, abbreviation: "µ", key: "micro" }],
    ["nano", { value: 1e-9, abbreviation: "n", key: "nano" }],
    ["pico", { value: 1e-12, abbreviation: "p", key: "pico" }],
    ["femto", { value: 1e-15, abbreviation: "f", key: "femto" }],
    ["atto", { value: 1e-18, abbreviation: "a", key: "atto" }],
    ["zepto", { value: 1e-21, abbreviation: "z", key: "zepto" }],
    ["yocto", { value: 1e-24, abbreviation: "y", key: "yocto" }],
])

const LengthUnits = new Map<
    string,
    { value: number; abbreviation: string; si?: true }
>([
    ["meter", { value: 1, abbreviation: "m", si: true }],
    ["inch", { value: 0.0254, abbreviation: "in" }],
    ["foot", { value: 0.3048, abbreviation: "ft" }],
    ["yard", { value: 0.9144, abbreviation: "yd" }],
    ["mile", { value: 1609.344, abbreviation: "mi" }],
])

const quantities = [
    "Length",
    "Mass",
    "Time",
    "Electric Current",
    "Temperature",
    "Amount of Substance",
    "Luminous Intensity",
] as const

function main(args: string[]) {
    console.log(args)
    const [value, unit_in, unit_out] = args

    const value_in = parseFloat(value)
    const unit_in_normalized = unit_in.toLowerCase()
    const unit_out_normalized = unit_out.toLowerCase()

    const in_conversion_factor = SiPrefixes.get(unit_in_normalized)?.value
    if (in_conversion_factor === undefined) {
        throw new Error(`Unknown unit: ${unit_in_normalized}`)
    }

    const out_conversion_factor = SiPrefixes.get(unit_in_normalized)?.value
    if (out_conversion_factor === undefined) {
        throw new Error(`Unknown unit: ${unit_out_normalized}`)
    }

    const result = value_in * in_conversion_factor * out_conversion_factor
    const formattted_result = Intl.NumberFormat("en-US", {
        style: "unit",
        unit: unit,
    }).format(result)

    console.log(`${formattted_result}`)
}

main(process.argv.slice(2))
