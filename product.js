class Product {
  constructor ({id, name, price, tax, quantity, listable}) {
    this.id = id
    this.name = name
    this.price = price
    this.tax = tax || 0
    this.quantity = quantity !== undefined ? quantity : 1
    this.listable = listable !== undefined ? listable : true
    this.total = this.price.multiplyFactor(this.quantity)
  }

  includeTax () {
    return new Product(
            Object.assign(
                {},
                this,
                {price: this.price.includeTax(this.tax)}
            )
        )
  }

  removeTax () {
    return new Product(
            Object.assign(
                {},
                this,
                {price: this.price.removeTax(this.tax)}
            )
        )
  }
}
module.exports = Product
