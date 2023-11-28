import { CustomerAddress } from "@prisma/client"

export function formatAddress(address: CustomerAddress) {
    const [ , country ] = address.country.split(':')
    const [ , , state] = address.state.split(':')
    const [ , , city ] = address.city.split(':')

    return `${address.address}, ${city}, ${state}, ${country}.`
}