const round = (num) => (Math.trunc(num * 100) / 100)

/** ***************** Price *******************/
class Price {
  constructor ({amount, currency, operations}) {
    this.amount = amount
    this.currency = currency || '€'
    this.printable = `${this.amount}${this.currency}`
    this.operations = operations !== undefined ? operations : `${this.printable}`
  }

  add (price) {
    if (this.currency !== price.currency) {
      throw new Error('mism currencies')
    }
    return new Price({
      amount: this.amount + price.amount,
      currency: this.currency,
      operations: `${this.operations} + ${price.operations}`
    })
  }

  multiplyFactor (factor) {
    return new Price({
      amount: round(this.amount * factor),
      currency: this.currency,
      operations: `${this.operations} * ${factor}(qty)`
    })
  }

  includeTax (tax) {
    const taxValue = tax instanceof Function ? tax() : tax
    const factor = 1 - Math.abs(taxValue)
    return new Price({
      amount: round(this.amount * factor),
      currency: this.currency,
      operations: `${this.operations} * ${factor} (tax of ${round(taxValue * 100)}%)`
    })
  }

  removeTax (tax) {
    const taxValue = tax instanceof Function ? tax() : tax
    const factor = 1 + Math.abs(taxValue)
    return new Price({
      amount: round(this.amount / factor),
      currency: this.currency,
      operations: `${this.operations} * ${factor} (tax of ${round(taxValue * 100)}%)`
    })
  }

  static zero (currency) {
    return new Price({amount: 0, operations: '', currency})
  }
}
module.exports = Price
