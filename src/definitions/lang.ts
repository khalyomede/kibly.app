import * as z from "zod";
import { langs } from "../data";

const lang = z.enum(langs);

export default lang;
