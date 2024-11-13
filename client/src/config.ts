import { z } from "zod";

export const USER_AUTH_ORIGIN = z
  .string()
  .min(5)
  .parse(import.meta.env.VITE_USER_AUTH_ORIGIN);
export const FILE_ORIGIN = z
  .string()
  .min(5)
  .parse(import.meta.env.VITE_FILE_ORIGIN);
