import * as z from "zod";
import { difficulties } from "../data";

const difficulty = z.enum(difficulties);

export default difficulty;
