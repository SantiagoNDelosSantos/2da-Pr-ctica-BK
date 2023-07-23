import { Router } from "express";
import __dirname from "../utils.js"
import ManagerProducts from "../daos/mongodb/ProductsManager.class.js";
import ManagerMessage  from "../daos/mongodb/MessagesManager.class.js";
import ManagerCarts from "../daos/mongodb/CartManager.class.js";
import passport from "passport";

import userModel from "../daos/mongodb/models/users.model.js";

const managerProducts = new ManagerProducts();
const managerMessage = new ManagerMessage();
const managerCarts = new ManagerCarts();

const router = Router();

router.get("/cart", async (req, res) => {
    res.render("cart", { title: "Productos"});
});

router.get("/realtimeproducts", async (req, res) => {

    try {

        const limit = Number(req.query.limit);
        const page = Number(req.query.page);
        let sort = Number(req.query.sort);
        let filtro = req.query.filtro;
        let filtroVal = req.query.filtroVal;

        const products = await managerProducts.consultarProductos(limit, page, sort, filtro, filtroVal);

        res.render("realTimeProducts", {  title: "Productos Actualizados", products });
    } 
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({
            error: "Error al consultar los productos. Por favor, inténtelo de nuevo más tarde."
        });
    }
});

router.get("/chat", async (req, res) =>{

    // Traigo los mensajes:
    const messages = await managerMessage.verMensajes();

    // Renderizo la vista del chat con los Mensajes Actualizados:
    res.render("chat", { title: "Mensajes Actualizados", messages });

})

router.get('/register', (req, res) => {
    res.render('register');
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/api/user', passport.authenticate('jwt', { session: false }), async (req, res) => {

    try {
        // Aquí se accede a la información del usuario a través de req.user
        const user = await userModel.findOne({ email: req.user.email });

        // Traigo el carrito del usuario:
        const cart = await managerCarts.consultarCartPorId(user.cart);

        // Extraigo la ID del carrito del usuario:
        const cartID = cart._id;

        // Renderizamos el carrito con el carrito del usuario:
        res.send({ user, cartID});

    } catch (error) {
        // Manejo del error, si corresponde
        console.error(error);
        res.status(500).json({ error: "Error al cargar el carrito. Por favor, inténtelo de nuevo más tarde." });
    }











});

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {

    const user = await userModel.findOne({ email: req.user.email });

    if (!user) {
        return res.redirect('/login');
    }
    const { first_name, last_name, email, age, role } = user;
    res.render('profile', {
        user: {
            first_name,
            last_name,
            email,
            age,
            role
        }
    });
});


// Exportamos router: 
export default router;