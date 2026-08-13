import * as z from "zod";
import { letterStates } from "../data";

const letterState = z.enum(letterStates);

export default letterState;
