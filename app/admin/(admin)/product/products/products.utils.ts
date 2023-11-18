import { ProductClassType } from "@/libs/definations"

export function getStockAndPrices(classList: ProductClassType[]) {
    let prices: number[] = [], total: number = 0
    for (const item of classList) {
        total += item.quantity
        prices.push(item.price)
    }

    return {
        stockTotal: Math.max(total, 0),
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices)
    }
}
