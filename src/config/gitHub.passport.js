// github.passport.js

import passport from 'passport';
import { Strategy as GitHubStrategy} from 'passport-github2';
import userModel from '../daos/mongodb/models/users.model.js';
import ManagerCarts from '../daos/mongodb/CartManager.class.js';

const managerCarts = new ManagerCarts();

export const initializePassportGitHub = () => {

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.8dff530e6f620e73',
        clientSecret: 'f2cadb654d2ea6c76f5bb37cbd62f1bc1a4af805',
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
    }, async (accessToken, refreshToken, profile, done) => {

        try {
            let user = await userModel.findOne({
                first_name: profile._json.name,
            })

            if (!user) {
                const cart = await managerCarts.crearCart();

                let newUser = {
                    first_name: profile._json.name,
                    last_name: "X",
                    email: profile._json.email ||"X",
                    age: 19,
                    password: "X",
                    role: "User",
                    cart: cart._id
                };
                const result = await userModel.create(newUser);
                return done(null, result);
            } else {
                return done(null, user);
            }

        } catch (error) {
            return done(error);
        }
    }));

};
