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
    return listable.map(p => p.tax).reduce((t1, t2) => (t1 + t2), 0) / listable.length
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

  static empty () {
    return new ProductList([])
  }
}
module.exports = ProductList
