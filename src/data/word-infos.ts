import { table } from "../images/words";
import WordInfo from "../interfaces/WordInfo";
import { Lang, Noun } from "../types";

const wordInfos: Record<Lang, Partial<Record<Noun, WordInfo>>> = {
    "en": {},
    "es": {},
    "fr": {
        "TABLE": {
            image: table,
        },
    }
};

export default wordInfos;
