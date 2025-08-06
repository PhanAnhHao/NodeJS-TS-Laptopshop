import { Request, Response } from "express";
import { getCategoriesCount, getProductById } from "services/client/item.service";

const getProductPage = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await getProductById(+id);
    const categories = await getCategoriesCount();
    return res.render("client/product/detail.ejs", {
        product, categories
    });
};

export { getProductPage }