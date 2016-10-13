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
      "name": "Book",
      "tax": "10%",
      "price (TTC)": "11€",
      "price (HT)": "10€",
      "quantity": 1,
      "total (TTC)": {
        "amount": 11,
        "currency": "€",
        "printable": "11€",
        "operations": "11€ * 1(qty)"
      },
      "total (HT)": "10€"
    },
    {
      "name": "DVD",
      "tax": "20%",
      "price (TTC)": "24€",
      "price (HT)": "20€",
      "quantity": 1,
      "total (TTC)": {
        "amount": 24,
        "currency": "€",
        "printable": "24€",
        "operations": "24€ * 1(qty)"
      },
      "total (HT)": "20€"
    }
  ],
  "Totals": {
    "Remises": [
      {
        "name": "remise",
        "total (TTC)": "-5€",
        "total (HC)": "-4.3€"
      }
    ],
    "Total products (TTC)": {
      "amount": 30,
      "currency": "€",
      "printable": "30€",
      "operations": "11€ * 1(qty) + 24€ * 1(qty) + -5€ * 1(qty)"
    },
    "Total HT": {
      "amount": 25.7,
      "currency": "€",
      "printable": "25.7€",
      "operations": "11€ * 1.1 (tax of 10%) * 1(qty) + 24€ * 1.2 (tax of 20%) * 1(qty) + -5€ * 1.16 (tax of 16%) * 1(qty)"
    },
    "Total per tax": [
      {
        "Tax": "10%",
        "Total payed for this tax (TTC)": {
          "amount": 9.43,
          "currency": "€",
          "printable": "9.43€",
          "operations": "11€ * 1(qty) + -1.57€ * 1(qty)"
        },
        "Total payed for this tax (HT)": {
          "amount": 8.58,
          "currency": "€",
          "printable": "8.58€",
          "operations": "11€ * 1.1 (tax of 10%) * 1(qty) + -1.57€ * 1.1 (tax of 10%) * 1(qty)"
        },
        "Partial Remises": [
          {
            "Name": "remise",
            "total (TTC)": "-1.57€",
            "total (HC)": "-1.42€"
          }
        ]
      },
      {
        "Tax": "20%",
        "Total payed for this tax (TTC)": {
          "amount": 20.58,
          "currency": "€",
          "printable": "20.58€",
          "operations": "24€ * 1(qty) + -3.42€ * 1(qty)"
        },
        "Total payed for this tax (HT)": {
          "amount": 17.15,
          "currency": "€",
          "printable": "17.15€",
          "operations": "24€ * 1.2 (tax of 20%) * 1(qty) + -3.42€ * 1.2 (tax of 20%) * 1(qty)"
        },
        "Partial Remises": [
          {
            "Name": "remise",
            "total (TTC)": "-3.42€",
            "total (HC)": "-2.85€"
          }
        ]
      }
    ]
  }
}
```

