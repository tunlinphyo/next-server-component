import { ProductClass } from "@prisma/client"

export function getStockAndPrices(classList: ProductClass[]) {
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
