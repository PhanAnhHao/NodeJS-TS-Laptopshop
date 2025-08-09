import { Request, Response } from "express";
import { countTotalOrdersPages, getOrderAdmin, getOrderDetailAdmin } from "services/admin/order.service";

const getAdminOrderPage = async (req: Request, res: Response) => {
    const { page } = req.query;
    let currentPage = page ? +page : 1;
    if (currentPage <= 0) currentPage = 1;
    const orders = await getOrderAdmin(currentPage);
    const totalPages = await countTotalOrdersPages();
    return res.render("admin/order/show.ejs", {
        orders,
        totalPages: +totalPages,
        page: currentPage
    });
};

const getAdminOrderDetailPage = async (req: Request, res: Response) => {
    const { id } = req.params;
    const orderDetails = await getOrderDetailAdmin(+id);
    console.log({ orderDetails });
    return res.render("admin/order/detail.ejs", {
        orderDetails, id
    });
};

export { getAdminOrderPage, getAdminOrderDetailPage }