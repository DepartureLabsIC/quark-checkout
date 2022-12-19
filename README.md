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
import { initialize, PROVIDERS, TOKENS } from "@departurelabs/quark-checkout"
// NOTE: `validate` can be removed once you have ensured
// you are using the correct configuration and basket values
import { validate } from "@departurelabs/quark-checkout.validate"

const { checkout } = initialize(
  validate.config({
    provider: PROVIDERS.II,
    domain: "https://34dvu-aqaaa-aaaah-qc6ua-cai.ic0.app",
    notify: {
      principalId: "dlftw-sqaaa-aaaaa-danil-cai",
      methodName: "canisterMethod",
    },
    integrator: "company@testnet.quark",
    callback: event => {
      if (event.data.result === "Accepted") {
        checkoutComplete()
      } else {
        checkoutFailed()
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

You can also see our
[example project tori](https://github.com/DepartureLabsIC/rs_tori) which we use
for testing and development.

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

We aim to keep the version numbers of the two packages in sync.

## Websites

- [Quark source](https://github.com/DepartureLabsIC/rs_quark)
- [Client integration packages source](https://github.com/DepartureLabsIC/quark-checkout)
- [Example project source](https://github.com/DepartureLabsIC/rs_tori)

## Motoko Quark (DEPRECATED)

Please be warned: we do not support this project anymore. An earlier version of
Quark was written in Motoko. These are the links for the _DEPRECATED_ Motoko
version of Quark:

- [GitHub Motoko Quark](https://github.com/DepartureLabsIC/quark)
- [NPM Motoko quark.js](https://www.npmjs.com/package/@departurelabs/quark.js)
