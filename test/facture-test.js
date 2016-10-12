const Price = require('../price')
const Product = require('../product')
const Remise = require('../remise')
const ProductList = require('../product-list')
const Cart = require('../cart')
const chai = require('chai')
chai.should()

const leeway = 0.02

const checkTaxExcludedTotal = (facture, expected) => {
  const reference = facture.totals.ttc.amount
  reference.should.equal(
    expected,
    `was expecting "${reference}" to be exact`
  )
}

const checkTaxIncludedTotal = (facture, expected) => {
  const reference = facture.totals.ht.amount
  reference.should.be.closeTo(
    expected,
    leeway,
    `${reference} is too far away from a plausible value`
  )
}

const checkTaxExcludedDiscount = (facture, expected) => {
  const reference = facture.totals.remises[0].total_ht
  reference.should.be.closeTo(
    expected,
    leeway,
    `${reference} is too far away from a plausible value`
  )
}

const checkDiscountPerTaxExcl = (facture, expected) => {
  expected.forEach((ex, i) => {
    const reference = facture.bytaxes[i].total_per_tax_ht.amount
    reference.should.be.closeTo(
      ex,
      leeway,
      `${reference} is too far away from a plausible value`
    )
  })
}

const checkDiscountPerTaxIncl = (facture, expected) => {
  expected.forEach((ex, i) => {
    const reference = facture.bytaxes[i].total_per_tax_ttc.amount
    reference.should.equal(
      ex,
      `${reference} is too far away from a plausible value`
    )
  })
}

describe('Tax Computations', () => {
  it('two heterogeneous products and a discount tax excluded', function () {
    const p1 = new Product({id: 1, name: 'Book', quantity: 1, tax: 0.1, price: new Price({amount: 11, currency: '€'})})
    const p2 = new Product({id: 2, name: 'DVD', tax: 0.2, price: new Price({amount: 24, currency: '€'})})
    const remise = new Remise({id: 3, name: 'remise', price: new Price({amount: -5, currency: '€'})})
    const pl = new ProductList([p1, p2, remise])
    const cart = new Cart({id: 'cart_1', productList: pl})
    const facture = cart.getMachineReadableFacture()

    // Tax include should be exact
    checkTaxExcludedTotal(facture, 30)
    checkTaxIncludedTotal(facture, 25.71)
    checkTaxExcludedDiscount(facture, -4.29)
    checkDiscountPerTaxIncl(facture, [9.43, 20.58])
    checkDiscountPerTaxExcl(facture, [8.57, 17.14])
  })
})
