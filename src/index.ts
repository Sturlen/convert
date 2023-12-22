#!/bin/env node

import { exit, stdout } from "process"
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

    const result = convertUnit(value_in, unit_in, unit_out)

    stdout.write(result.toString())
    exit()
}

main(process.argv.slice(2))
