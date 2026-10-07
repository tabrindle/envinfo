export type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

/** Fails to compile unless T is true. */
export type Expect<T extends true> = T;

/** Fails to compile unless T is never; the error message lists the members of T. */
export declare function expectNever<T extends never>(): void;
