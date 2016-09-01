# Cart Monoids

Here a simple cart implemented through monoids. Basically the monoids are in the price and in the product list.

The idea is that every product is inserted TTC in the cart.
Then the facture will show both the prices TTC and HT.

Actually is possible to do also the inverse, the only constraint (which is not coded atm) is that all the prices must be represented the same way (all TTC or all HT).

Here an example of output:

```JSON
{
  "Products": [
    {
      "name": "a",
      "tax": "10%",
      "price (TTC)": "10€",
      "price (HT)": "9.09€",
      "quantity": 2,
      "total (TTC)": "20€",
      "total (HT)": "18.18€"
    },
    {
      "name": "b",
      "tax": "20%",
      "price (TTC)": "12€",
      "price (HT)": "10€",
      "quantity": 1,
      "total (TTC)": "12€",
      "total (HT)": "10€"
    }
  ],
  "Totals": {
    "Remises": [
      {
        "name": "remise",
        "total (TTC)": "-5€",
        "total (HC)": "-4.34€"
      }
    ],
    "Total products (TTC)": {
      "amount": 27,
      "currency": "€",
      "printable": "27€",
      "operations": "10€ * 2(qty) + 12€ * 1(qty) + -5€ * 1(qty)"
    },
    "Total HT": {
      "amount": 23.84,
      "currency": "€",
      "printable": "23.84€",
      "operations": "10€ * 1.1 (tax of 10%) * 2(qty) + 12€ * 1.2 (tax of 20%) * 1(qty) + -5€ * 1.15 (tax of 15%) * 1(qty)"
    }
  }
}
```

