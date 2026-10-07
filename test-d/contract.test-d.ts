// Checks index.d.ts against the JavaScript sources. With allowJs, tsc infers the exports of
// src/helpers and src/presets (presets.js uses a JSDoc const cast to keep literal types), so
// any drift fails to compile with an error naming the offending items.
import type { CategoryItems, Config, HelperNames, Options, PresetName } from '..';
import { expectNever } from './utils';

type RuntimeHelpers = typeof import('../src/helpers');
type RuntimePresets = typeof import('../src/presets');
type Defaults = RuntimePresets['defaults'];

type RuntimeHelperNames = Extract<keyof RuntimeHelpers, `get${string}Info`>;
type RuntimeCategory = {
  [K in keyof Defaults]: Defaults[K] extends ReadonlyArray<string> ? K : never;
}[keyof Defaults];
type RuntimeItems<K extends RuntimeCategory> = Defaults[K][number];
type RuntimePresetName = Exclude<keyof RuntimePresets, 'defaults'>;

type StripSpaces<S extends string> = S extends `${infer A} ${infer B}` ? StripSpaces<`${A}${B}`> : S;
type WithoutHelper<Item> = Item extends string
  ? `get${StripSpaces<Item>}Info` extends HelperNames
    ? never
    : Item
  : never;

// helpers
expectNever<`HelperNames is missing ${Exclude<RuntimeHelperNames, HelperNames>}`>();
expectNever<`HelperNames has no helper for ${Exclude<HelperNames, RuntimeHelperNames>}`>();

// categories
expectNever<`CategoryItems is missing ${Exclude<RuntimeCategory, keyof CategoryItems>}`>();
expectNever<`CategoryItems has unknown ${Exclude<keyof CategoryItems, RuntimeCategory>}`>();
expectNever<`Config is missing ${Exclude<keyof Defaults, keyof Config>}`>();
expectNever<`Config has unknown ${Exclude<keyof Config, keyof Defaults>}`>();

// items of each category
expectNever<
  {
    [K in RuntimeCategory]: `CategoryItems['${K}'] is missing ${Exclude<
      RuntimeItems<K>,
      CategoryItems[K]
    >}`;
  }[RuntimeCategory]
>();
expectNever<
  {
    [K in RuntimeCategory]: `CategoryItems['${K}'] has unknown ${Exclude<
      CategoryItems[K],
      RuntimeItems<K>
    >}`;
  }[RuntimeCategory]
>();
expectNever<`no helper for item ${WithoutHelper<CategoryItems[keyof CategoryItems]>}`>();

// presets
expectNever<`PresetName is missing ${Exclude<RuntimePresetName, PresetName>}`>();
expectNever<`PresetName has unknown ${Exclude<PresetName, RuntimePresetName>}`>();
expectNever<
  {
    [P in RuntimePresetName]: RuntimePresets[P] extends Config & { options?: Options }
      ? never
      : `preset ${P} is not a valid Config`;
  }[RuntimePresetName]
>();
