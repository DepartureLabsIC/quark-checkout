import { z } from "zod"
import { Principal as P } from "@dfinity/principal"

const validatePrincipal = (p: string) => {
  try {
    return p === P.fromText(p).toText()
  } catch (e) {
    return false
  }
}

const DESCRIPTION = {
  PROVIDER:
    "This can be either a wallet or an identity provider. The user will only be able to connect with this provider on Quark's Checkout page",
  INTEGRATOR:
    "The Quark Address of the integrator. This address will receive the payment upon a successful checkout",
  NOTIFY: {
    PRINCIPAL_ID:
      "The Principal ID of the canister that receives the callback from Quark to notify the payment result",
    METHOD:
      "The name of the canister method that is called from Quark to notify the payment result",
  },
  BAKSET: {
    NAME: "The name of the basket item.",
    DESCRIPTION: "Optional description of the basket item.",
  },
}

const PROVIDERS = {
  II: "ii",
}

const II = z.literal(PROVIDERS.II, { description: "Internet Identity" })

const printProviders = () => Object.values(PROVIDERS).join(", ")
const Provider = z.string().refine((s: string) => s === II.value, {
  message: `Invalid provider. Expected Provider as String. Choose between: ${printProviders()}`,
})

const Providers = z.object({
  II,
})
export type Providers = z.infer<typeof Providers>

const Integrator = z
  .string({
    description: DESCRIPTION.INTEGRATOR,
    invalid_type_error:
      "Invalid integrator. Expected Quark address (username@testnet.quark) as String",
    required_error: "Config.integrator is required",
  })
  .email({
    message: "Invalid value for Config.integrator",
  })

const Domain = z
  .string({
    description: "The domain of the Quark website",
    required_error: "Config.domain is required",
  })
  .url({ message: "Invalid url" })
  .regex(/(^http:\/\/localhost:\d+$)|(^(https:\/\/).*(.ic0.app)$)/i, {
    message: "Invalid domain",
  })

// .args() is `MessageEvent.data`
// See: https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/data
const Callback = z.function().args(z.any()).returns(z.any())

/**
 * Notify
 *
 * Used to produce a Candid func that is called when the checkout
 * has been confirmed on the Quark website. From there on out it is
 * up to the integrator to process all the bought items by the end-user.
 *
 * More info:
 * https://smartcontracts.org/docs/candid-guide/candid-types.html#type-func
 */

const Principal = z
  .string({
    description: DESCRIPTION.NOTIFY.PRINCIPAL_ID,
    required_error: "Config.notify.principalId is required",
  })
  .refine((p: string) => validatePrincipal(p), {
    message: "Invalid Principal ID",
  })

const MethodName = z.string({
  description: DESCRIPTION.NOTIFY.METHOD,
  required_error: "Config.notify.method is required",
})
const Notify = z
  .object({
    principalId: Principal,
    methodName: MethodName,
  })
  .required()
  .strict()

/**
 * Config
 *
 * A config to initialize Quark on the integrator's website.
 */
export const Config = z
  .object({
    provider: Provider,
    integrator: Integrator,
    domain: Domain,
    callback: Callback,
    notify: Notify,
  })
  .required()
  .strict()

export type Config = z.infer<typeof Config>

/**
 * BasketItem
 */

const Name = z
  .string({
    description: DESCRIPTION.BAKSET.NAME,
    required_error: "Basket.name is required",
  })
  .min(1, { message: "Basket.name must be at least 1 character long" })
  .max(100, { message: "Basket.name must be at most 100 characters long" })
const Description = z
  .string({
    description: DESCRIPTION.BAKSET.DESCRIPTION,
  })
  .min(1, { message: "Basket.description must be at least 1 character long" })
  .max(100, {
    message: "Basket.description must be at most 100 characters long",
  })
const Value = z
  .number({
    description: "Number of tokens to pay for this Basket item.",
    invalid_type_error: "Invalid Basket.value Type. Expected Number",
    required_error: "Basket.value is required",
  })
  .positive({ message: "Basket.value must be greater than 0" })

/**
 * Tokens
 */
const TOKENS = {
  TEST: "TEST",
}
const TEST = z.literal("TEST", {
  description: "Quark Test Token. Used for development on testnets",
})
const printTokens = () => Object.values(TOKENS).join(", ")
const Token = z.string().refine((s: string) => s === TEST.value, {
  message: `Invalid provider. Expected Provider as String. Choose between: ${printTokens()}`,
})
const Tokens = z.object({
  TEST,
})
export type Tokens = z.infer<typeof Tokens>

/**
 * Basket
 *
 * The basket is an array of items that the end-user has selected to pay for.
 * The name, description and price of each item is shown on the Quark website
 * upon Checkout.
 */

const BasketItem = z
  .object({
    name: Name,
    description: Description.optional(),
    value: Value,
    token: Token,
  })
  .required()
export const Basket = BasketItem.array()
export type Basket = z.infer<typeof Basket>

/**
 * Checkout
 */

const Checkout = z.function().args(Basket).returns(z.boolean())
export type Checkout = z.infer<typeof Checkout>

/**
 * Because the `basket` and `window` can only be assigned by the user's browser, we need to
 * use a closure to create a Checkout function with all necessary values to send to the Quark window.
 */

const Closure = z.object({
  window: z.any(),
  basket: Basket.optional(),
})
export type Closure = {
  window?: Window
  basket?: Basket
}

/**
 * CreateCheckout
 *
 * Used to produce a Function that can be implemented by the integrator how they see fit.
 * The user will most likely call this function when the user clicks a "Pay" button.
 */

const CreateCheckoutConfig = z
  .object({
    provider: Provider,
    domain: Domain,
    closure: Closure,
  })
  .required()
  .strict()
export type CreateCheckoutConfig = z.infer<typeof CreateCheckoutConfig>

const CreateCheckout = z.function().args(CreateCheckoutConfig).returns(Checkout)
export type CreateCheckout = z.infer<typeof CreateCheckout>
