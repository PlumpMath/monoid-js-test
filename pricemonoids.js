const round = (num) => (Math.trunc(num*100) / 100);

/******************* Price *******************/
const Price = function({amount, currency, operations}) {
    this.amount = amount;
    this.currency = currency;
    this.printable = `${this.amount}${this.currency}`
    this.operations = operations !== undefined ? operations : `${this.printable}`
}

Price.prototype.add = function(p) {
    if(this.currency !== p.currency) {
        throw new Error('mism currencies');
    }
    return new Price({
        amount: this.amount + p.amount,
        currency: this.currency,
        operations: `${this.operations} + ${p.operations}`
    });
}

Price.prototype.multiplyFactor = function(f) {
    return new Price({
        amount: round(this.amount * f),
        currency: this.currency,
        operations: `${this.operations} * ${f}(qty)`
    });
}

Price.prototype.includeTax = function(tax, productList) {
    const taxValue = tax instanceof Function ? tax(productList) : tax;
    const factor = 1 - Math.abs(taxValue);
    return new Price({
        amount: round(this.amount * factor),
        currency: this.currency,
        operations: `${this.operations} * ${factor} (tax of ${round(taxValue*100)}%)`
    })
}

Price.prototype.removeTax = function(tax, productList) {
    const taxValue = tax instanceof Function ? tax(productList) : tax;
    const factor = 1 + Math.abs(taxValue);
    return new Price({
        amount: round(this.amount / factor),
        currency: this.currency,
        operations: `${this.operations} * ${factor} (tax of ${round(taxValue*100)}%)`
    })
}

Price.zero = currency => new Price({amount: 0, operations: '', currency});


/******************* Product *******************/
const Product = function({id, name, price, tax, quantity, listable}) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.tax = tax || 0;
    this.quantity = quantity !== undefined ? quantity : 1;
    this.listable = listable !== undefined ? listable : true;
    this.total = this.price.multiplyFactor(this.quantity).printable;
}

Product.prototype.includeTax = function(plist) {
    return new Product(
        Object.assign(
            {},
            this,
            { price: this.price.includeTax(this.tax, plist)}
        )
    );
}

Product.prototype.removeTax = function(plist) {
    return new Product(
        Object.assign(
            {},
            this,
            { price: this.price.removeTax(this.tax, plist)}
        )
    );
}

/******************* Remise *******************/
const Remise = function({id, name, price}) {
    return new Product({
        id,
        name,
        listable: false,
        quantity: 1,
        tax: productList => productList.getAvgTax(),
        price
    });
}


/******************* Product List *******************/
const ProductList = function(products){
    this.products = products;
}

ProductList.prototype.getTotals = function(){
    // Consider quantity
    if(this.products.length === 1) {
        const p = this.products[0];
        return p.price.multiplyFactor(p.quantity);
    }
    const sumPrice = this.products.map(p => p.price.multiplyFactor(p.quantity)).reduce((price, nextPrice) => price.add(nextPrice));
    return sumPrice;
}

ProductList.prototype.getTotalsHT = function(){
    // Consider quantity
    if(this.products.length === 1) {
        return this.products[0].removeTax(this).price;
    }
    const sumPrice = this.products
    .map(p => p.removeTax(this).price.multiplyFactor(p.quantity))
    .reduce((p1, p2) => {
        return p1.add(p2);
    });
    return sumPrice;
}

ProductList.prototype.getAvgTax = function(){
    const listable = this.products.filter(p => p.listable);
    return listable.map(p => p.tax).reduce((t1, t2) => (t1 + t2), 0) / listable.length;
}

ProductList.prototype.add = function(pl){
    // Possibly group products
    return new ProductList(this.products.concat(pl.products));
}

ProductList.prototype.addProduct = function(p){
    return this.add([p]);
}

ProductList.empty = () => new ProductList([]);

const Cart = function({id, productList}){
    this.id = id;
    this.productList = productList;
}

/******************* Cart *******************/
Cart.prototype.addProduct = p => {
    this.productList = this.productList.addProduct(p);
}

Cart.prototype.getTotals = function(){ return this.productList.getTotals(); }
Cart.prototype.getTotalsHT = function(){ return this.productList.getTotalsHT(); }

Cart.prototype.getFacture = function(){
    return {
        'Products': this.productList.products
            .filter(p => p.listable)
            .map(p => ({
                name: p.name,
                tax: `${round(p.tax*100)}%`,
                'price (TTC)': p.price.printable,
                'price (HT)': p.removeTax(this.productList).price.printable,
                quantity: p.quantity,
                'total (TTC)': p.total
            })),
        'Totals': {
           'Remises': this.productList.products
            .filter(p => !p.listable)
            .map(p => ({
                name: p.name,
                'total (TTC)': p.price.printable,
                'total (HC)': p.removeTax(this.productList).price.printable
            })),
           'Total products (TTC)' : this.getTotals(),
           'Total HT': this.getTotalsHT(),
        }
    }
}



/******************* Examples *******************/
const p1 = new Product({id:1, name: 'a', quantity: 1, tax: 0.1, price: new Price({amount:10, currency: '€'})});
const p2 = new Product({id:2, name: 'b', tax: 0.2, price: new Price({amount:12, currency: '€'})});
const remise = new Remise({id:3, name: 'remise',price: new Price({amount:-5, currency: '€'})});

const pl = new ProductList([p1, p2, remise]);

const cart = new Cart({id: 'cart_1', productList: pl});

console.log(JSON.stringify(cart.getFacture(), null, '  '));

console.log('\n=====================================\n');

// const p3 = new Product({id:1, name: 'a', tax: 0.2, price: new Price({amount:14.5, currency: '€'})});
// const remise2 = new Remise({id:3, name: 'remise', price: new Price({amount:-5, currency: '€'})});

// const pl2 = new ProductList([p3, remise2]);

// const cart2 = new Cart({id: 'cart_1', productList: pl2});

// console.log(JSON.stringify(cart2.getFacture(), null, '  '));
