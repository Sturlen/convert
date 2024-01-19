# Usage
Syntax:

```bash
npx @sturlen/convert AMOUNT FROM TO
```


Example:

```bash
npx @sturlen/convert 1 kilometer miles
0.6
```


Supports SI-prefixes, singular, plural and abbreviations. e.g. `kilometer, kilometers, km`

# Issues

If you want to request a feature or report a bug, feel free to open an [issue on Github](https://github.com/Sturlen/convert/issues/).

# Supported units

All SI-units support the following prefixes:
- yotta
- zetta
- exa
- peta
- tera
- giga
- mega
- kilo
- hecto
- deca
- deci
- centi
- milli
- micro
- nano
- pico
- femto
- atto
- yocto
- zepto


## Length
- meter
- inch
- foot
- yard
- mile

## Weight
- gram
- pound

## Temperature
- kelvin
- celsius
- fahrenheit
- rankin

# Todo
- More quantities
- Library version
- Better precision
- Help command
- Handle mulitple unit matches, e.g. Celsius(C) and Candela(C)
- Better way of testing all units, rather then manualy writing tests for each.
- Dimensonality (m3, sqaure-foot, etc.)
- Combined units (meters-per-second, mph)