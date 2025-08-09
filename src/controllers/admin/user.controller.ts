import { Request, Response } from "express";
import {
    countTotalUsersPages,
    getAdminUserById,
    getAllRoles, getAllUsers,
    handleAdminCreateUser, handleAdminDeleteUser,
    updateAdminUserById
} from "services/user.service";

const getAdminUserPage = async (req: Request, res: Response) => {
    const { page } = req.query;
    let currentPage = page ? +page : 1;
    if (currentPage <= 0) currentPage = 1;
    const users = await getAllUsers(currentPage);
    const totalPages = await countTotalUsersPages();
    return res.render("admin/user/show.ejs", {
        users: users,
        totalPages: +totalPages,
        page: +currentPage
    });
};

const getAdminCreateUserPage = async (req: Request, res: Response) => {
    const roles = await getAllRoles();
    return res.render("admin/user/create.ejs", {
        roles
    });
};

const postAdminCreateUser = async (req: Request, res: Response) => {
    const { fullName, username, phone, role, address } = req.body;
    const file = req.file;
    const avatar = file?.filename ?? null;
    await handleAdminCreateUser(fullName, username, address, phone, avatar, role);
    return res.redirect("/admin/user");
};

const postAdminDeleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    await handleAdminDeleteUser(id);
    return res.redirect("/admin/user");
};

const getAdminViewUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    // get user by id
    const user = await getAdminUserById(id);
    const roles = await getAllRoles();
    return res.render("admin/user/detail.ejs", {
        id, user, roles
    });
}

const postAdminUpdateUser = async (req: Request, res: Response) => {
    const { id, fullName, phone, role, address } = req.body;
    const file = req.file;
    const avatar = file?.filename ?? undefined;
    // update user by id
    await updateAdminUserById(id, fullName, phone, role, address, avatar);
    return res.redirect("/admin/user");
}


export {
    getAdminUserPage, getAdminCreateUserPage, postAdminCreateUser, postAdminDeleteUser, getAdminViewUser, postAdminUpdateUser,
}