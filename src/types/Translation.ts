interface Translation {
    "Play now": () => string;
    "A cosy word guessing game": () => string;
    "Change": () => string;
    "Replay": () => string;
    "Delete": () => string;
    "Validate": () => string;
    "hint": () => string;
    "Word was: {word}": (word: string) => string;
    "You found it!": () => string;
    "Settings": () => string;
    "Easy": () => string;
    "Medium": () => string;
    "Hard": () => string;
    "Vibration": () => string;
    "Sound": () => string;
    "Controls": () => string;
};

export default Translation;
