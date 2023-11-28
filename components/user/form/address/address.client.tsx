'use client'

import { Select, Textarea } from "../form.client"
import { useAddress } from "./address.utils"

interface AddressProps {
    address?: string;
    country?: string;
    state?: string;
    city?: string;
    error?: Record<string, string>;
}

export function AddressInput({ address, country, state, city, error }: AddressProps) {
    const { 
        countries,
        states,
        cities,

        onCountryChange,
        onStateChange,
    } = useAddress(country, state)

    return (
        <>
            <Select
                name="country"
                list={countries}
                placeholder="Select a country"
                onChange={onCountryChange}
                defaultValue={country}
                error={error?.country}
            >Country</Select>
            <Select
                name="state"
                list={states}
                disabled={!states.length}
                placeholder="Select a state"
                onChange={onStateChange}
                defaultValue={state}
                error={error?.state}
            >State</Select>
            <Select
                name="city"
                list={cities}
                disabled={!cities.length}
                placeholder="Select a city"
                defaultValue={city}
                error={error?.city}
            >City</Select>
            <Textarea
                name="address"
                defaultValue={address}
                error={error?.address}
            >Address</Textarea>
        </>
    )
}