import { createSignal, onMount, onCleanup } from "solid-js";

const createPrefersDarkTheme = () => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const [isDark, setIsDark] = createSignal(mediaQuery.matches);

    const onChange = (event: MediaQueryListEvent) => {
        setIsDark(event.matches);
    };

    onMount(() => {
        mediaQuery.addEventListener("change", onChange);
    });

    onCleanup(() => {
        mediaQuery.removeEventListener("change", onChange);
    });

    return isDark;
};

export default createPrefersDarkTheme;
