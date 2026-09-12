import * as z from "zod";
import { nouns } from "../data";

const difficulty = z.enum(nouns);

export default difficulty;
