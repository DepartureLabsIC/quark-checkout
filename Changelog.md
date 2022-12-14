# Changelog

- 0.0.1 initial release (forked from Motoko Quark's quark.js)
  - Introduced zod schemas
  - Introduced TypeScript
  - Split up initialization and checkout into multiple files
  - Changed package publishing. We split up the package into two separate ones,
    dropped the .js suffix from the package name and published them unminified.
    - `@departurelabs/quark-checkout`
    - `@departurelabs/quark-checkout.validate`
