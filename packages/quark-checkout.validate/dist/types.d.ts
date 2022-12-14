import { z } from "zod";
declare const Providers: z.ZodObject<{
    II: z.ZodLiteral<string>;
}, "strip", z.ZodTypeAny, {
    II: string;
}, {
    II: string;
}>;
export type Providers = z.infer<typeof Providers>;
/**
 * Config
 *
 * A config to initialize Quark on the integrator's website.
 */
export declare const Config: z.ZodObject<{
    provider: z.ZodEffects<z.ZodString, string, string>;
    integrator: z.ZodString;
    domain: z.ZodString;
    callback: z.ZodFunction<z.ZodTuple<[z.ZodAny], z.ZodUnknown>, z.ZodAny>;
    notify: z.ZodObject<{
        principalId: z.ZodEffects<z.ZodString, string, string>;
        methodName: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        principalId: string;
        methodName: string;
    }, {
        principalId: string;
        methodName: string;
    }>;
}, "strict", z.ZodTypeAny, {
    provider: string;
    integrator: string;
    domain: string;
    callback: (args_0: any, ...args_1: unknown[]) => any;
    notify: {
        principalId: string;
        methodName: string;
    };
}, {
    provider: string;
    integrator: string;
    domain: string;
    callback: (args_0: any, ...args_1: unknown[]) => any;
    notify: {
        principalId: string;
        methodName: string;
    };
}>;
export type Config = z.infer<typeof Config>;
declare const Tokens: z.ZodObject<{
    TEST: z.ZodLiteral<"TEST">;
}, "strip", z.ZodTypeAny, {
    TEST: "TEST";
}, {
    TEST: "TEST";
}>;
export type Tokens = z.infer<typeof Tokens>;
export declare const Basket: z.ZodArray<z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    value: z.ZodNumber;
    token: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    description: string;
    value: number;
    name: string;
    token: string;
}, {
    description: string;
    value: number;
    name: string;
    token: string;
}>, "many">;
export type Basket = z.infer<typeof Basket>;
/**
 * Checkout
 */
declare const Checkout: z.ZodFunction<z.ZodTuple<[z.ZodArray<z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    value: z.ZodNumber;
    token: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    description: string;
    value: number;
    name: string;
    token: string;
}, {
    description: string;
    value: number;
    name: string;
    token: string;
}>, "many">], z.ZodUnknown>, z.ZodBoolean>;
export type Checkout = z.infer<typeof Checkout>;
export type Closure = {
    window?: Window;
    basket?: Basket;
};
/**
 * CreateCheckout
 *
 * Used to produce a Function that can be implemented by the integrator how they see fit.
 * The user will most likely call this function when the user clicks a "Pay" button.
 */
declare const CreateCheckoutConfig: z.ZodObject<{
    provider: z.ZodEffects<z.ZodString, string, string>;
    domain: z.ZodString;
    closure: z.ZodObject<{
        window: z.ZodAny;
        basket: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            value: z.ZodNumber;
            token: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            description: string;
            value: number;
            name: string;
            token: string;
        }, {
            description: string;
            value: number;
            name: string;
            token: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        window?: any;
        basket?: {
            description: string;
            value: number;
            name: string;
            token: string;
        }[] | undefined;
    }, {
        window?: any;
        basket?: {
            description: string;
            value: number;
            name: string;
            token: string;
        }[] | undefined;
    }>;
}, "strict", z.ZodTypeAny, {
    provider: string;
    domain: string;
    closure: {
        window?: any;
        basket?: {
            description: string;
            value: number;
            name: string;
            token: string;
        }[] | undefined;
    };
}, {
    provider: string;
    domain: string;
    closure: {
        window?: any;
        basket?: {
            description: string;
            value: number;
            name: string;
            token: string;
        }[] | undefined;
    };
}>;
export type CreateCheckoutConfig = z.infer<typeof CreateCheckoutConfig>;
declare const CreateCheckout: z.ZodFunction<z.ZodTuple<[z.ZodObject<{
    provider: z.ZodEffects<z.ZodString, string, string>;
    domain: z.ZodString;
    closure: z.ZodObject<{
        window: z.ZodAny;
        basket: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            value: z.ZodNumber;
            token: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            description: string;
            value: number;
            name: string;
            token: string;
        }, {
            description: string;
            value: number;
            name: string;
            token: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        window?: any;
        basket?: {
            description: string;
            value: number;
            name: string;
            token: string;
        }[] | undefined;
    }, {
        window?: any;
        basket?: {
            description: string;
            value: number;
            name: string;
            token: string;
        }[] | undefined;
    }>;
}, "strict", z.ZodTypeAny, {
    provider: string;
    domain: string;
    closure: {
        window?: any;
        basket?: {
            description: string;
            value: number;
            name: string;
            token: string;
        }[] | undefined;
    };
}, {
    provider: string;
    domain: string;
    closure: {
        window?: any;
        basket?: {
            description: string;
            value: number;
            name: string;
            token: string;
        }[] | undefined;
    };
}>], z.ZodUnknown>, z.ZodFunction<z.ZodTuple<[z.ZodArray<z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    value: z.ZodNumber;
    token: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    description: string;
    value: number;
    name: string;
    token: string;
}, {
    description: string;
    value: number;
    name: string;
    token: string;
}>, "many">], z.ZodUnknown>, z.ZodBoolean>>;
export type CreateCheckout = z.infer<typeof CreateCheckout>;
export {};
