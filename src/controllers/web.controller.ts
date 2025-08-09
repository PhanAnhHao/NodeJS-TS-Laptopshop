import { Request, Response } from "express";
import { countTotalProductClientPages, getProducts } from "services/client/item.service";
import { getProductWithFilter, userFilter, yeuCau1, yeuCau2, yeuCau3, yeuCau4, yeuCau5, yeuCau6, yeuCau7 } from "services/client/product.filter";

const getHomePage = async (req: Request, res: Response) => {
    const { page } = req.query;

    let currentPage = page ? +page : 1;
    if (currentPage <= 0) currentPage = 1;

    const totalPages = await countTotalProductClientPages(8);

    const products = await getProducts(currentPage, 8);
    return res.render("client/home/show.ejs", {
        products,
        totalPages: +totalPages,
        page: +currentPage
    });
};

const getProductFilterPage = async (req: Request, res: Response) => {
    console.log(">>> req.query: ", req.query);
    const { page, factory = "", target = "", price = "", sort = "" }
        = req.query as {
            page?: string;
            factory: string;
            target: string;
            price: string;
            sort: string;
        };

    let currentPage = page ? +page : 1;
    if (currentPage <= 0) currentPage = 1;

    // const totalPages = await countTotalProductClientPages(6);
    // const products = await getProducts(currentPage, 6);

    const data = await getProductWithFilter(currentPage, 6, factory, target, price, sort);

    return res.render("client/product/filter.ejs", {
        products: data.products,
        totalPages: +data.totalPages,
        page: +currentPage
    });

    // const { username } = req.query;
    // const users = await userFilter(username as string);

    // const { minPrice, maxPrice, factory, price, sort } = req.query;

    // //yêu cầu 1
    // // const products = await yeuCau1(+minPrice);

    // //yêu cầu 2
    // // const products = await yeuCau2(+maxPrice);

    // //yêu cầu 3
    // // const products = await yeuCau3(factory as string);

    // //yêu cầu 4
    // // const products = await yeuCau4((factory as string).split(","));

    // //yêu cầu 5
    // // const products = await yeuCau5(10000000, 15000000);

    // //yêu cầu 6
    // // const products = await yeuCau6();

    // //yêu cầu 7
    // const products = await yeuCau7();
    // res.status(200).json({
    //     data: products
    // });
}

export { getHomePage, getProductFilterPage }