import { Prisma } from "@prisma/client"
import prisma from "."

// CREATE 
export async function createDBVariant(query: Prisma.VariantCreateArgs) {
    const variant = await prisma.variant.create(query)
    console.log("VARIANT_CREATED____", variant)
    return variant
}

// READ AGGREGATE
export async function getDBVariantsBy(query: Prisma.VariantAggregateArgs) {
    return await prisma.variant.aggregate(query)
}


// READ MANY
export async function getDBVariants(query: Prisma.VariantFindManyArgs) {
    return await prisma.variant.findMany(query)
}

// READ ONE
export async function getDBVariant(query: Prisma.VariantFindUniqueArgs) {
    const variant = await prisma.variant.findUnique(query)
    console.log("VARIANT____", query, variant)
    return variant
}

// UPDATE ONE
export async function updateDBVariant(query: Prisma.VariantUpdateArgs) {
    const updated = await prisma.variant.update(query)
    console.log("VARIANT_UPDATED____", query, updated)
    return updated
}