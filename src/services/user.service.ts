import { prisma } from "config/client";
import { ACCOUNT_TYPE } from "config/constant";
import bcrypt from 'bcrypt';

const saltRounds = 10;

const hashPassword = async (plainText: string) => {
    return await bcrypt.hash(plainText, saltRounds); // plainText: mk nhìn thấy = mắt con ng` có thể hiểu được
}

const comparePassword = async (plainText: string, hashPassword: string) => {
    return await bcrypt.compare(plainText, hashPassword);
}

const handleAdminCreateUser = async (
    fullName: string,
    email: string,
    address: string,
    phone: string,
    avatar: string,
    role: string) => {

    const defaultPassword = await hashPassword("123456");
    // insert into database
    try {
        const newUser = await prisma.user.create({
            data: {
                fullName: fullName,
                username: email,
                address: address,
                password: defaultPassword,
                accountType: ACCOUNT_TYPE.SYSTEM,
                avatar: avatar,
                phone: phone,
                roleId: +role // "2"=>2
            }
        });
        return newUser;
    } catch (err) {
        console.log(err);
        return [];
    }
};

const getAllUsers = async () => {
    try {
        const users = await prisma.user.findMany();
        return users;
    } catch (err) {
        console.log(err);
        return [];
    }
};

const getAllRoles = async () => {
    try {
        const roles = await prisma.role.findMany();
        return roles;
    } catch (err) {
        console.log(err);
        return [];
    }
};

const handleAdminDeleteUser = async (id: string) => {
    try {
        const result = await prisma.user.delete({
            where: { id: +id }
        })
        return result;
    } catch (err) {
        console.log(err);
        return [];
    }
}

const getUserById = async (id: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: +id }
        })
        return user;
    } catch (err) {
        console.log(err);
        return [];
    }
}

const getAdminUserById = async (id: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: +id }
        })
        return user;
    } catch (err) {
        console.log(err);
        return [];
    }
}

const updateAdminUserById = async (
    id: string,
    fullName: string,
    phone: string,
    role: string,
    address: string,
    avatar: string) => {
    try {
        const updatedUser = await prisma.user.update({
            where: { id: +id }, //mẹo (chỉ dùng đc vs JS) covert string sang number nhanh thêm dấu + phía trc: "1" => 1
            data: {
                fullName: fullName,
                phone: phone,
                roleId: +role,
                address: address,
                ...(avatar !== undefined && { avatar: avatar })
                // => dấu ... ở đây là copy, sẽ copy biến obj { avatar: avatar } này nếu đk avatar !== undefined này tồn tại
                // => trong trường hợp ko tồn tại thì nó là object rỗng, nên là ko thêm trường avatar
            }
        })
        return updatedUser;
    } catch (err) {
        console.log(err);
        return [];
    }
}


export {
    getAllUsers, getUserById,
    getAllRoles, handleAdminCreateUser, handleAdminDeleteUser, getAdminUserById, updateAdminUserById,
    hashPassword, comparePassword
}