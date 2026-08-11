import { For, Index, Match, Show, Switch, createSignal, type Component } from 'solid-js';
import { createLocalStore, createLocalSignal } from "../store";
import * as z from "zod";
import { RefreshCw, RefreshCcw, Delete, CheckCheck, Settings, X } from "lucide-solid";
import Logo from '../components/Logo';

type Lang = "en" | "es" | "fr";
type Difficulty = "easy" | "medium" | "hard";
type LetterState = "to-guess" | "guessed" | "good" | "bad" | "misplaced";
type Key = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z" | "HINT" | "DELETE" | "ENTER";

interface Letter {
    state: LetterState;
    value: string;
};

const App: Component = () => {
    const [settingsOpen, setSettingsOpen] = createSignal(false);
    const langLabels: Record<Lang, string> = { en: "English", es: "Español", fr: "Français" };
    const difficultyLabels: Record<Difficulty, string> = { easy: "Easy", medium: "Medium", hard: "Hard" };
    const difficulties: Array<Difficulty> = ["easy", "medium", "hard"];
    const letterStates: Array<LetterState> = ["to-guess", "guessed", "good", "bad", "misplaced"];
    const difficultiesDefinition = z.enum(difficulties);
    const letterStateDefinition = z.enum(letterStates);
    const letterDefinition = z.object({ state: letterStateDefinition, value: z.string() });
    const langs: Array<Lang> = ["en", "es", "fr"];
    const langsDefinition = z.enum(langs);
    const dictionnary = {
        "en": {
            "easy": [
                "APPLE",
                "BREAD",
                "CHAIR",
                "SMILE",
                "TIGER",
            ],
            "medium": [
                "PLANET",
                "GARDEN",
                "WINDOW",
                "CASTLE",
                "ANIMAL",
            ],
            "hard": [
                "MORNING",
                "PICTURE",
                "CHICKEN",
                "KITCHEN",
                "BLANKET",
            ],
        },
        "es": {
            "easy": [
                "PERRO", // dog
                "PLAYA", // beach
                "CAMPO", // field
                "REINA", // queen
                "COCHE", // car
            ],
            "medium": [
                "BOSQUE", // forest
                "CAMINO", // path
                "ZAPATO", // shoe
                "PUERTA", // door
                "CAMISA", // shirt
            ],
            "hard": [
                "VENTANA", // window
                "CABALLO", // horse
                "FAMILIA", // family
                "NARANJA", // orange
                "PLANETA", // planet
            ],
        },
        "fr": {
            "easy": [
                "ARBRE", // tree
                "LIVRE", // book
                "TABLE",
                "PLAGE", // beach
                "NEIGE", // snow
            ],
            "medium": [
                "MAISON", // house
                "CHEMIN", // path
                "BATEAU", // boat
                "ORANGE",
                "OISEAU", // bird
            ],
            "hard": [
                "VOITURE", // car
                "VILLAGE",
                "FROMAGE", // cheese
                "POISSON", // fish
                "CHEMISE", // shirt
            ],
        },
    };

    const keyboard: Record<Lang, Array<Key>> = {
        "en": [
            "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P",
            "A", "S", "D", "F", "G", "H", "J", "K", "L", "DELETE",
            "Z", "X", "C", "V", "B", "N", "M", "HINT", "ENTER"
        ],
        "es": [
            "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P",
            "A", "S", "D", "F", "G", "H", "J", "K", "L", "DELETE",
            "Z", "X", "C", "V", "B", "N", "M", "HINT", "ENTER"
        ],
        "fr": [
            "A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P",
            "Q", "S", "D", "F", "G", "H", "J", "K", "L", "M",
            "Z", "X", "C", "V", "B", "N", "HINT", "DELETE", "ENTER",
        ],
    };

    // Utilities
    const createEmptyLetters = (count: number): Array<Letter> => Array.from({ length: count }, () => ({
        state: "to-guess",
        value: "",
    }));

    const numberBetween = (min: number, max: number): number => {
        return Math.random() * (max - min) + min;
    };

    const randomWord = (lang: Lang, difficulty: Difficulty): string => {
        const words = dictionnary[lang][difficulty];
        const randomIndex = Math.floor(numberBetween(0, (words.length - 1)));

        return words[randomIndex];
    };

    const getNumberOfLetters = (): number => currentDifficulty() === "easy" ? 5 : (currentDifficulty() === "medium" ? 6 : 7);

    const getNumberOfGuessedLetters = (): number => lettersToGuess[currentLang()][currentDifficulty()].filter((letter) => letter.state === "guessed").length;

    const wordIsCompleted = (): boolean => {
        const numberOfLetters: number = getNumberOfLetters();
        const numberOfGuessedLetters: number = getNumberOfGuessedLetters();

        return numberOfGuessedLetters > 0 && numberOfGuessedLetters % numberOfLetters === 0;
    };

    // Stores/signals
    const [lettersToGuess, setlettersToGuess] = createLocalStore<Record<Lang, Record<Difficulty, Array<Letter>>>>(
        {
            "en": {
                "easy": createEmptyLetters(5 * 5),
                "medium": createEmptyLetters(6 * 5),
                "hard": createEmptyLetters(7 * 5),
            },
            "fr": {
                "easy": createEmptyLetters(5 * 5),
                "medium": createEmptyLetters(6 * 5),
                "hard": createEmptyLetters(7 * 5),
            },
            "es": {
                "easy": createEmptyLetters(5 * 5),
                "medium": createEmptyLetters(6 * 5),
                "hard": createEmptyLetters(7 * 5),
            },
        },
        "lettersToGuess",
        (data: any): Record<Lang, Record<Difficulty, Array<Letter>>> => z.record(
            langsDefinition,
            z.record(
                difficultiesDefinition,
                z.array(letterDefinition)
            )
        ).parse(data)
    );

    const [currentDifficulty, setCurrentDifficulty] = createLocalSignal("easy", "difficulty", (data: any): Difficulty => difficultiesDefinition.parse(data));
    const [currentLang, setCurrentLang] = createLocalSignal("en", "lang", (data: any) => langsDefinition.parse(data));
    const [guessedWords, setGuessedWords] = createLocalSignal<Array<string>>([], "guessedWords", (data) => z.array(z.string()).parse(data));
    const [currentWordToGuess, setCurrentWordToGuess] = createLocalStore(
        {
            "fr": {
                "easy": randomWord("fr", "easy"),
                "medium": randomWord("fr", "medium"),
                "hard": randomWord("fr", "hard"),
            },
            "en": {
                "easy": randomWord("en", "easy"),
                "medium": randomWord("en", "medium"),
                "hard": randomWord("en", "hard"),
            },
            "es": {
                "easy": randomWord("es", "easy"),
                "medium": randomWord("es", "medium"),
                "hard": randomWord("es", "hard"),
            }
        },
        "wordToGuess",
        (data: any): Record<Lang, Record<Difficulty, string>> => z.record(
            langsDefinition,
            z.record(
                difficultiesDefinition,
                z.string()
            )
        ).parse(data)
    );

    // Event listeners
    const saveDifficulty = (difficulty: string): void => {
        if (!difficulties.includes(difficulty as Difficulty)) {
            return;
        }

        localStorage.setItem("difficulty", difficulty);
        setCurrentDifficulty(difficulty as Difficulty);
    };

    const saveLang = (lang: string): void => {
        if (!langs.includes(lang as Lang)) {
            return;
        }

        localStorage.setItem("lang", lang);
        setCurrentLang(lang as Lang);
    };

    const onKeyboardClick = (key: string): void => {
        const difficulty: Difficulty = currentDifficulty();
        const lang: Lang = currentLang();
        const numberOfLetters: number = getNumberOfLetters();

        let lettersToGuessForCurrentDifficulty: Array<Letter> = lettersToGuess[lang][difficulty];

        if (key === "ENTER") {
            if (!canValidate()) {
                return;
            }

            const indicesOfAllGuessedLetters = lettersToGuessForCurrentDifficulty
                .map((letter, index) => letter.state === "guessed" ? index : null)
                .filter((number) => number !== null);

            for (const indexOfGuessedLetter of indicesOfAllGuessedLetters) {
                const indexInWordToGuess: number = indexOfGuessedLetter % numberOfLetters;
                const guessedLetter: Letter = lettersToGuessForCurrentDifficulty[indexOfGuessedLetter];
                const letterInWordToGuess: string = wordToGuess()[indexInWordToGuess];
                let state: LetterState = "bad";

                if (letterInWordToGuess === guessedLetter.value) {
                    state = "good";
                } else {
                    if (wordToGuess().includes(guessedLetter.value)) {
                        state = "misplaced";
                    } else {
                        state = "bad";
                    }
                }

                setlettersToGuess(lang, difficulty, indexOfGuessedLetter, {
                    ...guessedLetter,
                    state: state,
                });

                if (gameWon()) {
                    setGuessedWords([...guessedWords(), wordToGuess()]);
                }
            }

            return;
        }

        if (key === "DELETE") {
            if (!canDelete()) {
                return;
            }

            const indexOfLastGuessedLetter = lettersToGuessForCurrentDifficulty.findLastIndex((letter) => letter.state === "guessed");

            const clearedLetter = lettersToGuessForCurrentDifficulty[indexOfLastGuessedLetter] = {
                state: "to-guess",
                value: "",
            };

            setlettersToGuess(lang, difficulty, indexOfLastGuessedLetter, clearedLetter);

            return;
        }

        if (key === "HINT") {
            if (!canHint()) {
                return;
            }

            const indexOfNextLetterToGuess: number = lettersToGuessForCurrentDifficulty.findIndex((letter) => letter.state === "to-guess");
            const indexInWordToGuess: number = indexOfNextLetterToGuess % numberOfLetters;

            setlettersToGuess(lang, difficulty, indexOfNextLetterToGuess, {
                state: "guessed",
                value: wordToGuess()[indexInWordToGuess],
            });

            return;
        }

        if (wordIsCompleted()) {
            alert("Click enter to validate the word");

            return;
        }

        const indexOfNextLetterToGuess: number = lettersToGuessForCurrentDifficulty.findIndex((letter) => letter.state === "to-guess");
        let nextLetterToGuess: Letter = lettersToGuessForCurrentDifficulty[indexOfNextLetterToGuess];

        nextLetterToGuess = {
            state: "guessed",
            value: key
        };

        setlettersToGuess(lang, difficulty, indexOfNextLetterToGuess, nextLetterToGuess);
    };

    const onClickReplay = (): void => {
        const lang: Lang = currentLang();
        const difficulty: Difficulty = currentDifficulty();
        const letters: Array<Letter> = lettersToGuess[lang][difficulty];
        let letterIndex = 0;

        for (const _ of letters) {
            setlettersToGuess(lang, difficulty, letterIndex, {
                value: "",
                state: "to-guess",
            });

            letterIndex += 1;
        }

        setCurrentWordToGuess(lang, difficulty, randomWord(lang, difficulty));
    };

    const onClickChange = (): void => {
        const lang: Lang = currentLang();
        const difficulty: Difficulty = currentDifficulty();
        const wordToGuess: string = currentWordToGuess[lang][difficulty];

        setCurrentWordToGuess(lang, difficulty, randomWord(lang, difficulty));

        alert(`The word was ${wordToGuess}`);
    };

    // Derived
    const wordGuessed = (): boolean => {
        const lang = currentLang();
        const difficulty = currentDifficulty();
        const wordToGuess = currentWordToGuess[lang][difficulty];

        return lettersToGuess[lang][difficulty]
            .filter((letter: Letter): boolean => letter.state === "good")
            .slice(-wordToGuess.length)
            .map((letter: Letter): string => letter.value)
            .join('') === wordToGuess;
    };

    const allLettersChecked = (): boolean => lettersToGuess[currentLang()][currentDifficulty()]
        .filter((letter: Letter): boolean => ["to-guess", "guessed"].includes(letter.state))
        .length === 0;

    const gameLost = (): boolean => {
        return allLettersChecked() && !wordGuessed();
    };

    const gameWon = (): boolean => {
        return wordGuessed();
    };

    const gameFinished = (): boolean => allLettersChecked() || wordGuessed();

    const bannedLetters = (): Array<string> => lettersToGuess[currentLang()][currentDifficulty()]
        .filter((letter: Letter): boolean => letter.state === "bad")
        .map((letter: Letter): string => letter.value);

    const wordToGuess = (): string => currentWordToGuess[currentLang()][currentDifficulty()];

    const canDelete = (): boolean => lettersToGuess[currentLang()][currentDifficulty()]
        .filter((letter: Letter): boolean => letter.state === "guessed").length > 0;

    const canValidate = (): boolean => lettersToGuess[currentLang()][currentDifficulty()]
        .filter((letter: Letter): boolean => letter.state === "guessed").length === wordToGuess().length;

    const canHint = (): boolean => lettersToGuess[currentLang()][currentDifficulty()]
        .filter((letter: Letter): boolean => letter.state === "guessed").length < wordToGuess().length;

    return (
        <div class="h-dvh flex flex-col bg-orange-50">
            {/* Header */}
            <div class="shrink px-3 py-6 flex items-center gap-2">
                {/* Spacer to keep the logo optically centered against the cog */}
                <div class="w-9 shrink-0" aria-hidden="true"></div>
                <div class="grow flex justify-center">
                    <Logo width={180} height={56} />
                </div>
                <button
                    type="button"
                    onClick={() => setSettingsOpen(true)}
                    aria-label="Open settings"
                    class="w-9 h-9 shrink-0 flex items-center justify-center rounded-xl border-2 border-slate-300 text-slate-600 bg-white/70"
                >
                    <Settings width="18" height="18" />
                </button>
            </div>
            {/* Grid */}
            <div class="grow flex items-center">
                {/* <div> */}
                <div classList={{
                    "grid": true,
                    "grid-rows-5": true,
                    "gap-2": true,
                    "p-2": true,
                    "grow": true,
                    "grid-cols-5": currentDifficulty() === "easy",
                    "grid-cols-6": currentDifficulty() === "medium",
                    "grid-cols-7": currentDifficulty() === "hard"
                }}>
                    <For each={lettersToGuess[currentLang()][currentDifficulty()]}>
                        {(guessedLetter) => <span classList={{
                            "aspect-square": true,
                            "border": true,
                            "rounded-xl": true,
                            "flex": true,
                            "items-center": true,
                            "justify-center": true,
                            "text-3xl": true,
                            "text-gray-600": true,
                            "border-gray-500": true,
                            "border-2": true,
                            "bg-slate-50": ["to-guess", "guessed"].includes(guessedLetter.state),
                            "bg-amber-200": guessedLetter.state === "misplaced",
                            "bg-slate-400": guessedLetter.state === "bad",
                            "bg-green-200": guessedLetter.state === "good",
                        }}>{guessedLetter.value}</span>}
                    </For>
                </div>
            </div>
            {/* Replay/Abort */}
            <div class="flex justify-center">
                <Switch>
                    <Match when={gameFinished()}>
                        <button onClick={onClickReplay} class="px-6 py-1 uppercase border rounded-xl border-slate-500 text-slate-700 bg-slate-100 tracking-wider flex items-center gap-2 border border-2">
                            <span>Replay</span>
                            <RefreshCcw width="16" height="16" />
                        </button>
                    </Match>
                    <Match when={!gameFinished()}>
                        <button onClick={onClickChange} class="px-6 py-1 uppercase border rounded-xl border-slate-500 text-slate-700 bg-slate-100 tracking-wider flex items-center gap-2 border border-2">
                            <span>Change {gameFinished()}</span>
                            <RefreshCw width="16" height="16" />
                        </button>
                    </Match>
                </Switch>
            </div>
            {/* Keyboard/Win-loose text */}
            <Switch>
                <Match when={!gameFinished()}>
                    <div class="shrink grid grid-rows-3 grid-cols-10 gap-2 px-2 py-8">
                        <Index each={keyboard[currentLang()]}>
                            {(key) => <button onclick={() => onKeyboardClick(key())} classList={{
                                "flex": true,
                                "align-center": true,
                                "justify-center": true,
                                "items-center": true,
                                "border": true,
                                "rounded-lg": true,
                                "border-2": true,
                                "border-slate-500": (!["DELETE", "ENTER", "HINT"].includes(key())) || (key() === "DELETE" && canDelete()) || (key() === "HINT" && canHint()) || (key() === "ENTER" && canValidate()),
                                "bg-slate-50": !bannedLetters().includes(key()),
                                "bg-slate-400": bannedLetters().includes(key()),
                                "text-slate-600": !["DELETE", "ENTER", "HINT"].includes(key()) || (key() === "DELETE" && canDelete()) || (key() === "ENTER" && canValidate()) || (key() === "HINT" && canHint()),
                                "text-slate-300": (key() === "DELETE" && !canDelete()) || (key() === "ENTER" && !canValidate()) || (key() === "HINT" && !canHint()),
                                "text-lg": true,
                                "aspect-square": key() !== "HINT",
                                "col-span-2": key() === "HINT"
                            }}>
                                <Switch fallback={key()}>
                                    <Match when={key() === "HINT"}>hint</Match>
                                    <Match when={key() === "DELETE"}><Delete width="18" height="18" /></Match>
                                    <Match when={key() === "ENTER"}><CheckCheck width="18" height="18" /></Match>
                                </Switch>
                            </button>}
                        </Index>
                    </div>
                </Match>
                <Match when={gameLost()}>
                    <div class="grow flex items-center justify-center gap-2 text-xl">
                        <span class="tracking-wide">Word was:</span>
                        <span class="tracking-widest">{wordToGuess()}</span>
                    </div>
                </Match>
                <Match when={gameWon()}>
                    <div class="grow flex items-center justify-center gap-2 text-xl">
                        <span class="tracking-wide">You won!</span>
                    </div>
                </Match>
            </Switch>

            {/* Settings sheet */}
            <Show when={settingsOpen()}>
                <div class="fixed inset-0 z-50 flex flex-col justify-end" role="dialog" aria-modal="true" aria-label="Settings">
                    <div class="sheet-backdrop absolute inset-0 bg-slate-900/40" onClick={() => setSettingsOpen(false)}></div>
                    <div class="sheet-panel relative bg-orange-50 rounded-t-3xl border-t-2 border-slate-200 px-5 pt-3 pb-8 shadow-2xl">
                        <div class="mx-auto mb-4 h-1.5 w-10 rounded-full bg-slate-300"></div>
                        <div class="flex items-center mb-6">
                            <h2 class="grow text-lg text-slate-700 tracking-wide">Settings</h2>
                            <button
                                type="button"
                                onClick={() => setSettingsOpen(false)}
                                aria-label="Close settings"
                                class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 border-2 border-slate-200"
                            >
                                <X width="18" height="18" />
                            </button>
                        </div>

                        {/* Language */}
                        <div class="mb-6">
                            <div class="mb-2 text-xs uppercase tracking-widest text-slate-400">Language</div>
                            <div class="grid grid-cols-3 gap-2">
                                <For each={langs}>
                                    {(lang) => <button
                                        type="button"
                                        onClick={() => saveLang(lang)}
                                        classList={{
                                            "px-2": true,
                                            "py-2": true,
                                            "rounded-xl": true,
                                            "border-2": true,
                                            "text-sm": true,
                                            "tracking-wide": true,
                                            "border-green-800 bg-green-600 text-green-50": currentLang() === lang,
                                            "border-slate-300 bg-white/70 text-slate-600": currentLang() !== lang,
                                        }}
                                    >{langLabels[lang]}</button>}
                                </For>
                            </div>
                        </div>

                        {/* Difficulty */}
                        <div>
                            <div class="mb-2 text-xs uppercase tracking-widest text-slate-400">Difficulty</div>
                            <div class="grid grid-cols-3 gap-2">
                                <For each={difficulties}>
                                    {(difficulty) => <button
                                        type="button"
                                        onClick={() => saveDifficulty(difficulty)}
                                        classList={{
                                            "px-2": true,
                                            "py-2": true,
                                            "rounded-xl": true,
                                            "border-2": true,
                                            "text-sm": true,
                                            "tracking-wide": true,
                                            "border-green-800 bg-green-600 text-green-50": currentDifficulty() === difficulty,
                                            "border-slate-300 bg-white/70 text-slate-600": currentDifficulty() !== difficulty,
                                        }}
                                    >{difficultyLabels[difficulty]}</button>}
                                </For>
                            </div>
                        </div>
                        {/* Future controls (theme, history, ...) can be added here as new sections */}
                    </div>
                </div>
            </Show>
        </div >
    );
};

export default App;
