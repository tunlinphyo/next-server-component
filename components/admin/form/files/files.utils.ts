

export function removeCommonImages(baseArray: string[], otherArray: string[]) {
    const result = baseArray.filter((element) => !otherArray.includes(element))
    console.log('TEST_FUNCTION', baseArray, otherArray, result)
    return result
}