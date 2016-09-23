const Product = require('./product')
class Remise {
  constructor ({id, name, price}) {
    return new Product({
      id,
      name,
      listable: false,
      quantity: 1,
      tax: () => {
        throw new Error('Cannot calculate taxes until inserted in a product list')
      },
      price
    })
  }
}

module.exports = Remise
