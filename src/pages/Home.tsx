import { A, useNavigate } from "@solidjs/router";
import { Component } from "solid-js";
import Logo from "../components/Logo";
import { createLocalSignal, vibrate } from "../helpers";
import { lang } from "../definitions";
import { Lang, Translation } from "../types";
import { translations } from "../data";
import { createI18n } from "../packages/i18n";
import * as z from "zod";

const Home: Component = () => {
    const [clickedPlay, setClickedPlay] = createLocalSignal(false, "clickedPlay", (data: any): boolean => z.boolean().parse(data));
    const navigate = useNavigate();
    const browserLanguage: string = new Intl.Locale(navigator.language).language;
    const [currentLang, setCurrentLang] = createLocalSignal("en", "lang", (data: any) => lang.parse(data));
    const [t, setLocale] = createI18n<Lang, Translation>(translations, "en");

    // Helpers
    const triggerVibration = (): void => {
        if (!vibrationEnabled())
            return;

        vibrate();
    };

    // Stores/signals
    const [vibrationEnabled] = createLocalSignal(true, "vibrationEnabled", (data: any): boolean => z.boolean().parse(data));

    // Events listeners
    const onPlayClick = (): void => {
        const path: string = "/play";
        const supportsViewTransitions: boolean = typeof document.startViewTransition === "function";

        triggerVibration();
        setClickedPlay(true);

        if (!supportsViewTransitions) {
            navigate(path);

            return;
        }

        document.startViewTransition(() => navigate(path));
    };

    // Main
    setLocale(currentLang());

    if (clickedPlay()) {
        navigate("/play", { replace: true });
    } else {
        let browserLang: Lang | null = null;

        try {
            browserLang = lang.parse(browserLanguage);
        } catch { }

        if (browserLang !== null) {
            setCurrentLang(browserLang);
            setLocale(browserLang);
        }
    }

    return <div class="min-h-screen bg-orange-50 dark:bg-sky-950 flex items-center justify-center flex-col gap-4 md:gap-8">
        <Logo class="w-70 lg:w-80 h-auto" />
        <div class="text-slate-400 md:text-3xl lg:text-2xl">{t("A cosy word guessing game")}</div>
        <button onclick={() => onPlayClick()} class="bg-green-600 dark:bg-sky-800 text-green-50 dark:text-sky-200 border border-2 border-green-800 dark:border-sky-700 text-lg md:text-3xl lg:text-xl rounded-xl lg:rounded-3xl px-10 py-1 md:px-12 md:py-3 lg:py-2 hover:cursor-pointer">{t("Play now")}</button>
    </div>
};

export default Home;
