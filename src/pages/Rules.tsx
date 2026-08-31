import { useNavigate } from "@solidjs/router";
import { Component } from "solid-js";
import { ArrowLeft } from "lucide-solid";
import { createLocalSignal } from "../helpers";
import { lang } from "../definitions";
import { Lang, Translation } from "../types";
import { translations } from "../data";
import { createI18n } from "../packages/i18n";

interface SampleTileProperties {
    letter: string;
    variant: "good" | "misplaced" | "bad";
}

const SampleTile: Component<SampleTileProperties> = (properties) => {
    return (
        <span
            classList={{
                "w-14": true,
                "h-14": true,
                "shrink-0": true,
                "border-2": true,
                "border-slate-500": true,
                "dark:border-sky-600": true,
                "rounded-2xl": true,
                "flex": true,
                "items-center": true,
                "justify-center": true,
                "text-2xl": true,
                "text-slate-600": true,
                "dark:text-sky-100": true,
                "bg-green-200": properties.variant === "good",
                "dark:bg-green-600": properties.variant === "good",
                "bg-amber-200": properties.variant === "misplaced",
                "dark:bg-amber-600": properties.variant === "misplaced",
                "bg-slate-400": properties.variant === "bad",
                "dark:bg-sky-900": properties.variant === "bad",
            }}
        >
            {properties.letter}
        </span>
    );
};

const Rules: Component = () => {
    const navigate = useNavigate();
    const [currentLang] = createLocalSignal("en", "lang", (data: any) => {
        let savedLang = "en";
        try { savedLang = lang.parse(data); } catch { }
        return savedLang as Lang;
    });
    const [t, setLocale] = createI18n<Lang, Translation>(translations, currentLang());
    setLocale(currentLang());

    return (
        <main class="min-h-dvh bg-orange-50 dark:bg-sky-950 flex flex-col px-6 py-8 md:items-center">
            <div class="w-full md:max-w-xl">
                <button
                    type="button"
                    onClick={() => navigate("/play")}
                    aria-label="Back"
                    class="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-slate-300 dark:border-sky-700 text-slate-600 dark:text-sky-200 bg-white/70 dark:bg-sky-800 mb-6 hover:cursor-pointer"
                >
                    <ArrowLeft width="18" height="18" />
                </button>

                {/* How to play */}
                <section class="mb-8">
                    <h1 class="text-2xl md:text-3xl text-slate-700 dark:text-sky-50 tracking-wide mb-3">{t("How to play")}</h1>
                    <p class="text-slate-500 dark:text-sky-200">
                        {t("Guess the word by clicking on the keyboard at the bottom to write the letters on the grid. Each row is a try and you get 5 chances to find the word.")}
                    </p>
                </section>

                {/* Color meaning */}
                <section class="mb-8">
                    <h2 class="text-2xl md:text-3xl text-slate-700 dark:text-sky-50 tracking-wide mb-4">{t("Color meaning")}</h2>
                    <div class="flex flex-col gap-4">
                        <div class="flex items-center gap-4">
                            <SampleTile letter="B" variant="good" />
                            <p class="text-slate-500 dark:text-sky-200">{t("A letter that is well placed in the word will be shown in green.")}</p>
                        </div>

                        <div class="flex items-center gap-4">
                            <SampleTile letter="O" variant="bad" />
                            <p class="text-slate-500 dark:text-sky-200">{t("A letter that is not in the word will be grayed.")}</p>
                        </div>

                        <div class="flex items-center gap-4">
                            <SampleTile letter="A" variant="misplaced" />
                            <p class="text-slate-500 dark:text-sky-200">{t("A letter that is in the word but misplaced will be shown in orange.")}</p>
                        </div>
                    </div>
                </section>

                {/* Possible words */}
                <section>
                    <h2 class="text-2xl md:text-3xl text-slate-700 dark:text-sky-50 tracking-wide mb-3">{t("Possible words")}</h2>
                    <p class="text-slate-500 dark:text-sky-200 text-sm">
                        {t("The list of words is composed only of nouns, without duplicate letters, no verbs, no accents, no singular and no plurals.")}
                    </p>
                </section>
            </div>
        </main>
    );
};

export default Rules;
