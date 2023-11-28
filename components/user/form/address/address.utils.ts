import { FormArrayType } from "@/libs/definations";
import { City, Country, ICity, ICountry, IState, State } from "country-state-city";
import { useEffect, useState } from "react";


export function useAddress(country?: string, state?: string) {
    console.time("ADDRESS")
    const countries = getFormCountries()
    const initStates = country ? getFormStates(country) : []
    const initCities = state ? getFormCities(state) : []
    console.timeEnd("ADDRESS")
    const [ states, setStates ] = useState<FormArrayType[]>(initStates)
    const [ cities, setCities ] = useState<FormArrayType[]>(initCities)

    function onCountryChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setStates(getFormStates(event.target.value))
    }

    function onStateChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setCities(getFormCities(event.target.value))
    }

    return {
        countries,
        states,
        cities,
        onCountryChange,
        onStateChange,
    }
}

function getFormCountries() {
    const countries: ICountry[] = Country.getAllCountries()
    const list: FormArrayType[] = []
    for (const country of countries) {
        list.push({
            id: `${country.isoCode}:${country.name}`,
            name: `${country.flag} ${country.name}`
        })
    } 
    return list
} 

function getFormStates(code: string) {
    const [ countryCode ] = code.split(':')
    const states: IState[] = State.getStatesOfCountry(countryCode)
    const list: FormArrayType[] = []
    for (const state of states) {
        list.push({
            id: `${countryCode}:${state.isoCode}:${state.name}`,
            name: state.name
        })
    } 
    return list
}

function getFormCities(code: string) {
    const [ countryCode, stateCode ] = code.split(':')
    const cities: ICity[] = City.getCitiesOfState(countryCode, stateCode)
    const list: FormArrayType[] = []
    for (const city of cities) {
        list.push({
            id: `${city.countryCode}:${city.stateCode}:${city.name}`,
            name: city.name
        })
    } 
    return list
}