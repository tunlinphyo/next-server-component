import { GenericObject } from "./definations"


export function getZodErrors(errors: GenericObject[]) {
    const error: Record<string, string> = {}

    errors.forEach(item => {
        error[item.path] = item.message
    })

    return error
}

export function wait(time?: number) {
    const delay = getRandomItemFromArray([ 200, 400, 600, 800, 1000 ])
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
    if (!price) return 'Invalit price'
    const formattedPrice = price.toFixed(0)

    // Add thousands separator
    const parts = formattedPrice.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    // Concatenate the parts and add the currency symbol
    const result = currencySymbol + parts.join('.')

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