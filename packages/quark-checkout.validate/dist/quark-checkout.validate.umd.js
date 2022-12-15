(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('zod'), require('@dfinity/principal')) :
    typeof define === 'function' && define.amd ? define(['exports', 'zod', '@dfinity/principal'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global["quark-checkout"] = global["quark-checkout"] || {}, global["quark-checkout"].validate = {}), global.zod, global["@dfinity/principal"]));
})(this, (function (exports, zod, principal) { 'use strict';

    const validatePrincipal = (p) => {
        try {
            return p === principal.Principal.fromText(p).toText();
        }
        catch (e) {
            return false;
        }
    };
    const DESCRIPTION = {
        PROVIDER: "This can be either a wallet or an identity provider. The user will only be able to connect with this provider on Quark's Checkout page",
        INTEGRATOR: "The Quark Address of the integrator. This address will receive the payment upon a successful checkout",
        NOTIFY: {
            PRINCIPAL_ID: "The Principal ID of the canister that receives the callback from Quark to notify the payment result",
            METHOD: "The name of the canister method that is called from Quark to notify the payment result",
        },
        BAKSET: {
            NAME: "The name of the basket item.",
            DESCRIPTION: "Optional description of the basket item.",
        },
    };
    const II = zod.z.literal("ii", { description: "Internet Identity" });
    const PROVIDERS = { II: II.value };
    const printProviders = () => Object.values(PROVIDERS).join(", ");
    const Provider = zod.z.string().refine(s => s === II.value, {
        message: `Invalid provider. Expected Provider as String. Choose between: ${printProviders()}`,
    });
    const Integrator = zod.z
        .string({
        description: DESCRIPTION.INTEGRATOR,
        invalid_type_error: "Invalid integrator. Expected Quark address (username@testnet.quark) as String",
        required_error: "Config.integrator is required",
    })
        .email({
        message: "Invalid value for Config.integrator",
    });
    const Domain = zod.z
        .string({
        description: "The domain of the Quark website",
        required_error: "Config.domain is required",
    })
        .url({ message: "Invalid url" })
        .regex(/(^http:\/\/localhost:\d+$)|(^(https:\/\/).*(.ic0.app)$)/i, {
        message: "Invalid domain",
    });
    // .args() is `MessageEvent.data`
    // See: https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/data
    const Callback = zod.z.function().args(zod.z.any()).returns(zod.z.any());
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
    const Principal = zod.z
        .string({
        description: DESCRIPTION.NOTIFY.PRINCIPAL_ID,
        required_error: "Config.notify.principalId is required",
    })
        .refine(p => validatePrincipal(p), {
        message: "Invalid Principal ID",
    });
    const MethodName = zod.z.string({
        description: DESCRIPTION.NOTIFY.METHOD,
        required_error: "Config.notify.method is required",
    });
    const Notify = zod.z
        .object({
        principalId: Principal,
        methodName: MethodName,
    })
        .required()
        .strict();
    /**
     * Config
     *
     * A config to initialize Quark on the integrator's website.
     */
    const Config = zod.z
        .object({
        provider: Provider,
        integrator: Integrator,
        domain: Domain,
        callback: Callback,
        notify: Notify,
    })
        .required()
        .strict();
    /**
     * Tokens
     */
    const TEST = zod.z.literal("TEST", {
        description: "Quark Test Token. Used for development on testnets",
    });
    const TOKENS = { II: II.value };
    /**
     * BasketItem
     */
    const Name = zod.z
        .string({
        description: DESCRIPTION.BAKSET.NAME,
        required_error: "Basket.name is required",
    })
        .min(1, { message: "Basket.name must be at least 1 character long" })
        .max(100, { message: "Basket.name must be at most 100 characters long" });
    const Description = zod.z
        .string({
        description: DESCRIPTION.BAKSET.DESCRIPTION,
    })
        .min(1, { message: "Basket.description must be at least 1 character long" })
        .max(100, {
        message: "Basket.description must be at most 100 characters long",
    });
    const Value = zod.z
        .number({
        description: "Number of tokens to pay for this Basket item.",
        invalid_type_error: "Invalid Basket.value Type. Expected Number",
        required_error: "Basket.value is required",
    })
        .positive({ message: "Basket.value must be greater than 0" });
    const printTokens = () => Object.values(TOKENS).join(", ");
    const Token = zod.z.string().refine(s => s === TEST.value, {
        message: `Invalid provider. Expected Provider as String. Choose between: ${printTokens()}`,
    });
    /**
     * Basket
     *
     * The basket is an array of items that the end-user has selected to pay for.
     * The name, description and price of each item is shown on the Quark website
     * upon Checkout.
     */
    const BasketItem = zod.z
        .object({
        name: Name,
        description: Description.optional(),
        value: Value,
        token: Token,
    })
        .required();
    const Basket = BasketItem.array();
    /**
     * Checkout
     */
    const Checkout = zod.z.function().args(Basket).returns(zod.z.boolean());
    /**
     * Because the `basket` and `window` can only be assigned by the user's browser, we need to
     * use a closure to create a Checkout function with all necessary values to send to the Quark window.
     */
    const Closure = zod.z.object({
        window: zod.z.any(),
        basket: Basket.optional(),
    });
    /**
     * CreateCheckout
     *
     * Used to produce a Function that can be implemented by the integrator how they see fit.
     * The user will most likely call this function when the user clicks a "Pay" button.
     */
    const CreateCheckoutConfig = zod.z
        .object({
        provider: Provider,
        domain: Domain,
        closure: Closure,
    })
        .required()
        .strict();
    zod.z.function().args(CreateCheckoutConfig).returns(Checkout);

    /**
     * validate - Validate quark config and basket
     *
     * Please delete package when validated.
     *
     * This package helps you use correctly setup your quark integration.
     * By calling this function you can validate your Quark config and
     * basket data during runtime.
     */
    function config(c) {
        return Config.parse(c);
    }
    function basket(b) {
        return Basket.parse(b);
    }
    const validate = { config, basket };

    exports.validate = validate;

}));
//# sourceMappingURL=quark-checkout.validate.umd.js.map
