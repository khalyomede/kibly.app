import * as z from "zod";
import letterState from "./letterStates";

const letter = z.object({ state: letterState, value: z.string() });

export default letter;
