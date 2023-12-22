import { convertUnit } from "./converter"

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
    const [value, unit_in, unit_out] = args

    const value_in = parseFloat(value)
    const unit_in_normalized = unit_in.toLowerCase()
    const unit_out_normalized = unit_out.toLowerCase()

    console.log(convertUnit(value_in, unit_in_normalized, unit_out_normalized))
}

main(process.argv.slice(2))
