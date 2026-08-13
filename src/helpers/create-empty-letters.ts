import { Letter } from "../interfaces";

const createEmptyLetters = (count: number): Array<Letter> => Array.from({ length: count }, () => ({
    state: "to-guess",
    value: "",
}));

export default createEmptyLetters;
