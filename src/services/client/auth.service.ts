import { compare } from "bcrypt";
import { prisma } from "config/client"
import { ACCOUNT_TYPE } from "config/constant";
import { comparePassword, hashPassword } from "services/user.service";

const isEmailExist = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { username: email }
    })

    if (user) { return true; }
    return false;
}

const registerNewUser = async (
    fullName: string,
    email: string,
    password: string
) => {

    const newPassword = await hashPassword(password);

    const userRole = await prisma.role.findUnique({
        where: { name: "USER" }
    })

    if (userRole) {
        await prisma.user.create({
            data: {
                username: email,
                password: newPassword,
                fullName: fullName,
                accountType: ACCOUNT_TYPE.SYSTEM,
                roleId: userRole.id
            }
        })
    } else {
        throw new Error("User Role không tồn tại.")
    }
}

const handleLogin = async (username: string, password: string, callback: any) => {
    // // check user exists in database
    // const user = await prisma.user.findUnique({
    //     where: { username }
    // })
    // if (!user) {
    //     // throw error
    //     // throw new Error(`Username ${username} not found`);
    //     return callback(null, false, { message: 'Incorrect username or password.' });
    // }
    // // compare password
    // const isMatch = await comparePassword(password, user.password);
    // if (!user) {
    //     // throw error
    //     // throw new Error(`Invalid password`);
    //     return callback(null, false, { message: 'Incorrect username or password.' });
    // }
    // return callback(null, user);
}

export {
    registerNewUser, isEmailExist, handleLogin
}