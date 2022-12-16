# @departurelabs/quark-checkout

Quark's npm packages to integrate Quark in in your IC application to support
payments on Dfinity's Internet Computer.

Quark makes it incredibly simple to collect payments in your IC applications.
Its multi-canister architecture Quark makes the product scalable to handle any
amount of traffic at any time of the day.

- [@departurelabs/quark-checkout](#departurelabsquark-checkout)
  - [Packages](#packages)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Publishing](#publishing)
  - [Websites](#websites)
  - [Motoko Quark (DEPRECATED)](#motoko-quark-deprecated)

## Packages

We provide the following packages:

- [@departurelabs/quark-checkout](https://www.npmjs.com/package/@departurelabs/quark-checkout):
  Quark Integration script
- [@departurelabs/quark-checkout.validate](https://www.npmjs.com/package/@departurelabs/quark-checkout.validate):
  Helper functions to validate your Quark configuration and basket in runtime.

## Installation

```sh
npm i -S @departurelabs/quark-checkout @departurelabs/quark-checkout.validate
```

## Usage

Example integration:

```js
import { initialize } from "@departurelabs/quark-checkout"
// NOTE: quark.validate can be removed when you have a valid configuration
import { validate } from "@departurelabs/quark-checkout.validate"

const { checkout } = initialize(
  validate.config({
    provider: "ii",
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
    token: "ICP",
  },
]

checkout(validate.basket(basket))
```

## Publishing

```sh
> npm run build
> git add .
> git commit -m "changes"
> cd packages/quark-checkout
> npm version <patch/minor/major>
> npm publish
> cd packages/quark-checkout.validate
> npm version <patch/minor/major>
> npm publish
```

## Websites

- [GitHub Quark source](https://github.com/DepartureLabsIC/rs_quark)
- [GitHub Quark npm package source](https://github.com/DepartureLabsIC/quark-checkout)

## Motoko Quark (DEPRECATED)

Please be warned: we do not support this project anymore. An earlier version of
Quark was written in Motoko. These are the links for the _DEPRECATED_ Motoko
version of Quark:

- [GitHub Motoko Quark](https://github.com/DepartureLabsIC/quark)
- [NPM Motoko quark.js](https://www.npmjs.com/package/@departurelabs/quark.js)
