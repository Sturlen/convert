#!/bin/env node

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

    console.log(convertUnit(value_in, unit_in, unit_out))
}

main(process.argv.slice(2))
