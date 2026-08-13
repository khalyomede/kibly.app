import { Lang, Key } from "../types";

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

export default keyboard;
