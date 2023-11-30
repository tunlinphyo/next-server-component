import { PhoneCodeArrayType } from "@/libs/definations"
import { Country, ICountry } from "country-state-city"


export function getCountryCodes() {
    const countries: ICountry[] = Country.getAllCountries()
    const list: PhoneCodeArrayType[] = []
    for (const country of countries) {
        list.push({
            id: `${getCode(country.phonecode)}:${country.isoCode}`,
            flag: country.flag,
            code: getCode(country.phonecode),
            name: `${country.flag} (${getCode(country.phonecode)}) ${country.name}`
        })
    }
    return list
}

function getCode(code: string) {
    return code.startsWith("+") ? code : "+".concat(code)
}
