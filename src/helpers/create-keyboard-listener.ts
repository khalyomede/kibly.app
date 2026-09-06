import { Accessor, onCleanup } from "solid-js";
import { Key } from "../types";

const guessableLetterKeys: ReadonlySet<Key> = new Set(
    Array.from({ length: 26 }, (_, letterIndexInAlphabet: number): Key => String.fromCharCode(65 + letterIndexInAlphabet) as Key)
);

const interactiveElementTagNames: ReadonlySet<string> = new Set(["BUTTON", "A", "INPUT", "SELECT", "TEXTAREA"]);

const isGuessableLetterKey = (uppercasedKeyPressed: string): uppercasedKeyPressed is Key => {
    return guessableLetterKeys.has(uppercasedKeyPressed as Key);
};

const isInteractiveElementTarget = (eventTarget: EventTarget | null): boolean => {
    if (!(eventTarget instanceof HTMLElement)) {
        return false;
    }

    return interactiveElementTagNames.has(eventTarget.tagName);
};

const resolveKeyFromKeyboardEvent = (keyboardEvent: KeyboardEvent): Key | null => {
    const physicalKeyPressed: string = keyboardEvent.key;

    if (physicalKeyPressed === "Enter") {
        return "ENTER";
    }

    if (physicalKeyPressed === "Backspace" || physicalKeyPressed === "Delete") {
        return "DELETE";
    }

    if (physicalKeyPressed === "Help") {
        return "HINT";
    }

    const uppercasedKeyPressed: string = physicalKeyPressed.toUpperCase();

    if (isGuessableLetterKey(uppercasedKeyPressed)) {
        return uppercasedKeyPressed;
    }

    return null;
};

/**
 * Mirrors physical keyboard input onto the on-screen keyboard handler.
 * Uses `event.key` (layout-aware) rather than `event.code` (physical position)
 * so AZERTY/QWERTY users both get the letter they actually typed.
 */
const createKeyboardListener = (
    onKeyboardClick: (key: Key) => void,
    isListeningSuspended: Accessor<boolean>,
): void => {
    const handleWindowKeyDown = (keyboardEvent: KeyboardEvent): void => {
        if (keyboardEvent.ctrlKey || keyboardEvent.metaKey || keyboardEvent.altKey || keyboardEvent.repeat) {
            return;
        }

        if (isListeningSuspended()) {
            return;
        }

        if (isInteractiveElementTarget(keyboardEvent.target)) {
            return;
        }

        const resolvedKey: Key | null = resolveKeyFromKeyboardEvent(keyboardEvent);

        if (resolvedKey === null) {
            return;
        }

        keyboardEvent.preventDefault();
        onKeyboardClick(resolvedKey);
    };

    if (typeof window !== "undefined") {
        window.addEventListener("keydown", handleWindowKeyDown);

        onCleanup((): void => {
            window.removeEventListener("keydown", handleWindowKeyDown);
        });
    }
};

export default createKeyboardListener;
