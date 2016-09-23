const round = (num) => (Math.trunc(num * 100) / 100)

class Cart {
  constructor ({id, productList}) {
    this.id = id
    this.productList = productList
  }

  addProduct (product) {
    this.productList = this.productList.addProduct(product)
  }

  getTotals () { return this.productList.getTotals() }
  getTotalsHT () { return this.productList.getTotalsHT() }

  getFacture () {
    return {
      'Products': this.productList.products
            .filter(p => p.listable)
            .map(p => ({
              name: p.name,
              tax: `${round(p.tax * 100)}%`,
              'price (TTC)': p.price.printable,
              'price (HT)': p.removeTax().price.printable,
              quantity: p.quantity,
              'total (TTC)': p.total,
              'total (HT)': p.removeTax().total
            })),
      'Totals': {
        'Remises': this.productList.products
            .filter(p => !p.listable)
            .map(p => ({
              name: p.name,
              'total (TTC)': p.total,
              'total (HC)': p.removeTax().total
            })),
        'Total products (TTC)': this.getTotals(),
        'Total HT': this.getTotalsHT()
      }
    }
  }
}

module.exports = Cart
