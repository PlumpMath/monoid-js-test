const Remise = require('./remise')
const Price = require('./price')
const _ = require('lodash')

const round = (num) => (Math.trunc(num * 100) / 100)

class ProductList {
  constructor (products) {
    this.products = this._evaluateProducts(products)
  }

  _evaluateProducts (products) {
    return products.map(p => {
      if (!p.listable) {
        p.tax = () => this.getAvgTax()
      }
      return p
    })
  }

  _getListable () {
    return this.products.filter(p => p.listable)
  }

  _getDiscounts () {
    return this.products.filter(p => !p.listable)
  }

  _getProductsWeigth () {
    return this.products.filter(p => p.listable).map(p => p.price.amount).reduce((p1, p2) => p1 + p2)
  }

  getTotals () {
    // Consider quantity
    if (this.products.length === 1) {
      const p = this.products[0]
      return p.price.multiplyFactor(p.quantity)
    }
    const sumPrice = this.products.map(p => p.price.multiplyFactor(p.quantity)).reduce((price, nextPrice) => price.add(nextPrice))
    return sumPrice
  }

  getTotalsHT () {
    // Consider quantity
    if (this.products.length === 1) {
      return this.products[0].removeTax(this).price
    }
    const sumPrice = this.products
    .map(p => p.removeTax().price.multiplyFactor(p.quantity))
    .reduce((p1, p2) => {
      return p1.add(p2)
    })
    return sumPrice
  }

  getAvgTax () {
    const listable = this.products.filter(p => p.listable)
    const taxes = listable.map(p => ({v: p.tax, w: p.price.amount}))
    let total = 0
    let weigth = 0
    for (var i in taxes) {
      total += taxes[i].v * taxes[i].w
      weigth += taxes[i].w
    }
    const averageTax = round(total / weigth)
    return averageTax
  }

  add (productList) {
    // Possibly group products by id
    const products = this.products.concat(productList.products)
    return new ProductList(products)
  }

  addProduct (product) {
    return this.addProducts([product])
  }

  addProducts (products) {
    return this.add(new ProductList(products))
  }

  filter (filterFunc) {
    const discounts = this._getDiscounts()
    const allProductsWeigth = this._getProductsWeigth()
    const filtered = new ProductList(this._getListable().filter(filterFunc))
    const filteredProductWeight = filtered._getProductsWeigth()
    const partialDiscounts = discounts.map(d => {
      return new Remise(
        {
          id: d.id,
          name: d.name,
          price: new Price({
            amount: round(d.price.amount * filteredProductWeight / allProductsWeigth),
            currency: d.price.currency
          })
        }
      )
    })
    return filtered.addProducts(partialDiscounts)
  }

  filterByTax () {
    const products = this._getListable()
    const createByTaxFilter = tax => p => p.tax === tax
    return _.uniq(products.map(p => p.tax)).map(
      tax => this.filter(createByTaxFilter(tax))
    )
  }

  static empty () {
    return new ProductList([])
  }
}
module.exports = ProductList
