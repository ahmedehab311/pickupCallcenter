import { z } from "zod";

export const editUserAddressSchema = z.object({
  area: z.object(
    { value: z.number(), label: z.string() },
    { required_error: "Area is required" }
  ),
  street: z.string().min(1, "Street name is required"),
  name: z.string().optional(),
  building: z.string().min(1, "Building number is required").or(z.literal("")),
  building: z.string().min(1, "Building number is required").or(z.literal("")),
  floor: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => val || ""),
  apt: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => val || ""),
  additionalInfo: z.string().optional(),
});