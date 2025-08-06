import { prisma } from "config/client";

const getProducts = async () => {
    const products = await prisma.product.findMany();
    return products;
};

const getProductById = async (id: number) => {
    const product = await prisma.product.findUnique({
        where: { id }
    });
    return product;
};

const getCategoriesCount = async () => {
    const categoryCounts = await prisma.product.groupBy({
        by: ['factory'],
        _count: true
    });
    const result = categoryCounts.map(item => ({
        categoryName: item.factory,
        count: item._count
    }));
    console.log({ result });
    return result;
};

export { getProducts, getProductById, getCategoriesCount }