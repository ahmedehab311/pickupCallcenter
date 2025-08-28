import { z } from "zod";

export const addAddressSchema = z.object({
    area: z.object(
        { value: z.number(), label: z.string() },
        { required_error: "Area is required" }
    ),
    street: z.string().min(1, "Street name is required"),
    name: z.string().optional(),

    building: z.string().min(1, "Building number is required").or(z.literal("")),
    floor: z.string().optional(),
    apt: z.string().optional(),
    additionalInfo: z.string().optional(),
});