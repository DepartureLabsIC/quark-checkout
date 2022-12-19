# @departurelabs/quark-checkout

- [@departurelabs/quark-checkout](#departurelabsquark-checkout)
  - [Testnet](#testnet)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Configuration validation](#configuration-validation)
    - [Configuration properties](#configuration-properties)
  - [Basket structure](#basket-structure)
  - [Cross-tab communication](#cross-tab-communication)
  - [Token support](#token-support)
  - [Authentication providers](#authentication-providers)
  - [Websites](#websites)

## Testnet

Currently Quark is only available as a testnet. No real tokens are being used
except for Quark's own TEST token.

## Installation

```sh
npm i -S @departurelabs/quark-checkout
```

## Usage

Example integration:

```js
import { initialize, TOKENS, PROVIDERS } from "@departurelabs/quark-checkout"

const { checkout } = initialize(
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
)

const basket = [
  {
    name: "Spoon",
    description: "Use this for your soup",
    value: 10000000,
    token: TOKENS.TEST,
  },
]

checkout(basket)
```

You can also see our
[example project tori](https://github.com/DepartureLabsIC/rs_tori) which we use
for testing and development.

### Configuration validation

To help you integrate Quark we have another package to validate your
configuration and basket values in runtime. This package is not ment for
production, but to help you ensure you're using the correct configuration and
basket values

See:
[@departurelabs/quark-checkout.validate](https://www.npmjs.com/package/@departurelabs/quark-checkout.validate)

### Configuration properties

- `provider`: The provider used to authenticate the user. This value is used to
  redirect the user quickly to the correct authentication page when they are
  checking out but not yet authenticated. See
  [Authentication providers](#authentication-providers) for a list of the
  providers we currently support.
- `domain`: The domain quark-checkout will send a user to upon checkout. In the
  future, we expect larger services might want to self-host their own checkout
  pages.
- `notify`: An object containing the Principal ID as a string and the name of
  the canister method as a string.
- `notify.principalId`: The Principal ID of the canister that will receive the
  callback from the Quark canister. Learn more about the
  [canister implementation](https://www.notion.so/departurelabs/Backend-Hosted-Checkout-docs-draft-7f92887c65c84be9be568624909474f0)
- `notify.methodName`: We call this canister method when a user completes a
  transaction. The Canister will be required to accept or deny each incoming
  transaction. Learn more about the
  [canister implementation](https://www.notion.so/departurelabs/Backend-Hosted-Checkout-docs-draft-7f92887c65c84be9be568624909474f0)
- `integrator`: The Quark Account ID of the recipient of the payment.
  **Warning!** This principal must be able to invoke calls against Quark in
  order to withdraw funds. Please use only use a canister, a dfx principal
  identity, or a Quark user principal unless you are absolutely sure about what
  you are doing.
- `callback`: A javascript method implemented by the integrator to be invoked by
  the MessageEvent handler upon receiving an Event with type ``.

Example events:

```json
{ "type": "checkoutComplete", "data": { "result": "Accepted" } }
```

```json
{ "type": "checkoutComplete", "data": { "result": "Rejected" } }
```

"Trust, but verify!" is your best course of action when handling the callback
data.

Once you have instantiated the `checkout` Function we can begin creating a
basket with a couple of transaction items.

## Basket structure

- `basket` The basket is a list of transaction items, defined by the merchant,
  that contains the data necessary for the checkout:
  - `name` - the name of the checked out product. e.g. “Spoon”
  - `value` - the value of the checkout out product. Specified as fractional
    units of an TEST token—called e8s—as a whole number, where one e8 is the
    smallest unit of a TEST token. For example, 1.05000000 is 1 TEST and 5000000
    e8s.
  - `token` - the token used for the transaction of this basket item. Note: at
    this moment we only support TEST
  - `description` - optional description of the checked out product. e.g. “Used
    to eat soup”

## Cross-tab communication

When calling `initialize`, the configuration passed as a parameter is first
validated. When validated, we will attach an eventListener to the window scope.
The eventListener will execute a handler upon receiving an incoming message.
When this message comes from the Quark website it will execute code to ensure
communication between quark-checkout and the Quark website.

There are two types of incoming messages on the quark-checkout-side:

- `checkoutLoaded`: this message will be dispatched once the Quark checkout page
  was opened in another tab. Upon receiving this message we will send all the
  necessary data to the opened tab, such as `basket`, `integrator`, etc. using a
  [window.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
  [MessageEvent](https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent)
  with the type "basketUpdate".
- `checkoutComplete`: this is sent to our listener when the user has confirmed
  the checkout on the Quark website. Upon receiving a message with this type, we
  will call the `callback` Function that the user passed inside the init()
  config and it's up to the integrator to take it from there.

Also, there is one type of outgoing message going from the quark-checkout-side
to the Quark-side:

- `basketUpdate`: When opened in the end-user's browser, the Checkout page on
  the Quark website will listen for this particular message to update the
  contents of the checkout and calculate the total sum of the transaction to
  display this to the user to confirm.

**PLEASE NOTE**: BigInts cannot be serialized client-side and thus we do not
support them in the checkout. You will need to cast them to Numbers instead.

## Token support

We currently only support TEST-tokens on our testnet. More tokens (such as ICP
and cycles) will follow soon!

Our target token TEST requires its values be set in e8s. One e8 is the smallest
partition of an TEST token (1/10^8 or 10^-8). For example, 123.15000001 TEST is
12_315_000_001 e8s. To convert whole value TEST to e8s simply multiply the TEST
value by 1e8

```js
const tokens = 123.3341 // make sure there are more than 8 digits of precision!!
const e8s = tokens * 1e8
```

Quick tip: As you are handling other people's capital and its common to run into
floating point errors when performing basic arithmetic. To avoid this, we
recommend using libraries such as:

- [currency.js](https://currency.js.org/)
- [dinero.js](https://dinerojs.com/)
- [numeral.js](http://numeraljs.com/)

We export the `TOKENS` object to make it easier to use these values.

## Authentication providers

Currently we support the following authentication providers by passing the
following values to the `provider` property when calling `initialize`:

| Provider                                       | Value  | Status |
| ---------------------------------------------- | ------ | ------ |
| [Internet Identity](https://identity.ic0.app/) | `ii`   | ✅     |
| [NFID](https://nfid.one/)                      | `nfid` | 🏗️     |
| [Plug](https://plugwallet.ooo/)                | `plug` | 🏗️     |

We export the `PROVIDERS` object to make it easier to use these values.

## Websites

- [@departurelabs/quark-checkout](https://www.npmjs.com/package/@departurelabs/quark-checkout)
  Quark Integration Script
- [GitHub Quark source](https://github.com/DepartureLabsIC/rs_quark)
- [GitHub Quark npm package source](https://github.com/DepartureLabsIC/quark-checkout)
- [GitHub Tori QA example](https://5peht-hiaaa-aaaam-aayqq-cai.ic0.app/login)
