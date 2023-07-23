import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import userModel from '../daos/mongodb/models/users.model.js';

export const initializePassportGitHub = () => {

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.8dff530e6f620e73',
        clientSecret: 'f2cadb654d2ea6c76f5bb37cbd62f1bc1a4af805',
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
    }, async (accessToken, refreshToken, profile, done) => {

        try {
            let user = await userModel.findOne({
                email: profile._json.email
            })
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "X",
                    email: "X" // profile._json.email
                        ,
                    age: 19,
                    password: "X",
                    role: "User"
                };
                const result = await userModel.create(newUser);
                return done(null, result);
            } else {
                return done(null, false);
            }

        } catch (error) {
            return done(error);
        }
    }));

};