import passport from 'passport';
import local from 'passport-local';
import userModel from '../daos/mongodb/models/users.model.js';
import {
    createHash,
    isValidPassword
} from '../utils.js';
import ManagerCarts from '../daos/mongodb/CartManager.class.js';

const localStrategy = local.Strategy;
const managerCarts = new ManagerCarts();

export const initializePassportLocal = () => {

    // Primera estrategia - Registro:

    passport.use('register', new localStrategy({
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done) => {

            // Sacamos del formulario la inforamcion del usuario. 

            const {
                first_name,
                last_name,
                email,
                age
            } = req.body;

            try {

                // Buacamos el correo en la base de datos: 
                const exist = await userModel.findOne({
                    email: username
                });

                if (exist) {
                    const errorMessage = 'El usuario ya existe. Presione "Ingresa aquí" para iniciar sesión.';
                    return done(null, false, {
                        message: errorMessage
                    });
                } else {

                    // Crear el carrito primero utilizando el ManagerCarts
                    const cart = await managerCarts.crearCart();

                    const newUser = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password),
                        role: 'User',
                        cart: cart._id, // Asignar el ID del carrito al campo 'cart' del usuario
                    };

                    const result = await userModel.create(newUser);

                    return done(null, result);
                }

            } catch (error) {
                return done('Error de registro', error);
            }
        }
    ));

    // Segunda estrategia - Login:

    passport.use(
        'login',
        new localStrategy({
            usernameField: 'email'
        }, async (username, password, done) => {
            try {
                // Buscar al usuario en la base de datos utilizando el correo electrónico (email)
                const user = await userModel.findOne({
                    email: username
                });

                // Si no se encuentra al usuario en la base de datos
                if (!user) {
                    const errorMessage = 'No hay una cuenta registrada con este correo. Presione "Regístrarse aquí" para crear una cuenta.';
                    return done(null, false, {
                        message: errorMessage
                    });
                }

                // Si el usuario existe en la base de datos, verificar si la contraseña es válida
                if (!isValidPassword(user, password)) {
                    const errorMessage = 'El correo sí se encuentra registrado pero, la contraseña ingresada es incorrecta.';
                    return done(null, false, {
                        message: errorMessage
                    });
                }

                // Si el usuario existe y la contraseña es válida, retornar el usuario autenticado
                return done(null, user);
            } catch (error) {
                // Si ocurre un error durante la búsqueda o verificación, retornar el error
                return done(error);
            }
        })
    );

};