/**
 * initialize - Initialize integrator script
 *
 * When called we assume the config passed is valid. To ensure
 * validity we provide the `quark.validate` script to validate
 * the config and basket before passing them to the `initialize`
 * and `checkout` functions. Upon calling `initialize` we are
 * attaching an EventListener to the window scope. The EventListener
 * will execute a handler `checkoutEventHandler` that will listen
 * to incoming messages. The `initialize` function returns a
 * `checkout` function. When called it opens Quark in a new window.
 * Once the window opens it will send a message to the EventListener
 * that is running in the scope of `initialize` and the handler.
 * When it's called with a `event.data.type` of `checkoutLoaded`,
 * the handler will transfer the basket data to the opened Quark window.
 *
 * There are two types of incoming messages on the integrator-side:
 * - `checkoutLoaded`: this message will be dispatched once the Quark
 * checkout page was opened in another tab. Upon receiving this
 * message we will send all the necessary data to the opened tab,
 * such as `basket`, `integrator`, etc. using a window.postMessage
 * MessageEvent with the type "basketUpdate".
 * - `checkoutComplete`: this is sent to our listener when the user
 * has confirmed the checkout on the Quark website. Upon receiving
 * a message with this type, we will call the `callback` Function
 * that the user passed inside the init() config and it's up to
 * the integrator to take it from there.
 *
 * Also, there is one type of outgoing message going from the
 * integrator-side to the Quark-side:
 * - `basketUpdate`: When opened in the end-user's browser, the
 * Checkout page on the Quark website will listen for this
 * particular message to update the contents of the checkout
 * and calculate the total sum of the transaction to display
 * this to the user to confirm.
 *
 * checkout(basket);
 **/

import { createCheckout } from "./checkout"
import {
  type Config,
  type Checkout,
  type Closure,
  type Basket,
  type Providers,
  type Tokens,
} from "../../src/schemas"

export { Config, Basket }
export const PROVIDERS: Providers = {
  II: "ii",
}
export const TOKENS: Tokens = {
  TEST: "TEST",
}

export function initialize(config: Config): Checkout {
  // higher order variables that get assigned upon checkout
  const closure: Closure = {
    window: undefined,
    basket: [],
  }

  window.addEventListener(
    "message",
    function checkoutEventHandler(event) {
      if (event.origin !== config.domain) return // DANGER ZONE
      if (!["checkoutLoaded", "checkoutComplete"].includes(event.data.type))
        return
      if (event.data.type === "checkoutLoaded") {
        const message = JSON.parse(
          JSON.stringify({
            type: "basketUpdate",
            origin: window.origin,
            basket: closure.basket,
            notify: config.notify,
            integrator: config.integrator,
            provider: config.provider,
          }),
        )
        closure.window?.postMessage(message, config.domain)
      } else if (event.data.type === "checkoutComplete") {
        config.callback(event.data)
      }
    },
    false,
  )
  const { provider, domain } = config
  return createCheckout({ provider, domain, closure })
}
