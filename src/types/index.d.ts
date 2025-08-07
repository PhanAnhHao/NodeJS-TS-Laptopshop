// chữ d (data type) ở đây cực kì quan trọng, nếu bth viết là ts thì chỉ hiểu đó là 1 file ts thôi,
// còn thêm chữ d vào thì đây là 1 file định nghĩa type, hỗ trợ coding

import { Role, User } from '@prisma/client'

declare global {
    namespace Express {
        interface User extends User {
            role?: Role
        }
    }
}