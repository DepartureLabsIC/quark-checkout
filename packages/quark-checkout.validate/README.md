# @departurelabs/quark-checkout

- [@departurelabs/quark-checkout](#departurelabsquark-checkout)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Websites](#websites)

## Installation

```sh
npm i -S @departurelabs/quark-checkout @departurelabs/quark-checkout.validate
```

## Usage

Example integration:

```js
import { initialize, TOKENS, PROVIDERS } from "@departurelabs/quark-checkout"
// NOTE: quark.validate can be removed when you have a valid configuration
import { validate } from "@departurelabs/quark-checkout.validate"

const { checkout } = initialize(
  validate.config({
    provider: PROVIDERS.II,
    domain: "https://pwwjo-6qaaa-aaaam-aadka-cai.ic0.app",
    notify: {
      principalId: "dlftw-sqaaa-aaaaa-danil-cai",
      methodName: "callback",
    },
    integrator: "company@testnet.quark",
    callback: event => {
      if (event.type === "checkoutComplete") {
        if (event.data.result === "Accepted") {
          checkoutComplete()
        } else {
          checkoutFailed()
        }
      }
    },
  }),
)

const basket = [
  {
    name: "Spoon",
    description: "Use this for your soup",
    value: 10000000,
    token: TOKENS.TEST,
  },
]

checkout(validate.basket(basket))
```

## Websites

- [@departurelabs/quark-checkout](https://www.npmjs.com/package/@departurelabs/quark-checkout)
  Quark Integration script
- [GitHub Quark source](https://github.com/DepartureLabsIC/rs_quark)
- [GitHub Quark npm package source](https://github.com/DepartureLabsIC/quark-checkout)
