import { Request, Response } from "express";
import { getOrderAdmin, getOrderDetailAdmin } from "services/admin/order.service";

const getAdminOrderPage = async (req: Request, res: Response) => {
    const orders = await getOrderAdmin();
    return res.render("admin/order/show.ejs", {
        orders
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