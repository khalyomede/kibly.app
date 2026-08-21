import { RefreshCw } from "lucide-solid";
import type { Component } from "solid-js";
import exhautsedKibly from "../images/exhausted-kibly.png";

const PlayError: Component = () => {
    const onReset = (): void => {
        localStorage.removeItem("lettersToGuess");
        localStorage.removeItem("difficulty");
        localStorage.removeItem("lang");
        localStorage.removeItem("wordToGuess");
        localStorage.removeItem("guessedWords");

        window.location.reload();
    };

    return (
        <main class="min-h-dvh bg-orange-50 dark:bg-sky-950 flex items-center justify-center px-6 py-12">
            <div class="w-full max-w-md flex flex-col items-center text-center">

                {/* Cute defeated axolotl */}
                <div
                    class="w-56 h-44 md:w-64 md:h-52 mb-6"
                    aria-hidden="true"
                >
                    <img src={exhautsedKibly} alt="Exhausted Kibly" />
                </div>

                <h1 class="text-3xl md:text-4xl font-semibold text-slate-700 dark:text-sky-100 tracking-wide">
                    Oops!
                </h1>

                <p class="mt-3 text-xl md:text-2xl text-slate-600 dark:text-sky-800 tracking-wide">
                    Failed to load your game
                </p>

                <p class="mt-2 max-w-xs text-sm md:text-base text-slate-400 dark:text-sky-200">
                    Something went a little wobbly. Let's try starting the game again.
                </p>

                <button
                    type="button"
                    onClick={onReset}
                    class="
                        mt-8
                        px-7 py-3
                        rounded-2xl
                        border-2 border-green-800
                        dark:border-sky-700
                        bg-green-600
                        dark:bg-sky-800
                        text-green-50
                        dark:text-sky-200
                        text-base md:text-lg
                        tracking-wide
                        shadow-sm
                        flex items-center justify-center gap-2
                        hover:bg-green-700
                        active:scale-[0.98]
                        transition
                        cursor-pointer
                    "
                >
                    <RefreshCw width="19" height="19" />
                    <span>Reset the game</span>
                </button>
            </div>
        </main>
    );
};

export default PlayError;
