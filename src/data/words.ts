import { Lang, Difficulty } from "../types";

const words: Record<Lang, Record<Difficulty, Array<string>>> = {
    "en": {
        "easy": ["APPLE", "BREAD", "CHAIR", "SMILE", "TIGER"],
        "medium": ["PLANET", "GARDEN", "WINDOW", "CASTLE", "ANIMAL"],
        "hard": ["MORNING", "PICTURE", "CHICKEN", "KITCHEN", "BLANKET"],
    },
    "es": {
        "easy": ["PERRO", "PLAYA", "CAMPO", "REINA", "COCHE"],
        "medium": ["BOSQUE", "CAMINO", "ZAPATO", "PUERTA", "CAMISA"],
        "hard": ["VENTANA", "CABALLO", "FAMILIA", "NARANJA", "PLANETA"],
    },
    "fr": {
        "easy": ["ARBRE", "LIVRE", "TABLE", "PLAGE", "NEIGE"],
        "medium": ["MAISON", "CHEMIN", "BATEAU", "ORANGE", "OISEAU"],
        "hard": ["VOITURE", "VILLAGE", "FROMAGE", "POISSON", "CHEMISE"],
    },
};

export default words;
