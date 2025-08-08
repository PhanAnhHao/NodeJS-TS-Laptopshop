import { User } from "@prisma/client";
import { prisma } from "config/client";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { handleLogin } from "services/client/auth.service";
import { comparePassword, getUserSumCart, getUserWithRoleById } from "services/user.service";

const configPassportLocal = () => {
    passport.use(new LocalStrategy({
        // usernameField: "email" // ghi đè lại thay vì để name ở phần view mặc định là username thì bây h đổi qua là name="email"
        passReqToCallback: true
    }, async function verify(req, username, password, callback) {
        const { session } = req as any;
        if (session?.messages?.length) {
            session.messages = [];
        }
        console.log({ username, password });

        // db.get('SELECT * FROM users WHERE username = ?', [username], function (err, row) {
        //     if (err) { return cb(err); }
        //     if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }

        //     bcrypt.compare(password, row.hashed_password, function (err, result) {
        //         if (err) { return cb(err); }
        //         if (!result) {
        //             return cb(null, false, { message: 'Incorrect username or password.' });
        //         }
        //         return cb(null, row);
        //     });
        // });

        // return handleLogin(username, password, callback);

        // check user exists in database
        const user = await prisma.user.findUnique({
            where: { username }
        })
        if (!user) {
            // throw error
            // throw new Error(`Username ${username} not found`);
            return callback(null, false, { message: `Username/password invalid` });
        }
        // compare password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            // throw error
            // throw new Error(`Invalid password`);
            return callback(null, false, { message: `Username/password invalid` });
        }
        return callback(null, user as any);
    }));

    passport.serializeUser(function (user: any, callback) {
        callback(null, { id: user.id, username: user.username });
    });

    passport.deserializeUser(async function (user: any, callback) {
        const { id, username } = user;
        //query to database
        const userInDB: any = await getUserWithRoleById(id)
        const sumCart = await getUserSumCart(id);
        return callback(null, { ...userInDB, sumCart: sumCart });
        // dùng ...userInDB thay vì callback(null, userInDB)
        // muốn đảm bảo trả về một bản sao (copy) của userInDB, tránh thay đổi trực tiếp dữ liệu gốc sau này.
        // Hoặc muốn thêm field khác (như role, sumCart...) sau này
    });

}

export default configPassportLocal;