/**
 * validate - Validate quark config and basket
 *
 * Please delete package when validated.
 *
 * This package helps you use correctly setup your quark integration.
 * By calling this function you can validate your Quark config and
 * basket data during runtime.
 */
import { Config, Basket } from "../../src/schemas";
declare function config(c: Config): {
    provider: string;
    integrator: string;
    domain: string;
    callback: (args_0: any, ...args_1: unknown[]) => any;
    notify: {
        principalId: string;
        methodName: string;
    };
};
declare function basket(b: Basket): {
    description: string;
    value: number;
    name: string;
    token: string;
}[];
declare const validate: {
    config: typeof config;
    basket: typeof basket;
};
export { validate };
