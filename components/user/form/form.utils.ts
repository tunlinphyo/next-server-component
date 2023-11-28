import { FormArrayType } from "@/libs/definations"
import { Country, ICountry } from "country-state-city"


export function getCountryCodes() {
    const countries: ICountry[] = Country.getAllCountries()
    const list: FormArrayType[] = []
    for (const country of countries) {
        list.push({
            id: country.phonecode,
            name: `${country.flag} ${country.phonecode}`
        })
    }
    return list
}
