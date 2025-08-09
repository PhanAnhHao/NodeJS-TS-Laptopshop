import { prisma } from "config/client"

const userFilter = async (usernameInput: string) => {
    return await prisma.user.findMany({
        where: {
            username: {
                contains: usernameInput
            }
        }
    })
};

/*
Yêu cầu 1: http://localhost:8080/products?minPrice=1000000

Lấy ra tất cả sản phẩm có giá (price) tối thiểu là 1.000.000 (vnd)
*/

const yeuCau1 = async (minPrice: number) => {
    return await prisma.product.findMany({
        where: {
            price: {
                gte: minPrice
            }
        }
    })
}

/*
Yêu cầu 2:  http://localhost:8080/products?maxPrice=15000000

Lấy ra tất cả sản phẩm có giá (price) tối đa là 15.000.000 (vnd)
*/

const yeuCau2 = async (maxPrice) => {
    return await prisma.product.findMany({
        where: {
            price: {
                lte: maxPrice
            }
        }
    })
}

/*
Yêu cầu 3:  http://localhost:8080/products?factory=APPLE

Lấy ra tất cả sản phẩm có hãng sản xuất = APPLE
*/

const yeuCau3 = async (factory: string) => {
    return await prisma.product.findMany({
        where: {
            factory: {
                equals: factory
            }
        }
    })
}

/*
Yêu cầu 4:  http://localhost:8080/products?factory=APPLE,DELL

Lấy ra tất cả sản phẩm có hãng sản xuất = APPLE hoặc DELL . 
Truyền nhiều điều kiện, ngăn cách các giá trị bởi dấu phẩy (điều kiện IN)

*/

const yeuCau4 = async (factoryArray: string[]) => {
    return await prisma.product.findMany({
        where: {
            factory: {
                in: factoryArray
            }
        }
    })
}

/*
Yêu cầu 5:http://localhost:8080/products?price=10-toi-15-trieu

Lấy ra tất cả sản phẩm theo range (khoảng giá).  10 triệu <= price <= 15 triệu
*/

const yeuCau5 = async (min: number, max: number) => {
    return await prisma.product.findMany({
        where: {
            price: {
                gte: min,
                lte: max //and
            }
        }
    })
}

/*
Yêu cầu 6:http://localhost:8080/products?price=10-toi-15-trieu,16-toi-20trieu

Lấy ra tất cả sản phẩm theo range (khoảng giá).  10 triệu <= price <= 15 triệu và
16 triệu <= price <= 20 triệu

*/

const yeuCau6 = async () => {
    return await prisma.product.findMany({
        where: {
            OR: [
                { price: { gte: 10000000, lte: 15000000 } }, // 10 triệu - 15 triệu
                { price: { gte: 16000000, lte: 20000000 } }  // 16 triệu - 20 triệu
            ]
        }
    })
}

/*
Yêu cầu 7: http://localhost:8080/products?sort=price,asc

Lấy ra tất cả sản phẩm và sắp xếp theo giá tăng dần
*/

const yeuCau7 = async () => {
    return await prisma.product.findMany({
        orderBy: {
            price: "desc"
        }
    })
};


const getProductWithFilter = async (
    page: number, pageSize: number,
    factory: string,
    target: string,
    price: string,
    sort: string
) => {

    //build where query
    let whereClause: any = {};

    if (factory) {
        const factoryInput = factory.split(",")
        whereClause.factory = {
            in: factoryInput
        }
    }
    // whereClause = {
    //     factory: {...}
    // }

    if (target) {
        const targetInput = target.split(",")
        whereClause.target = {
            in: targetInput
        }
    }

    // whereClause = {
    //     factory: {...},
    //     target: {...}
    // }

    if (price) {
        const priceInput = price.split(",");
        // ["duoi-10-trieu", "10-15-trieu", "15-20-trieu", "tren-20-trieu"]

        const priceCondition = [];

        for (let i = 0; i < priceInput.length; i++) {
            if (priceInput[i] === "duoi-10-trieu") {
                priceCondition.push({ "price": { "lt": 10000000 } })
            }
            if (priceInput[i] === "10-15-trieu") {
                priceCondition.push({
                    "price": {
                        "gte": 10000000, "lte": 15000000
                    }
                })
            }
            if (priceInput[i] === "15-20-trieu") {
                priceCondition.push({
                    "price": {
                        "gte": 15000000, "lte": 20000000
                    }
                })
            }
            if (priceInput[i] === "tren-20-trieu") {
                priceCondition.push({ "price": { "gt": 20000000 } })
            }
        }

        whereClause.OR = priceCondition
    }

    //build sort query
    let orderByClause: any = {};
    if (sort) {
        if (sort === "gia-tang-dan") {
            orderByClause = {
                price: "asc"
            }
        }
        if (sort === "gia-giam-dan") {
            orderByClause = {
                price: "desc"
            }
        }
    }

    const skip = (page - 1) * pageSize;

    const [products, count] = await prisma.$transaction([
        prisma.product.findMany({
            skip: skip,
            take: pageSize,
            where: whereClause,
            orderBy: orderByClause
        }),
        prisma.product.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(count / pageSize);

    return { products, totalPages }

}

export {
    userFilter,
    yeuCau1, yeuCau2, yeuCau3,
    yeuCau4, yeuCau5, yeuCau6, yeuCau7,
    getProductWithFilter
}