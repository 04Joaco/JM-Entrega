import { Router } from "express";
import { CartManager } from "../dao/CartManager.js";

const router = Router();
const cartManager = new CartManager("carts.json");

// Obtener todos los carritos
router.get("/", async (req, res) => {
  try {
    let response = await cartManager.getCarts();
    res.json({ data: response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error", data: err });
  }
});

// Obtener un carrito por ID
router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartManager.getCartById(cid);
    await cart.populateProducts(); 
    res.json({ data: cart });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error", data: err });
  }
});

// Crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const response = await cartManager.addCart();
    res.json({ message: "success", data: response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error", data: err });
  }
});

// Agregar un producto a un carrito específico
router.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const response = await cartManager.addProductToCart(cid, pid);
    res.json({ message: "success", data: response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error", data: err });
  }
});

// Eliminar un producto de un carrito específico
router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const response = await cartManager.removeProductFromCart(cid, pid);
    res.json({ message: "success", data: response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error", data: err });
  }
});

// Actualizar la cantidad de un producto en un carrito específico
router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const response = await cartManager.updateProductQuantity(cid, pid, quantity);
    res.json({ message: "success", data: response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error", data: err });
  }
});

// Eliminar todos los productos de un carrito específico
router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const response = await cartManager.removeAllProductsFromCart(cid);
    res.json({ message: "success", data: response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error", data: err });
  }
});

export default router;