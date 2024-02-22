import { Router } from "express";
import { ProductManager } from "../dao/ProductManager.js";

const router = Router();
const productManager = new ProductManager("productos.json");

// Método GET / para obtener productos con filtros, paginación y ordenamientos
router.get("/", async (req, res) => {
  try {
    // Obtener los parámetros de la consulta
    const { limit = 10, page = 1, sort, query } = req.query;

    // Lógica para obtener productos según los parámetros
    const result = await productManager.getProducts({ limit, page, sort, query });

    // Enviar la respuesta con el formato requerido
    res.json({
      status: 'success',
      payload: result.products,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.prevLink,
      nextLink: result.nextLink,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Método GET /:pid para obtener un producto por ID
router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    let product = await productManager.getProductById(pid);

    if (product) {
      res.json({ status: "success", data: product });
    } else {
      res.status(404).json({
        status: "error",
        message: "El producto solicitado no existe",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Método POST / para agregar un nuevo producto
router.post("/", async (req, res) => {
  const { title, description, price, thumbnail, code, stock } = req.body;

  try {
    const result = await productManager.addProduct(
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    );
    res.status(201).json({ status: 'success', data: result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Método PUT /:pid para actualizar un producto por ID
router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const { title, description, price, thumbnail, code, stock } = req.body;

  try {
    let product = await productManager.getProductById(pid);
    if (product) {
      let newProduct = {
        title: title || product.title,
        description: description || product.description,
        price: price || product.price,
        thumbnail: thumbnail || product.thumbnail,
        code: code || product.code,
        stock: stock || product.stock,
      };
      const response = await productManager.updateProductById(pid, newProduct);
      res.json({ status: 'success', data: response });
    } else {
      res.status(404).json({
        status: 'error',
        message: "El producto solicitado no existe",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Método DELETE /:pid para eliminar un producto por ID
router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    let product = await productManager.getProductById(pid);

    if (product) {
      const response = await productManager.deleteProductById(pid);
      res.json({ status: 'success', data: response });
    } else {
      res.status(404).json({
        status: 'error',
        message: "El producto solicitado no existe",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
