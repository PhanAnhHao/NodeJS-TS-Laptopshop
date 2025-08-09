import { prisma } from "config/client"
import { TOTAL_ITEMS_PER_PAGE } from "config/constant";

const getOrderAdmin = async (page: number) => {
    const pageSize = TOTAL_ITEMS_PER_PAGE;
    const skip = (page - 1) * pageSize;
    return await prisma.order.findMany({
        skip: skip,
        take: pageSize,
        include: { user: true }
    });
};

const countTotalOrdersPages = async () => {
    const pageSize = TOTAL_ITEMS_PER_PAGE;
    const totalItems = await prisma.order.count();
    const totalPages = Math.ceil(totalItems / pageSize);
    return totalPages;
};

const getOrderDetailAdmin = async (orderId: number) => {
    return await prisma.orderDetail.findMany({
        where: { orderId },
        include: { product: true }
    });
}

export {
    getOrderAdmin, getOrderDetailAdmin, countTotalOrdersPages
}