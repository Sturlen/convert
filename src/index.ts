const siPrefixes = new Map([
    ["yotta", { value: 1e24, abbreviation: "Y" }],
    ["zetta", { value: 1e21, abbreviation: "Z" }],
    ["exa", { value: 1e18, abbreviation: "E" }],
    ["peta", { value: 1e15, abbreviation: "P" }],
    ["tera", { value: 1e12, abbreviation: "T" }],
    ["giga", { value: 1e9, abbreviation: "G" }],
    ["mega", { value: 1e6, abbreviation: "M" }],
    ["kilo", { value: 1e3, abbreviation: "k" }],
    ["hecto", { value: 1e2, abbreviation: "h" }],
    ["deca", { value: 1e1, abbreviation: "da" }],
    ["deci", { value: 1e-1, abbreviation: "d" }],
    ["centi", { value: 1e-2, abbreviation: "c" }],
    ["milli", { value: 1e-3, abbreviation: "m" }],
    ["micro", { value: 1e-6, abbreviation: "µ" }],
    ["nano", { value: 1e-9, abbreviation: "n" }],
    ["pico", { value: 1e-12, abbreviation: "p" }],
    ["femto", { value: 1e-15, abbreviation: "f" }],
    ["atto", { value: 1e-18, abbreviation: "a" }],
    ["zepto", { value: 1e-21, abbreviation: "z" }],
    ["yocto", { value: 1e-24, abbreviation: "y" }],
])

function main(args: string[]) {
    console.log(args)
    const [value, unit_in, unit_out] = args

    const value_in = parseFloat(value)
    const unit_in_normalized = unit_in.toLowerCase()
    const unit_out_normalized = unit_out.toLowerCase()

    const in_conversion_factor = siPrefixes.get(unit_in_normalized)?.value
    if (in_conversion_factor === undefined) {
        throw new Error(`Unknown unit: ${unit_in_normalized}`)
    }

    const out_conversion_factor = siPrefixes.get(unit_in_normalized)?.value
    if (out_conversion_factor === undefined) {
        throw new Error(`Unknown unit: ${unit_out_normalized}`)
    }

    const result = value_in * in_conversion_factor
    console.log(`${result} ${unit_out_normalized}meter`)
}

main(process.argv.slice(2))
