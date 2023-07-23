import {
    Router
} from 'express';
import userModel from '../daos/mongodb/models/users.model.js';
import passport from 'passport';
import {
    createHash,
    isValidPassword
} from '../utils.js';
import ManagerCarts from '../daos/mongodb/CartManager.class.js';
import jwt from 'jsonwebtoken';

const router = Router();
const managerCarts = new ManagerCarts();

// router.js
router.post('/register', (req, res, next) => {
    passport.authenticate('register', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            // La autenticación falló, enviamos el mensaje de error en formato JSON
            return res.status(401).json({
                message: info.message
            });
        }
        // La autenticación es exitosa, respondemos con los datos del usuario
        res.json({
            message: 'Registro exitoso',
            user
        });
    })(req, res, next);
});

// Login:
router.post('/login', (req, res, next) => {

    passport.authenticate('login', { session: false },(err, user, info) => {
        console.log(user)
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                message: info.message
            });
        } else{
            let token = jwt.sign({email: req.body.email}, 'CoderSecret',{
            expiresIn: 10 * 10 * 10, });
            res.cookie('coderCookie', token, {httpOnly: true}).send({status: 'success'});
        }

    })(req, res, next);
});

// Current:
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) =>{
    res.send(req.user);
});



// Autenticación con GitHub:
router.get('/github', passport.authenticate('github', {session: false}, {
        scope: 'user: email'
    }),
    (req, res) => {}
)

router.get('/githubcallback', passport.authenticate('github', {
    failureRedirect: '/login'
}), async (req, res) => {
    console.log('Exito');
    req.session.user = req.user;

    res.redirect('/realtimeproducts');
})


// Cerrar sesión:
router.get('/logout', (req, res) => {
    req.logout(); // Eliminar la sesión de Passport
    req.session.destroy(); // Destruir sesión
    res.send('Sesión cerrada');
});

export default router;