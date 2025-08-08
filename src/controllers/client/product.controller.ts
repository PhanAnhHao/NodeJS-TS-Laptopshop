import { Request, Response } from "express";
import { addProductToCart, deleteProductInCart, getCategoriesCount, getOrderHistory, getProductById, getProductInCart, handlePlaceOrder, updateCartDetailBeforeCheckout } from "services/client/item.service";

const getProductPage = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await getProductById(+id);
    const categories = await getCategoriesCount();
    return res.render("client/product/detail.ejs", {
        product, categories
    });
};

const postAddProductToCart = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;

    if (user) {
        await addProductToCart(1, +id, user);
    } else return res.redirect("/login");

    return res.redirect("/");
}

const getCartPage = async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) return res.redirect("/login");

    const cartDetails = await getProductInCart(+user.id);

    const totalPrice = cartDetails?.map(item => +item.price * +item.quantity)
        ?.reduce((a, b) => a + b, 0);
    // .map trả ra ví dụ [tổng số tiền sp1, tổng số tiền sp6, tổng số tiền sp7]
    // .reduce cộng gộp tổng tiền lại để ra tổng tiền của giỏ hàng

    const cartId = cartDetails.length ? cartDetails[0].cartId : 0;

    return res.render("client/product/cart", {
        cartDetails, totalPrice, cartId
    });

};

const postDeleteProductInCart = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;

    if (user) {
        await deleteProductInCart(+id, user.id, user.sumCart);
    } else {
        return res.redirect("/login");
    }

    return res.redirect("/cart");
};

const getCheckOutPage = async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) return res.redirect("/login");

    const cartDetails = await getProductInCart(+user.id);

    const totalPrice = cartDetails?.map(item => +item.price * +item.quantity)
        ?.reduce((a, b) => a + b, 0);

    return res.render("client/product/checkout", {
        cartDetails, totalPrice
    });

};

const postHandleCartToCheckOut = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) return res.redirect("/login");
    // console.log("req.body: ", req.body);

    const { cartId } = req.body;

    const currentCartDetail: { id: string, quantity: string }[] = req.body?.cartDetails ?? [];

    await updateCartDetailBeforeCheckout(currentCartDetail, cartId);

    return res.redirect("/checkout");
};

const postPlaceOrder = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) return res.redirect("/login");
    const { receiverName, receiverAddress, receiverPhone, totalPrice } = req.body;


    const message = await handlePlaceOrder(user.id, receiverName, receiverAddress, receiverPhone, +totalPrice);
    console.log(">>> Check message: ", message);
    if (message) return res.redirect("/checkout");

    return res.redirect("/thanks");
};

const getThanksPage = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) return res.redirect("/login");

    return res.render("client/product/thanks");
};

const getOrderHistoryPage = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) return res.redirect("/login");

    const orders = await getOrderHistory(user.id);

    return res.render("client/product/order.history.ejs", {
        orders
    })
};

const postAddToCartFromDetailPage = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    if (!user) return res.redirect("/login");

    await addProductToCart(+quantity, +id, user);

    return res.redirect(`/product/${id}`);
};

export {
    getProductPage, postAddProductToCart, getCartPage, postDeleteProductInCart,
    getCheckOutPage, postHandleCartToCheckOut, postPlaceOrder, getThanksPage,
    getOrderHistoryPage, postAddToCartFromDetailPage
}