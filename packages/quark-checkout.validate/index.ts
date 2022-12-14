/**
 * validate - Validate quark config and basket
 *
 * Please delete package when validated.
 *
 * This package helps you use correctly setup your quark integration.
 * By calling this function you can validate your Quark config and
 * basket data during runtime.
 */
import { Config, Basket } from "../../src/schemas"

function config(c: Config) {
  return Config.parse(c)
}

function basket(b: Basket) {
  return Basket.parse(b)
}

const validate = { config, basket }
export { validate }
