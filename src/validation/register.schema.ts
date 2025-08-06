import { isEmailExist } from "services/client/auth.service";
import { z } from "zod";

const passwordSchema = z
    .string()
    .min(3, { message: "Password tối thiểu 3 ký tự" })
    .max(20, { message: "Password tối đa 20 ký tự" })
// .refine((password) => /[A-Z]/.test(password), {
//     message: "Password bao gồm ít nhất 1 ký tự viết hoa",
// })
// .refine((password) => /[a-z]/.test(password), {
//     message: "Password bao gồm ít nhất 1 ký tự viết thường",
// })
// .refine((password) => /[0-9]/.test(password), {
//     message: "Password bao gồm ít nhất 1 chữ số"
// })
// .refine((password) => /[!@#$%^&*]/.test(password), {
//     message: "Password bao gồm ít nhất 1 ký tự đặc biệt",
// });

const emailSchema =
    z.string().email("Email không đúng định dạng")
        .refine(async (email) => {
            const existingUser = await isEmailExist(email);
            return !existingUser;
        }, {
            message: "Email already exists",
            path: ["email"],
        });

// const emailSchema = z.string()
//     .trim()
//     .refine((val) => val.length > 0, {
//         message: "Tên không được để trống",
//     })
//     .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
//         message: "Email không đúng định dạng",
//     })
//     .refine(async (email) => {
//         const existingUser = await isEmailExist(email);
//         return !existingUser;
//     }, {
//         message: "Email already exists",
//         path: ["email"],
//     });

// dùng .superRefine() để kiểm soát luồng kiểm tra theo thứ tự
// const emailSchema = z.string().trim().superRefine(async (val, ctx) => {
//     // ctx = context
//     // Vì sao ctx quan trọng ?
//     // Nếu dùng.refine() → chỉ có thể trả về true / false
//     // Nhưng.superRefine() với ctx.addIssue() →  có thể báo nhiều lỗi khác nhau, dừng logic, viết điều kiện phức tạp

//     // 1. Kiểm tra rỗng
//     if (val === '') {
//         // ctx có phương thức .addIssue() giúp báo lỗi thủ công khi kiểm tra dữ liệu.
//         ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             /**Dòng code: z.ZodIssueCode.custom có nghĩa là:
//             🔧 Zod sẽ hiểu lỗi này là lỗi do bạn tự định nghĩa,
//             không phải lỗi có sẵn như too_short, invalid_type, hay invalid_email. */
//             message: "Tên không được để trống",
//         });
//         return; // ❌ dừng lại không kiểm tra tiếp
//     }

//     // 2. Kiểm tra định dạng email
//     const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
//     if (!isValidEmail) {
//         ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message: "Email không đúng định dạng",
//         });
//         return;
//     }

//     // 3. Kiểm tra email tồn tại
//     const exists = await isEmailExist(val);
//     if (exists) {
//         ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message: "Email đã tồn tại",
//         });
//     }
// });


export const RegisterSchema = z.object({
    fullName: z.string().trim().min(1, { message: "Tên không được để trống" }),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Password confirm không chính xác",
        path: ['confirmPassword'],
    });;

export type TRegisterSchema = z.infer<typeof RegisterSchema>;