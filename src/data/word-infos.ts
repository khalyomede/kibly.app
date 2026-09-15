import { beachPng, beachWebp, fruitPng, fruitWebp, gardenPng, gardenWebp, musicPng, musicWebp, planePng, planeWebp, radioPng, radioWebp, tablePng, tableWebp, tigerPng, tigerWebp, watchPng, watchWebp, worldPng, worldWebp } from "../images/words";
import WordInfo from "../interfaces/WordInfo";
import { Lang, Noun } from "../types";

const wordInfos: Record<Lang, Partial<Record<Noun, WordInfo>>> = {
    "en": {
        "BEACH": {
            imagePng: beachPng,
            imageWebp: beachWebp,
        },
        "FRUIT": {
            imagePng: fruitPng,
            imageWebp: fruitWebp,
        },
        "GARDEN": {
            imagePng: gardenPng,
            imageWebp: gardenWebp,
        },
        "MUSIC": {
            imagePng: musicPng,
            imageWebp: musicWebp,
        },
        "PLANE": {
            imagePng: planePng,
            imageWebp: planeWebp,
        },
        "RADIO": {
            imagePng: radioPng,
            imageWebp: radioWebp,
        },
        "TIGER": {
            imagePng: tigerPng,
            imageWebp: tigerWebp,
        },
        "TABLE": {
            imagePng: tablePng,
            imageWebp: tableWebp,
        },
        "WATCH": {
            imagePng: watchPng,
            imageWebp: watchWebp,
        },
        "WORLD": {
            imagePng: worldPng,
            imageWebp: worldWebp,
        },
    },
    "es": {
        "FRUTA": {
            imagePng: fruitPng,
            imageWebp: fruitWebp,
        },
        "MUNDO": {
            imagePng: worldPng,
            imageWebp: worldWebp,
        },
        "MUSICA": {
            imagePng: musicPng,
            imageWebp: musicWebp,
        },
        "RADIO": {
            imagePng: radioPng,
            imageWebp: radioWebp,
        },
        "RELOJ": {
            imagePng: watchPng,
            imageWebp: watchWebp,
        },
        "TIGRE": {
            imagePng: tigerPng,
            imageWebp: tigerWebp,
        },
    },
    "fr": {
        "AVION": {
            imagePng: planePng,
            imageWebp: planeWebp,
        },
        "MONDE": {
            imagePng: worldPng,
            imageWebp: worldWebp,
        },
        "FRUIT": {
            imagePng: fruitPng,
            imageWebp: fruitWebp,
        },
        "JARDIN": {
            imagePng: gardenPng,
            imageWebp: gardenWebp,
        },
        "MONTRE": {
            imagePng: watchPng,
            imageWebp: watchWebp,
        },
        "PLAGE": {
            imagePng: beachPng,
            imageWebp: beachWebp,
        },
        "RADIO": {
            imagePng: radioPng,
            imageWebp: radioWebp,
        },
        "TABLE": {
            imagePng: tablePng,
            imageWebp: tableWebp,
        },
        "TIGRE": {
            imagePng: tigerPng,
            imageWebp: tigerWebp,
        },
    },
};

export default wordInfos;
