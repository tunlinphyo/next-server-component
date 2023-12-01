import { FormArrayType } from "@/libs/definations"


export function usePayment() {
    const years = getYears()
    const monthes = getMonths()

    return { years, monthes }
}

function getYears() {
    const date = new Date()
    const year = date.getFullYear()
    const years: FormArrayType[] = []
    for(let i = 0; i < 10; i++) {
        const y = year + i
        years.push({
            id: y,
            name: String(y)
        })
    }
    return years
}

function getMonths() {
    const monthes: FormArrayType[] = []
    for (let i = 1; i <= 12; i++) {
        const month = i < 10 ? '0'.concat(String(i)) : String(i)
        monthes.push({
            id: i,
            name: month
        })
    }
    return monthes
}