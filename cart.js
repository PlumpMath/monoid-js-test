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
    const byTaxes = this.productList.filterByTax()
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
              'total (HT)': p.removeTax().total.printable
            })),
      'Totals': {
        'Remises': this.productList.products
            .filter(p => !p.listable)
            .map(p => ({
              name: p.name,
              'total (TTC)': p.total.printable,
              'total (HC)': p.removeTax().total.printable
            })),
        'Total products (TTC)': this.getTotals(),
        'Total HT': this.getTotalsHT(),
        'Total per tax': byTaxes.map(t => {
          return {
            'Tax': `${round(t.products[0].tax * 100)}%`,
            'Total payed for this tax (TTC)': t.getTotals(),
            'Total payed for this tax (HT)': t.getTotalsHT(),
            'Partial Remises': t.products
              .filter(p => !p.listable)
              .map(p => ({
                'Name': p.name,
                'total (TTC)': p.price.printable,
                'total (HC)': p.removeTax().price.printable
              }))
          }
        })
      }
    }
  }

  getMachineReadableFacture () {
    const byTaxes = this.productList.filterByTax()
    return {
      products: this.productList.products
            .filter(p => p.listable)
            .map(p => ({
              name: p.name,
              tax: `${round(p.tax * 100)}%`,
              price_ttc: p.price.amount,
              price_ht: p.removeTax().price.amount,
              quantity: p.quantity,
              total_ttc: p.total.amount,
              total_ht: p.removeTax().total.amount
            })),
      totals: {
        remises: this.productList.products
            .filter(p => !p.listable)
            .map(p => ({
              name: p.name,
              total_ttc: p.price.amount,
              total_ht: p.removeTax().price.amount
            })),
        ttc: this.getTotals(),
        ht: this.getTotalsHT()
      },
      bytaxes: byTaxes.map(t => {
        return {
          tax: t.products[0].tax,
          total_per_tax_ttc: t.getTotals(),
          total_per_tax_ht: t.getTotalsHT(),
          remise: t.products
            .filter(p => !p.listable)
            .map(p => ({
              name: p.name,
              ttc: p.price.amount,
              ht: p.removeTax().price.amount
            }))
        }
      })
    }
  }
}

module.exports = Cart
