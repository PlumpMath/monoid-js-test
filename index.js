const Price = require('./price')
const Product = require('./product')
const Remise = require('./remise')
const ProductList = require('./product-list')
const Cart = require('./cart')

/** ***************** Examples *******************/
const p1 = new Product({id: 1, name: 'Book', quantity: 1, tax: 0.1, price: new Price({amount: 11, currency: '€'})})
const p2 = new Product({id: 2, name: 'DVD', tax: 0.2, price: new Price({amount: 24, currency: '€'})})
const remise = new Remise({id: 3, name: 'remise', price: new Price({amount: -5, currency: '€'})})

const pl = new ProductList([p1, p2, remise])

const cart = new Cart({id: 'cart_1', productList: pl})

console.log(JSON.stringify(cart.getFacture(), null, '  '))
// console.log(JSON.stringify(cart.getMachineReadableFacture(), null, '  '))

// console.log(JSON.stringify(pl.filterByTax(), null, '  '))

// console.log(pl._getProductsWeigth())

console.log('\n=====================================\n')

// const p3 = new Product({id:1, name: 'a', tax: 0.2, price: new Price({amount:14.5, currency: '€'})});
// const remise2 = new Remise({id:3, name: 'remise', price: new Price({amount:-5, currency: '€'})});

// const pl2 = new ProductList([p3, remise2]);

// const cart2 = new Cart({id: 'cart_1', productList: pl2});

// console.log(JSON.stringify(cart2.getFacture(), null, '  '));
