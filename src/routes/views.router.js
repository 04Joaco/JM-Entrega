// Importa tus módulos y clases necesarios
import { Router } from "express";
import { ProductManager } from "../dao/ProductManager.js";
import { CartManager } from "../dao/CartManager.js"; // Asegúrate de importar tu CartManager correctamente

const router = Router();
const productManager = new ProductManager("productos.json");
const cartManager = new CartManager("carts.json"); // Asegúrate de inicializar tu CartManager

router.get("/products", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("products", {
      title: "Listado de productos",
      products: products,
      style: "css/products.css",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error", data: err });
  }
});

router.get("/realtime", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("realtime", {
      title: "Productos en tiempo real",
      products: products,
      style: "css/products.css",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error", data: err });
  }
});

// Nueva ruta para visualizar un carrito específico
router.get("/carts/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    // Obtén el carrito por ID
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      // Si el carrito no existe, puedes manejarlo según tus necesidades (redireccionar, mostrar un mensaje, etc.)
      res.render("cart", {
        title: "Carrito no encontrado",
        message: "El carrito solicitado no existe.",
      });
      return;
    }

    // Renderiza la vista del carrito con la información correspondiente
    res.render("cart", {
      title: `Carrito ${cid}`,
      cart: cart,
      // Incluir cualquier información adicional que desees mostrar en la vista del carrito.
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error", data: err });
  }
});

export default router;