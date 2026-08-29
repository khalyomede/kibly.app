import { For, Index, Match, Show, Switch, createSignal, onMount, type Component } from 'solid-js';
import { createLocalStore, createLocalSignal, numberBetween, createEmptyLetters, createPrefersDarkTheme, prefersReducedMotion, vibrate } from "../helpers";
import { RefreshCw, RefreshCcw, Delete, CheckCheck, Settings, X } from "lucide-solid";
import { Logo, ToggleSwitch } from '../components';
import { kiblyBackground, kiblyBackgroundDark } from "../images";
import { Difficulty, Key, Lang, LetterState, Translation } from "../types";
import { Letter } from "../interfaces";
import { difficulties, keyboard, langs, translations, words } from "../data";
import { difficulty, lang, letter } from "../definitions";
import { createI18n } from "../packages/i18n";
import { success as successSound } from "../sounds";
import { Driver, driver, DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import * as z from "zod";

const App: Component = () => {
    // Refs
    let grid!: HTMLDivElement;
    let keyboardElement!: HTMLElement;
    let settingsElement!: HTMLButtonElement;

    // Others
    const langLabels: Record<Lang, string> = { en: "English", es: "Español", fr: "Français" };
    const successAudio = new Audio(successSound);
    const prefersDarkTheme = createPrefersDarkTheme();
    let driverObj: Driver | null = null;

    onMount(() => {
        startTutorialIfNotCompleted();
    });

    successAudio.preload = "auto";
    successAudio.load();

    // Helpers
    const randomWord = (lang: Lang, difficulty: Difficulty): string => {
        const alreadyGuessedWords = guessedWords[lang][difficulty];
        const selectedWords = words[lang][difficulty].filter((word: string): boolean => !alreadyGuessedWords.includes(word));

        if (selectedWords.length === 0) {
            setGuessedWords(lang, difficulty, []);

            return randomWord(lang, difficulty);
        }

        const randomIndex = Math.floor(numberBetween(0, (selectedWords.length - 1)));
        const nextRandomWord = selectedWords[randomIndex];

        console.log(`word to guess in lang ${lang} and difficulty ${difficulty} will be ${nextRandomWord}`);

        return nextRandomWord;
    };

    const revealLetterAtIndex = (indexOfGuessedLetter: number, numberOfLetters: number): void => {
        const difficulty: Difficulty = currentDifficulty();
        const lang: Lang = currentLang();
        const lettersToGuessForCurrentDifficulty: Array<Letter> = lettersToGuess[lang][difficulty];
        const guessedLetter: Letter = lettersToGuessForCurrentDifficulty[indexOfGuessedLetter];
        const indexInWordToGuess: number = indexOfGuessedLetter % numberOfLetters;
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
    };

    const triggerVibration = (): void => {
        if (!vibrationEnabled())
            return;

        vibrate();
    };

    let audioContext: AudioContext | undefined;

    const playBubble = (): void => {
        if (!soundEnabled()) {
            return;
        }

        if (!audioContext) {
            audioContext = new AudioContext();
        }

        if (audioContext.state === "suspended") {
            void audioContext.resume();
        }

        const now = audioContext.currentTime;

        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();

        oscillator.type = "sine";
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(3200, now);
        filter.Q.setValueAtTime(0.7, now);

        // Quick upward "blip" then a soft downward tail — gives it a rounder, bubblier pop
        oscillator.frequency.setValueAtTime(650, now);
        oscillator.frequency.exponentialRampToValueAtTime(1500, now + 0.035);
        oscillator.frequency.exponentialRampToValueAtTime(950, now + 0.09);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.28, now + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);

        oscillator.connect(filter);
        filter.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start(now);
        oscillator.stop(now + 0.11);
    };

    const createTryItStep = (key: Key): DriveStep => ({
        element: `#keyboard-${key}`,
        popover: {
            title: t("Try to find the word"),
            description: t("Click on the letter {key}.", key),
            disableButtons: [
                "next",
                "previous",
                "close",
            ],
        },
        onHighlightStarted: () => {
            setExpectedTutorialKey(key);
        },
    });

    const moveToNextTutorialStepIfExpectedKeyIsClicked = (key: Key): void => {
        if (expectedTutorialKey() !== null && key === expectedTutorialKey()) {
            setExpectedTutorialKey(null);
            driverObj?.moveNext();
        }
    };

    const createTutorialSteps = (lang: Lang, word: string): Array<DriveStep> => {
        const letters: Array<Key> = word.split('').map((letter: string): Key => letter as Key);
        const difficulty: Difficulty = "easy";

        return [
            { popover: { title: t("Welcome 👋"), description: t("This quick guide will show you how to play.") } },
            { element: grid, popover: { title: t("Grid"), description: t("The grid displays the letters you typed.") } },
            { element: keyboardElement, disableActiveInteraction: true, popover: { title: t("Keyboard"), description: t("The keyboard allows you to guess the word by guessing it letter by letter.") } },
            createTryItStep(letters[0]),
            createTryItStep(letters[1]),
            createTryItStep(letters[2]),
            createTryItStep(letters[3]),
            createTryItStep(letters[4]),
            {
                element: '#keyboard-ENTER',
                onHighlightStarted: () => {
                    setExpectedTutorialKey("ENTER");
                },
                popover: {
                    disableButtons: ["next", "close", "previous"],
                    title: t("Validate"),
                    description: t("See if you guessed the correct word."),
                    onNextClick: () => {
                        // Force the first row to be the word, in case the user finds a way out.
                        let letterIndex = 0;

                        for (const letter of letters) {
                            setlettersToGuess(lang, difficulty, letterIndex, {
                                state: "guessed",
                                value: letter
                            });
                        }

                        onKeyboardClick("ENTER");

                        driverObj?.moveNext();
                    },
                    onPrevClick: () => {
                        setlettersToGuess(lang, difficulty, 0, {
                            state: "guessed",
                            value: letters[0],
                        });
                        setlettersToGuess(lang, difficulty, 1, {
                            state: "guessed",
                            value: letters[1],
                        });
                        setlettersToGuess(lang, difficulty, 2, {
                            state: "guessed",
                            value: letters[2],
                        });
                        setlettersToGuess(lang, difficulty, 3, {
                            state: "guessed",
                            value: letters[3],
                        });
                        setlettersToGuess(lang, difficulty, 4, {
                            state: "guessed",
                            value: letters[4],
                        });

                        setExpectedTutorialKey(null);

                        driverObj?.movePrevious();
                    },
                },
            },
            { element: grid, popover: { title: t("Good first guess 💪"), description: t("Let's see what the colors mean."), disableButtons: ["previous"] } },
            { element: '#grid-0', popover: { title: t("Correct"), description: t("A letter that is perfectly placed will be colored in green.") } },
            { element: "#grid-1", popover: { title: t("Wrong"), description: t("A letter that is not in the word to guess will appear in grey.") } },
            { element: "#keyboard-O", disableActiveInteraction: true, popover: { title: t("Wrong letter"), description: t("The keyboard will show it in grey as well.") } },
            { element: "#grid-2", popover: { title: t("Misplaced"), description: t("A letter that is in the word but misplaced will appear in orange.") } },
            { element: grid, popover: { title: t("A few rules to finish"), description: t("The list of words is composed only of nouns, without duplicate letters, no verbs, no accents, no singular and no plurals.") } },
            {
                element: "#keyboard-HINT", disableActiveInteraction: true, popover: {
                    title: t("If you're stuck"), description: t("Click this button to have a word guessed for you!"),
                }
            },
            { element: "#keyboard-DELETE", disableActiveInteraction: true, popover: { title: t("Wrong letter typed?"), description: t("Click this button to erase the last letter.") } },
            { element: settingsElement, disableActiveInteraction: true, popover: { title: t("Personalization"), description: t("Change language, increase the difficulty, enable vibration/sounds and view rules here.") } },
            { popover: { title: t("Try to guess the word ✨"), description: t("Good luck!") } },
        ];
    };

    const startTutorialIfNotCompleted = () => {
        if (tutorialCompleted()) {
            return;
        }

        const lang: Lang = currentLang();
        let wordToGuess: string = "";
        let word: string = "";

        if (lang === "en") {
            wordToGuess = "BEARD";
            word = "BOARD";
        } else if (lang === "es") {
            wordToGuess = "PUNTO";
            word = "PIANO";
        } else if (lang === "fr") {
            wordToGuess = "LIVRE";
            word = "LOIRE";
        }

        onClickReplay();
        setCurrentWordToGuess(lang, "easy", wordToGuess);

        driverObj = driver({
            showProgress: true,
            allowClose: false,
            onDoneClick: () => {
                setTutorialCompleted(true);
                driverObj?.moveNext();
            },
            steps: createTutorialSteps(lang, word),
        });

        driverObj.drive();
    };

    // Stores/signals
    const [flippingTileIndices, setFlippingTileIndices] = createSignal<Set<number>>(new Set());
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
            lang,
            z.record(
                difficulty,
                z.array(letter)
            )
        ).parse(data)
    );

    const [settingsOpen, setSettingsOpen] = createSignal(false);
    const [currentDifficulty, setCurrentDifficulty] = createLocalSignal("easy", "difficulty", (data: any): Difficulty => difficulty.parse(data));
    const [currentLang, setCurrentLang] = createLocalSignal("en", "lang", (data: any) => {
        let savedLang = "en";

        try {
            savedLang = lang.parse(data);
        } catch (error) { }

        return savedLang as Lang;
    });
    const [vibrationEnabled, setVibrationEnabled] = createLocalSignal(false, "vibrationEnabled", (data: any): boolean => z.boolean().parse(data));
    const [soundEnabled, setSoundEnabled] = createLocalSignal(false, "soundEnabled", (data: any): boolean => z.boolean().parse(data));
    const [t, setLocale] = createI18n<Lang, Translation>(translations, currentLang());
    const [guessedWords, setGuessedWords] = createLocalStore<Record<Lang, Record<Difficulty, Array<string>>>>(
        {
            "en": {
                "easy": [],
                "medium": [],
                "hard": [],
            },
            "es": {
                "easy": [],
                "medium": [],
                "hard": [],
            },
            "fr": {
                "easy": [],
                "medium": [],
                "hard": [],
            },
        },
        "guessedWords",
        (data: any) => z.record(lang, z.record(difficulty, z.array(z.string()))).parse(data),
    );

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
            lang,
            z.record(
                difficulty,
                z.string()
            )
        ).parse(data)
    );
    const [numberOfHintsUsed, setNumberOfHintsUsed] = createLocalStore<Record<Lang, Record<Difficulty, number>>>({
        "en": {
            "easy": 0,
            "medium": 0,
            "hard": 0,
        },
        "es": {
            "easy": 0,
            "medium": 0,
            "hard": 0,
        },
        "fr": {
            "easy": 0,
            "medium": 0,
            "hard": 0,
        },
    },
        "numberOfHintsUsed",
        (data: any) => z.record(lang, z.record(difficulty, z.number())).parse(data)
    );
    const [tutorialCompleted, setTutorialCompleted] = createLocalSignal(
        false,
        "tutorialCompleted",
        (data: any) => z.boolean().parse(data)
    );
    const [expectedTutorialKey, setExpectedTutorialKey] = createSignal<Key | null>(null);

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
        const selectedLang: Lang = lang as Lang;
        setCurrentLang(selectedLang);
        setLocale(selectedLang);
    };

    const onKeyboardClick = (key: Key): void => {
        const difficulty: Difficulty = currentDifficulty();
        const lang: Lang = currentLang();
        const numberOfLetters: number = getNumberOfLetters();

        let lettersToGuessForCurrentDifficulty: Array<Letter> = lettersToGuess[lang][difficulty];

        if (key === "ENTER") {
            if (!canValidate()) {
                return;
            }

            triggerVibration();
            playBubble();
            moveToNextTutorialStepIfExpectedKeyIsClicked(key);

            const indicesOfAllGuessedLetters: Array<number> = lettersToGuessForCurrentDifficulty
                .map((letter, index) => letter.state === "guessed" ? index : null)
                .filter((indexOrNull): indexOrNull is number => indexOrNull !== null);

            const finalizeValidation = (): void => {
                if (gameWon()) {
                    if (soundEnabled()) {
                        successAudio.currentTime = 0;
                        void successAudio.play();
                    }

                    const existingGuessedWords = guessedWords[lang][difficulty];

                    setGuessedWords(lang, difficulty, [...existingGuessedWords, wordToGuess()]);
                    vibrate([40, 60, 40, 60, 80]);

                    return;
                }
            };

            if (prefersReducedMotion()) {
                for (const indexOfGuessedLetter of indicesOfAllGuessedLetters) {
                    revealLetterAtIndex(indexOfGuessedLetter, numberOfLetters);
                }

                finalizeValidation();

                return;
            }

            const revealStepDurationInMilliseconds = 220;
            const flipHalfDurationInMilliseconds = 150;

            indicesOfAllGuessedLetters.forEach((indexOfGuessedLetter, revealOrder) => {
                const revealDelay = revealOrder * revealStepDurationInMilliseconds;

                setTimeout((): void => {
                    setFlippingTileIndices((previousIndices) => new Set(previousIndices).add(indexOfGuessedLetter));
                }, revealDelay);

                setTimeout((): void => {
                    revealLetterAtIndex(indexOfGuessedLetter, numberOfLetters);
                }, revealDelay + flipHalfDurationInMilliseconds);
            });

            const lastRevealDelay = (indicesOfAllGuessedLetters.length - 1) * revealStepDurationInMilliseconds;

            setTimeout(finalizeValidation, lastRevealDelay + revealStepDurationInMilliseconds);

            return;
        }

        if (key === "DELETE") {
            if (!canDelete()) {
                return;
            }

            triggerVibration();
            playBubble();

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

            triggerVibration();
            playBubble();

            const indexOfNextLetterToGuess: number = lettersToGuessForCurrentDifficulty.findIndex((letter) => letter.state === "to-guess");
            const indexInWordToGuess: number = indexOfNextLetterToGuess % numberOfLetters;

            setlettersToGuess(lang, difficulty, indexOfNextLetterToGuess, {
                state: "guessed",
                value: wordToGuess()[indexInWordToGuess],
            });

            setNumberOfHintsUsed(lang, difficulty, numberOfHintsUsed[lang][difficulty] + 1);

            return;
        }

        if (wordIsCompleted()) {
            alert("Click enter to validate the word");

            return;
        }

        triggerVibration();
        playBubble();

        const indexOfNextLetterToGuess: number = lettersToGuessForCurrentDifficulty.findIndex((letter) => letter.state === "to-guess");
        let nextLetterToGuess: Letter = lettersToGuessForCurrentDifficulty[indexOfNextLetterToGuess];

        nextLetterToGuess = {
            state: "guessed",
            value: key
        };

        setlettersToGuess(lang, difficulty, indexOfNextLetterToGuess, nextLetterToGuess);
        moveToNextTutorialStepIfExpectedKeyIsClicked(key);
    };

    const onClickReplay = (): void => {
        const lang: Lang = currentLang();
        const difficulty: Difficulty = currentDifficulty();

        triggerVibration();
        setCurrentWordToGuess(lang, difficulty, randomWord(lang, difficulty));
        setlettersToGuess(lang, difficulty, createEmptyLetters(5 * getNumberOfLetters()));
        setFlippingTileIndices(new Set<number>());
        setNumberOfHintsUsed(lang, difficulty, 0);
    };

    const onClickChange = (): void => {
        const lang: Lang = currentLang();
        const difficulty: Difficulty = currentDifficulty();
        const wordToGuess: string = currentWordToGuess[lang][difficulty];

        onClickReplay();

        alert(`The word was ${wordToGuess}`);
    };

    const onClickSettings = (): void => {
        triggerVibration();
        setSettingsOpen(true);
    };

    const onClickCloseSettings = (): void => {
        triggerVibration();
        setSettingsOpen(false);
    };

    const onClickSaveLang = (lang: Lang): void => {
        triggerVibration();
        saveLang(lang);
    };

    const onClickSaveDifficulty = (difficulty: Difficulty): void => {
        triggerVibration();
        saveDifficulty(difficulty);
    };

    const onClickToggleVibration = (): void => {
        setVibrationEnabled((previousValue) => !previousValue);
    };

    const onClickToggleSound = (): void => {
        setSoundEnabled((previousValue) => !previousValue);
    };

    // Derived
    const getNumberOfLetters = (): number => currentDifficulty() === "easy" ? 5 : (currentDifficulty() === "medium" ? 6 : 7);

    const getNumberOfGuessedLetters = (): number => lettersToGuess[currentLang()][currentDifficulty()].filter((letter) => letter.state === "guessed").length;

    const wordIsCompleted = (): boolean => {
        const numberOfLetters: number = getNumberOfLetters();
        const numberOfGuessedLetters: number = getNumberOfGuessedLetters();

        return numberOfGuessedLetters > 0 && numberOfGuessedLetters % numberOfLetters === 0;
    };

    const wordGuessed = (): boolean => {
        const lang = currentLang();
        const difficulty = currentDifficulty();
        const wordToGuess = currentWordToGuess[lang][difficulty];

        return lettersToGuess[lang][difficulty]
            .filter((letter: Letter): boolean => letter.state === "good")
            .slice(-wordToGuess.length)
            .map((letter: Letter): string => letter.value)
            .join("") === wordToGuess;
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
        <div class="play-page min-h-dvh bg-orange-50 flex justify-center" style={{
            "background-image": prefersDarkTheme() ? `url(${kiblyBackgroundDark})` : `url(${kiblyBackground})`,
        }}>
            <div class="h-dvh flex flex-col w-full md:max-w-xl md:mx-auto lg:max-w-sm">
                {/* Header */}
                <header class="shrink-0 px-3 py-6 flex items-center gap-8 md:py-8">
                    {/* Spacer to keep the logo optically centered against the cog */}
                    <div class="w-9 shrink-0 md:w-11" aria-hidden="true"></div>
                    <h1 class="grow flex justify-center">
                        <Logo class="w-100 h-auto" />
                    </h1>
                    <button
                        type="button"
                        ref={settingsElement}
                        onClick={onClickSettings}
                        aria-label="Open settings"
                        class="w-9 h-9 shrink-0 flex items-center justify-center rounded-xl border-2 border-slate-300 dark:border-sky-700 text-slate-600 dark:text-sky-200 bg-white/70 dark:bg-sky-800 md:w-11 md:h-11 hover:cursor-pointer"
                    >
                        <Settings width="18" height="18" />
                    </button>
                </header>
                {/* Middle / game area */}
                <main class="flex-1 min-h-0 flex flex-col items-center justify-center gap-6 md:gap-0">
                    {/* Grid */}
                    <div class="w-full flex items-center px-2 md:px-6">
                        <div ref={grid} classList={{
                            "grid": true,
                            "w-full": true,
                            "grid-rows-5": true,
                            "gap-2": true,
                            "md:gap-3": true,
                            "lg:gap-2": true,
                            "p-2": true,
                            "grid-cols-5": currentDifficulty() === "easy",
                            "grid-cols-6": currentDifficulty() === "medium",
                            "grid-cols-7": currentDifficulty() === "hard"
                        }}>
                            <For each={lettersToGuess[currentLang()][currentDifficulty()]}>
                                {(guessedLetter, tileIndex) => <span
                                    style={{ "--entrance-delay": `${tileIndex() * 25}ms` }}
                                    id={`grid-${tileIndex()}`}
                                    classList={{
                                        "aspect-square": true,
                                        "border": true,
                                        "rounded-2xl": true,
                                        "md:rounded-3xl": true,
                                        "lg:rounded-2xl": true,
                                        "flex": true,
                                        "items-center": true,
                                        "justify-center": true,
                                        "text-3xl": true,
                                        "md:text-4xl": true,
                                        "lg:text-2xl": true,
                                        "text-gray-600": true,
                                        "dark:text-gray-300": true,
                                        "border-gray-500": true,
                                        "border-2": true,
                                        "letter-tile-appear": true,
                                        "letter-tile-flip": flippingTileIndices().has(tileIndex()),
                                        "bg-slate-50": ["to-guess", "guessed"].includes(guessedLetter.state),
                                        "dark:bg-slate-500": ["to-guess", "guessed"].includes(guessedLetter.state),
                                        "bg-amber-200": guessedLetter.state === "misplaced",
                                        "dark:bg-amber-600": guessedLetter.state === "misplaced",
                                        "bg-slate-400": guessedLetter.state === "bad",
                                        "dark:bg-slate-700": guessedLetter.state === "bad",
                                        "bg-green-200": guessedLetter.state === "good",
                                        "dark:bg-green-600": guessedLetter.state === "good",
                                    }}
                                >{guessedLetter.value}</span>}
                            </For>
                        </div>
                    </div>
                    {/* Replay/Abort */}
                    <div class="flex justify-center mb-4 md:my-8 lg:my-6">
                        <Switch>
                            <Match when={gameFinished()}>
                                <button onClick={onClickReplay} class="px-6 py-2 uppercase border rounded-xl md:rounded-2xl lg:rounded-xl border-slate-500 dark:border-sky-700 text-slate-700 dark:text-sky-200 bg-slate-100 dark:bg-sky-800 tracking-wider flex items-center gap-2 border border-2 md:px-8 md:py-2 md:text-lg hover:cursor-pointer">
                                    <span>{t("Replay")}</span>
                                    <RefreshCcw width="16" height="16" />
                                </button>
                            </Match>
                            <Match when={!gameFinished()}>
                                <button onClick={onClickChange} class="px-6 py-2 uppercase border rounded-xl md:rounded-2xl lg:rounded-xl border-slate-500 dark:border-sky-700 text-slate-700 dark:text-sky-200 bg-slate-100 dark:bg-sky-800 tracking-wider flex items-center gap-2 border border-2 md:px-8 md:py-2 md:text-lg lg:text-sm hover:cursor-pointer">
                                    <span>{t("Change")}</span>
                                    <RefreshCw width="16" height="16" />
                                </button>
                            </Match>
                        </Switch>
                    </div>
                </main>
                {/* Keyboard/Win-loose text */}
                <Switch>
                    <Match when={!gameFinished()}>
                        <footer ref={keyboardElement} class="shrink-0 pb-[env(safe-area-inset-bottom)] grid grid-rows-3 grid-cols-10 gap-2 mb-4 md:mb-6 px-4 md:gap-2 lg:gap-1 md:px-6">
                            <Index each={keyboard[currentLang()]}>
                                {(key) => <button id={`keyboard-${key()}`} onClick={() => onKeyboardClick(key())} classList={{
                                    "flex": true,
                                    "align-center": true,
                                    "justify-center": true,
                                    "items-center": true,
                                    "border": true,
                                    "rounded-lg": true,
                                    "md:rounded-2xl": true,
                                    "lg:rounded-xl": true,
                                    "border-2": true,
                                    "hover:cursor-pointer": (!["DELETE", "ENTER", "HINT"].includes(key())) || (key() === "DELETE" && canDelete()) || (key() === "HINT" && canHint()) || (key() === "ENTER" && canValidate()),
                                    "border-slate-500": (!["DELETE", "ENTER", "HINT"].includes(key())) || (key() === "DELETE" && canDelete()) || (key() === "HINT" && canHint()) || (key() === "ENTER" && canValidate()),
                                    "dark:border-sky-500": (!["DELETE", "ENTER", "HINT"].includes(key())) || (key() === "DELETE" && canDelete()) || (key() === "HINT" && canHint()) || (key() === "ENTER" && canValidate()),
                                    "bg-slate-50": !bannedLetters().includes(key()),
                                    "dark:bg-sky-600": (!["DELETE", "ENTER", "HINT"].includes(key())) && !bannedLetters().includes(key()) || (key() === "DELETE" && canDelete()) || (key() === "ENTER" && canValidate()) || (key() === "HINT" && canHint()),
                                    "dark:bg-sky-800": (key() === "DELETE" && !canDelete()) || (key() === "ENTER" && !canValidate()) || (key() === "HINT" && !canHint()),
                                    "bg-slate-400": bannedLetters().includes(key()),
                                    "dark:bg-sky-900": bannedLetters().includes(key()),
                                    "text-slate-600": !["DELETE", "ENTER", "HINT"].includes(key()) || (key() === "DELETE" && canDelete()) || (key() === "ENTER" && canValidate()) || (key() === "HINT" && canHint()),
                                    "dark:text-sky-100": !["DELETE", "ENTER", "HINT"].includes(key()) || (key() === "DELETE" && canDelete()) || (key() === "ENTER" && canValidate()) || (key() === "HINT" && canHint()),
                                    "text-slate-300": (key() === "DELETE" && !canDelete()) || (key() === "ENTER" && !canValidate()) || (key() === "HINT" && !canHint()),
                                    "dark:text-sky-900": (key() === "DELETE" && !canDelete()) || (key() === "ENTER" && !canValidate()) || (key() === "HINT" && !canHint()),
                                    "text-lg": true,
                                    "md:text-xl": true,
                                    "aspect-square": key() !== "HINT",
                                    "col-span-2": key() === "HINT"
                                }} aria-label={key() === "DELETE" ? t("Delete") : (key() === "ENTER" ? t("Validate") : undefined)}>
                                    <Switch fallback={key()}>
                                        <Match when={key() === "HINT"}>{t("hint")}</Match>
                                        <Match when={key() === "DELETE"}><Delete width="18" height="18" /></Match>
                                        <Match when={key() === "ENTER"}><CheckCheck width="18" height="18" /></Match>
                                    </Switch>
                                </button>}
                            </Index>
                        </footer>
                    </Match>
                    <Match when={gameLost()}>
                        <footer class="flex items-center justify-center gap-2 text-xl md:text-2xl py-6 dark:text-sky-200">
                            <span class="tracking-wide">{t("Word was: {word}", wordToGuess())}</span>
                        </footer>
                    </Match>
                    <Match when={gameWon()}>
                        <footer class="flex flex-col items-center justify-center gap-2 text-xl md:text-2xl py-6 text-orange-900 dark:text-sky-200">
                            <div class="tracking-wide">{t("You found it!")}</div>
                            <Show when={numberOfHintsUsed[currentLang()][currentDifficulty()] > 0}>
                                <div class="text-sm text-orange-700 dark:text-sky-500">{t("{count} hints used", numberOfHintsUsed[currentLang()][currentDifficulty()])}</div>
                            </Show>
                        </footer>
                    </Match>
                </Switch>

                {/* Settings sheet */}
                <Show when={settingsOpen()}>
                    <div class="fixed inset-0 z-50 flex flex-col justify-end md:items-center md:justify-center" role="dialog" aria-modal="true" aria-label="Settings">
                        <div class="sheet-backdrop absolute inset-0 bg-slate-900/40" onClick={() => setSettingsOpen(false)}></div>
                        <div class="sheet-panel relative bg-orange-50 dark:bg-sky-800 rounded-t-3xl border-t-2 border-slate-200 dark:border-sky-950 px-5 pt-3 pb-8 shadow-2xl md:w-full md:max-w-md md:rounded-3xl md:border md:border-t-2 md:px-8 md:py-8">
                            <div class="mx-auto mb-4 h-1.5 w-10 rounded-full bg-slate-300 dark:bg-sky-950 md:hidden"></div>
                            <div class="flex items-center mb-6">
                                <h2 class="grow text-lg text-slate-700 dark:text-sky-50 tracking-wide md:text-xl">{t("Settings")}</h2>
                                <button
                                    type="button"
                                    onClick={onClickCloseSettings}
                                    aria-label="Close settings"
                                    class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 dark:text-sky-950 border-2 border-slate-200 dark:border-sky-950"
                                >
                                    <X width="18" height="18" />
                                </button>
                            </div>

                            {/* Language */}
                            <div class="mb-6">
                                <div class="mb-2 text-xs uppercase tracking-widest text-slate-400 dark:text-sky-100">Language</div>
                                <div class="grid grid-cols-3 gap-2">
                                    <For each={langs}>
                                        {(lang) => <button
                                            type="button"
                                            onClick={() => onClickSaveLang(lang)}
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
                            <div class="mb-6">
                                <div class="mb-2 text-xs uppercase tracking-widest text-slate-400 dark:text-sky-100">Difficulty</div>
                                <div class="grid grid-cols-3 gap-2">
                                    <For each={difficulties}>
                                        {(difficulty) => <button
                                            type="button"
                                            onClick={() => onClickSaveDifficulty(difficulty)}
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
                                        >
                                            <Switch>
                                                <Match when={difficulty === "easy"}>{t("Easy")}</Match>
                                                <Match when={difficulty === "medium"}>{t("Medium")}</Match>
                                                <Match when={difficulty === "hard"}>{t("Hard")}</Match>
                                            </Switch>
                                        </button>}
                                    </For>
                                </div>
                            </div>

                            {/* Vibration / Sound */}
                            <div>
                                <div class="mb-2 text-xs uppercase tracking-widest text-slate-400 dark:text-sky-100">{t("Controls")}</div>
                                <div class="flex flex-col gap-4">
                                    <ToggleSwitch
                                        label={t("Vibration")}
                                        isChecked={vibrationEnabled()}
                                        onToggle={onClickToggleVibration}
                                    />
                                    <ToggleSwitch
                                        label={t("Sound")}
                                        isChecked={soundEnabled()}
                                        onToggle={onClickToggleSound}
                                    />
                                </div>
                            </div>
                            {/* Future controls (theme, history, ...) can be added here as new sections */}
                        </div>
                    </div>
                </Show>
            </div>
        </div >
    );
};

export default App;
