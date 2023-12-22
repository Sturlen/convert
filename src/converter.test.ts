import { LENGTH_UNITS, SI_PREFIXES, convert, parseUnit } from "./converter"

test("parse meter", () => {
    expect(parseUnit("meter").unit).toBe(LENGTH_UNITS.meter)
})

test("throw if unit is invalid", () => {
    expect(() => parseUnit("truckload")).toThrow()
})

test("parse kilometer", () => {
    const { unit, prefix } = parseUnit("kilometer")
    expect(unit).toBe(LENGTH_UNITS.meter)
    expect(prefix).toBe(SI_PREFIXES.kilo)
})

test("parse millimeter", () => {
    const { unit, prefix } = parseUnit("millimeter")
    expect(unit).toBe(LENGTH_UNITS.meter)
    expect(prefix).toBe(SI_PREFIXES.milli)
})

test("parse meters, plural", () => {
    expect(parseUnit("meters").unit).toBe(LENGTH_UNITS.meter)
})

test("parse inches, plural", () => {
    expect(parseUnit("inches").unit).toBe(LENGTH_UNITS.inch)
})

test("parse metery should throw", () => {
    expect(() => parseUnit("metery")).toThrow()
})

test("parse abbriviated unit m", () => {
    expect(parseUnit("m").unit).toBe(LENGTH_UNITS.meter)
})

test("parse abbriviated unit km", () => {
    const { unit, prefix } = parseUnit("km")
    expect(unit).toBe(LENGTH_UNITS.meter)
    expect(prefix).toBe(SI_PREFIXES.kilo)
})

test("parse abbriviated inches", () => {
    expect(parseUnit("in").unit).toBe(LENGTH_UNITS.inch)
})

test("1 kilometer should convert to 1000 meters", () => {
    const meters = convert(1, parseUnit("kilometer"), parseUnit("meter"))
    expect(meters).toBe(1000)
})

test("1000 meters should convert to 1 kilometer", () => {
    const kilometers = convert(1000, parseUnit("meter"), parseUnit("kilometer"))
    expect(kilometers).toBe(1)
})
