import { GenericObject } from "./definations"


export function getZodErrors(errors: GenericObject[]) {
    const error: Record<string, string> = {}

    errors.forEach(item => {
        error[item.path] = item.message
    })

    return error
}

export function wait(time?: number) {
    const delay = getRandomItemFromArray([ 200, 300, 400, 500, 600, 700, 800 ])
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), time || delay)
    })
}

export function formatDate(date: Date | string, locale = 'en-US') {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };

    const formattedDate = new Intl.DateTimeFormat(locale, options).format(date);
    return formattedDate;
}

export function getRandomItemFromArray(array: any[]) {
    if (array.length === 0) {
        return undefined
    }

    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex]
}

export function getCheckboxValues(formData: FormData, name: string) {
    return Object.entries(Object.fromEntries(formData))
        .filter(([key, _]) => key.startsWith(name))
        .map(([_, value]) => Number(value))
}

function getValueAfterLastUnderscore(input: string): string | undefined {
    const parts = input.split('_');
    return parts.length > 1 ? parts[parts.length - 1] : undefined;
}

function extractValues(input: string): [ string, string | undefined ] {
    const lastUnderscoreIndex = input.lastIndexOf('_')

    if (lastUnderscoreIndex !== -1) {
        const before = input.substring(0, lastUnderscoreIndex)
        const after = input.substring(lastUnderscoreIndex + 1)
        return [ before, after ]
    }

    return [ input, undefined ]
}

export function getFormDataBy(formData: FormData, index: number) {
    const formObject: GenericObject = {}
    Object.entries(Object.fromEntries(formData))
        .filter(([key, _]) => index === Number(getValueAfterLastUnderscore(key)))
        .forEach(([key, value]) => {
            const [ keyName ] = extractValues(key)
            formObject[keyName] = value
        })

    return formObject
}

export function formatPrice(price: number | undefined, currencySymbol: string = '$'): string {
    if (Number.isNaN(price)) return 'Invalit price'
    // @ts-ignore
    const formattedPrice = price.toFixed(0)

    // Add thousands separator
    const parts = formattedPrice.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    // Concatenate the parts and add the currency symbol
    const result = `${currencySymbol}${parts.join('.')}`

    return result
}

export function isObjectEmpty(obj: Record<string, any>): boolean {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false
        }
    }
    return true
}

export function localCompare(value: string, key: string) {
    return value.toLowerCase().includes(key.toLowerCase())
}

export function encodeURL(urlParameter: string) {
    return encodeURIComponent(urlParameter)
}

export function getRandomElements<T>(arr: T[], count: number): T[] {
    if (count >= arr.length) {
        return arr.slice()
    }

    const shuffledArray = arr.sort(() => Math.random() - 0.5);
    return shuffledArray.slice(0, count);
}

export function mapRange(number: number, startRange1: number, endRange1: number, startRange2: number, endRange2: number) {
    if (number < startRange1) {
      number = startRange1;
    } else if (number > endRange1) {
      number = endRange1;
    }

    const range1 = endRange1 - startRange1;
    const range2 = endRange2 - startRange2;

    const mappedValue =
      ((number - startRange1) * range2) / range1 + startRange2;

    return mappedValue;
}

export function maskNumber(inputString: string, asteriskCount?: number): string {
    if (!asteriskCount) asteriskCount = inputString.length
    const hideCount = inputString.length - asteriskCount

    const maskedPart = '*'.repeat(Math.max(hideCount, asteriskCount))
    if (hideCount <= 0) {
      return maskedPart
    }
    const lastPart = inputString.slice(-hideCount)

    return maskedPart + lastPart
}

export function addSpaceEveryFourCharacters(input: string): string {
    const spacedString = input.replace(/(.{4})/g, '$1 ');

    return spacedString.trim();
}

export function withPadStart(num: number, len: number = 6, placeholder: string = '0') {
    const formattedNum: string = num.toString().padStart(len, placeholder)

    return formattedNum
}