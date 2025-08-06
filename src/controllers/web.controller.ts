import { Request, Response } from "express";
import { getProducts } from "services/client/item.service";

const getHomePage = async (req: Request, res: Response) => {
    const products = await getProducts();
    const user = req.user;
    console.log({ user });
    return res.render("client/home/show.ejs", {
        products
    });
};

export { getHomePage }