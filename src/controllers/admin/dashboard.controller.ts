import { Request, Response } from "express";

const getDashboardPage = async (req: Request, res: Response) => {
    const user = req?.user ?? "";
    return res.render("admin/dashboard/show.ejs", {
        user
    });
};

export { getDashboardPage }