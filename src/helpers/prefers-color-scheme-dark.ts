const prefersColorSchemeDark = (): boolean => window.matchMedia(`(prefers-color-scheme: dark)`).matches;

export default prefersColorSchemeDark;
