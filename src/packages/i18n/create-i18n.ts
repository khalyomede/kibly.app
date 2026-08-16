import { createMemo, createSignal } from "solid-js";

type AnyTranslationFunction = (...translationArguments: never[]) => string;
type ValidTranslationSchema<T> = {
    [TKey in keyof T]: T[TKey] extends AnyTranslationFunction ? T[TKey] : never;
};

const createI18n = <TLocale extends string, TTranslationSchema>(
    translations: Record<TLocale, TTranslationSchema & ValidTranslationSchema<TTranslationSchema>>,
    initialLocale: NoInfer<TLocale>,
): [
        <TTranslationKey extends keyof TTranslationSchema>(
            translationKey: TTranslationKey,
            ...translationArguments: TTranslationSchema[TTranslationKey] extends (...args: infer TArgs) => string ? TArgs : never
        ) => TTranslationSchema[TTranslationKey] extends (...args: never[]) => infer TReturn ? TReturn : never,
        (locale: TLocale) => void,
    ] => {
    const [locale, setLocale] = createSignal<TLocale>(initialLocale);
    const currentDictionary = createMemo(() => translations[locale()]);

    function t<TTranslationKey extends keyof TTranslationSchema>(
        translationKey: TTranslationKey,
        ...translationArguments: TTranslationSchema[TTranslationKey] extends (...args: infer TArgs) => string ? TArgs : never
    ) {
        const translationFunction = currentDictionary()[translationKey] as unknown as AnyTranslationFunction;

        return translationFunction(...(translationArguments as unknown as never[]));
    }

    return [t as never, setLocale];
};

export default createI18n;
