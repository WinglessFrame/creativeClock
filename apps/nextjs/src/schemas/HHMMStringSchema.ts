import { z } from "zod";

const HHMMStringSchema = z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/);
export default HHMMStringSchema;
