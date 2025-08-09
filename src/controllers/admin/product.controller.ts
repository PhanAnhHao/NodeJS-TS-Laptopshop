import { Request, Response } from "express";
import {
    countTotalProductsPages,
    createProduct,
    getProductById,
    getProductsList,
    handleDeleteProduct,
    updateProductById
} from "services/admin/product.service";
import { ProductSchema, TProductSchema } from "src/validation/product.schema";

const getAdminProductPage = async (req: Request, res: Response) => {
    const { page } = req.query;
    let currentPage = page ? +page : 1;
    if (currentPage <= 0) currentPage = 1;
    const products = await getProductsList(currentPage);
    const totalPages = await countTotalProductsPages();
    return res.render("admin/product/show.ejs", {
        products,
        totalPages: +totalPages,
        page: +currentPage
    });
};

const getAdminCreateProductPage = async (req: Request, res: Response) => {
    const errors = [];
    const oldData = {
        name: "",
        price: "",
        detailDesc: "",
        shortDesc: "",
        quantity: "",
        factory: "",
        target: "",
    }
    return res.render("admin/product/create.ejs", {
        errors, oldData
    });
};

const postAdminCreateProduct = async (req: Request, res: Response) => {
    const {
        name,
        price,
        detailDesc,
        shortDesc,
        quantity,
        factory,
        target
    } = req.body as TProductSchema;
    const validate = ProductSchema.safeParse(req.body);
    if (!validate.success) {
        // error
        const errorsZod = validate.error.issues;
        const errors = errorsZod.map(item => `${item.message} (${item.path[0]})`);
        const oldData = {
            name,
            price,
            detailDesc,
            shortDesc,
            quantity,
            factory,
            target
        }
        return res.render("admin/product/create.ejs", {
            errors, oldData
        });
    }
    // success, create a new product
    const image = req?.file?.filename ?? null;
    await createProduct(
        name,
        +price,
        detailDesc,
        shortDesc,
        +quantity,
        factory,
        target,
        image
    );
    return res.redirect("/admin/product");
};

const postAdminDeleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    await handleDeleteProduct(+id);
    return res.redirect("/admin/product")
};

const getAdminViewProductPage = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await getProductById(+id);
    const factoryOptions = [
        { name: "Apple (MacBook)", value: "APPLE" },
        { name: "Asus", value: "ASUS" },
        { name: "Lenovo", value: "LENOVO" },
        { name: "Dell", value: "DELL" },
        { name: "LG", value: "LG" },
        { name: "Acer", value: "ACER" },
    ];

    const targetOptions = [
        { name: "Gaming", value: "GAMING" },
        { name: "Sinh viên - Văn phòng", value: "SINHVIEN-VANPHONG" },
        { name: "Thiết kế đồ họa", value: "THIET-KE-DO-HOA" },
        { name: "Mỏng nhẹ", value: "MONG-NHE" },
        { name: "Doanh nhân", value: "DOANH-NHAN" },
    ];
    return res.render("admin/product/detail.ejs", {
        product, factoryOptions, targetOptions
    });
};

const postAdminUpdateProduct = async (req: Request, res: Response) => {
    const {
        id,
        name,
        price,
        detailDesc,
        shortDesc,
        quantity,
        factory,
        target
    } = req.body as TProductSchema;
    const image = req?.file?.filename ?? null;
    await updateProductById(
        +id,
        name,
        +price,
        detailDesc,
        shortDesc,
        +quantity,
        factory,
        target,
        image
    );
    return res.redirect("/admin/product")
};

export {
    getAdminProductPage, getAdminCreateProductPage, postAdminCreateProduct, postAdminDeleteProduct, getAdminViewProductPage, postAdminUpdateProduct
}