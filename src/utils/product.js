// @flow

import type { Product, ProductId } from '../flowtype/product-types'
import { currencies } from './constants'
import { fromAtto, fromNano, toAttoString, toNanoString } from './math'

export const validateProductId = (id: ?ProductId, enforceHexPrefix: boolean = false) => {
    if (!id) {
        throw new Error('No id specified')
    }
    if (!new RegExp(`(0x)${!enforceHexPrefix ? '?' : ''}[0-9a-fA-F]+`).test(id)) {
        throw new Error('Id is not a valid hex string')
    }
}

export const validateProductPriceCurrency = (priceCurrency: string) => {
    const currencyIndex = Object.keys(currencies).indexOf(priceCurrency)
    if (currencyIndex < 0) {
        throw new Error(`Invalid currency: ${priceCurrency}`)
    }
}

export const validateApiProductPricePerSecond = (pricePerSecond: number) => {
    if (pricePerSecond < 0) {
        throw new Error('Product price must be equal to or greater than 0')
    }
}

export const validateContractProductPricePerSecond = (pricePerSecond: number) => {
    if (pricePerSecond <= 0) {
        throw new Error('Product price must be greater than 0 to publish')
    }
}

export const mapPriceFromContract = (pricePerSecond: number) => fromAtto(pricePerSecond)

export const mapPriceToContract = (pricePerSecond: number): string => toAttoString(pricePerSecond)

export const mapPriceFromApi = (pricePerSecond: number) => fromNano(pricePerSecond)

export const mapPriceToApi = (pricePerSecond: number) => parseFloat(toNanoString(pricePerSecond))

export const mapProductFromApi = (product: Product) => {
    const pricePerSecond = mapPriceFromApi(product.pricePerSecond)
    return {
        ...product,
        pricePerSecond,
    }
}

export const mapProductToApi = (product: Product) => {
    const pricePerSecond = Math.trunc(mapPriceToApi(product.pricePerSecond))
    validateApiProductPricePerSecond(pricePerSecond)
    validateProductPriceCurrency(product.priceCurrency)
    return {
        ...product,
        pricePerSecond,
    }
}
