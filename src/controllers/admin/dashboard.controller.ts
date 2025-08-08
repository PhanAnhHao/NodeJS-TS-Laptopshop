import { Request, Response } from "express";
import { getDashboardInfo } from "services/admin/dashboard.service";

const getDashboardPage = async (req: Request, res: Response) => {
    const info = await getDashboardInfo();
    return res.render("admin/dashboard/show.ejs", {
        info
    });
};

export { getDashboardPage }