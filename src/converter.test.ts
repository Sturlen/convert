import { convertUnit } from "./converter"

test("parse meter, meters and m", () => {
    expect(convertUnit(1, "m", "m")).toBe(1)
    expect(convertUnit(1, "meter", "meter")).toBe(1)
    expect(convertUnit(1, "meters", "meters")).toBe(1)
})

test("parse kilometer, kilometers and km", () => {
    expect(convertUnit(1, "km", "km")).toBe(1)
    expect(convertUnit(1, "kilometer", "kilometer")).toBe(1)
    expect(convertUnit(1, "kilometers", "kilometers")).toBe(1)
})

test("12 inches should convert to 1 foot", () => {
    expect(convertUnit(12, "inches", "feet")).toBeCloseTo(1)
    expect(convertUnit(1, "foot", "in")).toBeCloseTo(12)
})

test("1 kg should be 2.2 lbs", () => {
    expect(convertUnit(1, "kg", "lb")).toBeCloseTo(2.2)
})

test("1 kilometer should convert to 1000 meters", () => {
    expect(convertUnit(1, "kilometer", "meter")).toBe(1000)
})

test("1000 meters should convert to 1 kilometer", () => {
    expect(convertUnit(1000, "meter", "kilometer")).toBe(1)
})

test("should throw if units are invalid", () => {
    expect(() => convertUnit(1000, "trucktons", "kilometer")).toThrow()
})
