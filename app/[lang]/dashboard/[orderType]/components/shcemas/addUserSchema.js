import { z } from "zod";

export const addUserSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    phone: z.string().regex(/^\d{3,15}$/, "Invalid phone number"),
    phone2: z.string().optional(),
    area: z.object(
        { value: z.number(), label: z.string() },
        { required_error: "Area is required" }
    ),
    street: z.string().min(1, "Street is required"),
    name: z.string().optional(),
    building: z.string().min(1, "Building number is required").or(z.literal("")),
    floor: z.string().optional(),
    apt: z.string().optional(),
    additionalInfo: z.string().optional(),
});
