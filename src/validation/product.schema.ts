import { z } from "zod";

export const ProductSchema = z.object({
    id: z.string().optional(),
    name: z.string().trim().min(1, { message: "Tên ko đc để trống" }),
    price: z.string()
        .transform((val) => (val === "" ? 0 : Number(val)))
        .refine((num) => num > 0, {
            message: "Số tiền tối thiểu là 1",
        }),

    detailDesc: z.string().trim().min(1, { message: "detailDesc ko đc để trống" }),
    shortDesc: z.string().trim().min(1, { message: "shortDesc ko đc để trống" }),
    quantity: z.string()
        .transform((val) => (val === "" ? 0 : Number(val)))
        .refine((num) => num > 0, {
            message: "Số tiền tối thiểu là 1",
        }),
    factory: z.string().trim().min(1, { message: "factory ko đc để trống" }),
    target: z.string().trim().min(1, { message: "target ko đc để trống" }),
});

export type TProductSchema = z.infer<typeof ProductSchema>;