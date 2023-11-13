import { FormArrayType, ProductClassType } from "@/libs/definations";

export interface FormProductClassType {
    id: string;
    variant1: number;
    name1: string;
    variant2?: number;
    name2?: string;
    price: string;
    quantity: string;
}

export function generateClasses(classes: ProductClassType[], variant1: FormArrayType[], variant2?: FormArrayType[]) {
    console.log(classes)
    if (!variant1) return []
    if (variant2) {
        const combinations: FormProductClassType[] = []

        let index = 0
        for (const item1 of variant1) {
            for (const item2 of variant2) {
                const oldClass = _getClass(classes, item1.id, item2.id)
                index ++
                const formData: FormProductClassType = {
                    id: oldClass ? String(oldClass.id) : '',
                    variant1: item1.id,
                    name1: item1.name,
                    variant2: item2.id,
                    name2: item2.name,
                    price: oldClass ? String(oldClass.price) : '',
                    quantity: oldClass ? String(oldClass.quantity) : '',
                }
                combinations.push(formData)
            }
        }
        return combinations
    }
    return variant1.map((item, index) => {
        const oldClass = _getClass(classes, item.id)
        const formData: FormProductClassType = {
            id: oldClass ? String(oldClass.id) : '',
            variant1: item.id,
            name1: item.name,
            price: oldClass ? String(oldClass.price) : '',
            quantity: oldClass ? String(oldClass.quantity) : '',
        }
        return formData
    })
}

function _getClass(classes: ProductClassType[], variantId1: number, variantId2?: number) {
    if (!variantId2) {
        return classes.find(item => item.variant_1_id == variantId1)
    }
    return classes.find(item => (
        item.variant_1_id == variantId1
        && item.variant_2_id == variantId2
    ))
}