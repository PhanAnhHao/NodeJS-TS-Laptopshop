import express, { Express } from "express";
import { getHomePage } from "controllers/web.controller";
import { getDashboardPage } from "controllers/admin/dashboard.controller";
import {
    getAdminCreateUserPage,
    getAdminOrderPage,
    getAdminUserPage,
    getAdminViewUser,
    postAdminCreateUser,
    postAdminDeleteUser,
    postAdminUpdateUser
} from "controllers/admin/user.controller";
import fileUploadMiddleware from "src/middleware/multer";
import { getProductPage } from "controllers/client/product.controller";
import {
    getAdminCreateProductPage,
    getAdminProductPage,
    getAdminViewProductPage,
    postAdminCreateProduct,
    postAdminDeleteProduct,
    postAdminUpdateProduct
} from "controllers/admin/product.controller";
import {
    getLoginPage,
    getRegisterPage,
    getSuccessRedirectPage,
    postLogout,
    postRegister
} from "controllers/client/auth.controller";
import passport from "passport";
import { isAdmin, isLogin } from "src/middleware/auth";

const router = express.Router();

const webRoute = (app: Express) => {

    // web routes
    router.get("/", getHomePage);
    router.get("/success-redirect", getSuccessRedirectPage);
    router.get("/product/:id", getProductPage);
    router.get("/login", isLogin, getLoginPage);
    router.post('/login', passport.authenticate('local', {
        successRedirect: '/success-redirect',
        failureRedirect: '/login',
        failureMessage: true
    }));
    router.get("/register", isLogin, getRegisterPage);
    router.post("/register", postRegister);
    router.post("/logout", postLogout);

    // admin routes
    router.get("/admin", getDashboardPage);
    router.get("/admin/user", getAdminUserPage);
    router.get("/admin/create-user", getAdminCreateUserPage);
    router.post("/admin/handle-create-user", fileUploadMiddleware("avatar"), postAdminCreateUser);
    router.post("/admin/delete-user/:id", postAdminDeleteUser);
    router.get("/admin/view-user/:id", getAdminViewUser);
    router.post("/admin/update-user", fileUploadMiddleware("avatar"), postAdminUpdateUser);

    router.get("/admin/product", getAdminProductPage);
    router.get("/admin/create-product", getAdminCreateProductPage);
    router.post("/admin/create-product", fileUploadMiddleware("image", "images/product"), postAdminCreateProduct);
    router.post("/admin/delete-product/:id", postAdminDeleteProduct);
    router.get("/admin/view-product/:id", getAdminViewProductPage);
    router.post("/admin/update-product", fileUploadMiddleware("image", "images/product"), postAdminUpdateProduct);

    router.get("/admin/order", getAdminOrderPage);

    app.use("/", isAdmin, router);
};

export default webRoute;
