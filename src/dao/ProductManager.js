import utils from "../utils.js";
import crypto from "crypto";

export class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error("Todos los campos son obligatorios");
    }

    try {
      let products = await utils.readFile(this.path);
      products = products?.length > 0 ? products : [];

      const codeExists = products.some((product) => product.code === code);

      if (codeExists) {
        throw new Error("El código ya existe, por favor verifique");
      }

      const newProduct = {
        id: crypto.randomUUID(),
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };

      products.push(newProduct);
      await utils.writeFile(this.path, products);

      return newProduct;
    } catch (error) {
      console.log(error);
      throw new Error("Error al agregar el producto");
    }
  }

  async getProducts({ limit = 10, page = 1, sort, query }) {
    try {
      let products = await utils.readFile(this.path);
      products = products?.length > 0 ? products : [];

      // Aplicar filtros si existen
      if (query) {
        products = products.filter((product) =>
          product.title.toLowerCase().includes(query.toLowerCase())
        );
      }

      // Aplicar ordenamiento si existe
      if (sort) {
        const orderFactor = sort.toLowerCase() === "asc" ? 1 : -1;
        products.sort((a, b) => orderFactor * (a.price - b.price));
      }

      // Calcular la cantidad total de páginas
      const totalPages = Math.ceil(products.length / limit);

      // Calcular el rango de productos para la página actual
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const currentProducts = products.slice(startIndex, endIndex);

      return {
        products: currentProducts,
        totalPages,
        prevPage: page - 1,
        nextPage: page + 1,
        page,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevLink: page > 1 ? `/products?limit=${limit}&page=${page - 1}` : null,
        nextLink: page < totalPages ? `/products?limit=${limit}&page=${page + 1}` : null,
      };
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener los productos");
    }
  }

  async getProductById(id) {
    try {
      let products = await utils.readFile(this.path);
      products = products?.length > 0 ? products : [];

      const product = products.find((product) => product.id === id);

      if (product) {
        return product;
      } else {
        throw new Error("No existe el producto solicitado");
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el producto por ID");
    }
  }

  async updateProductById(id, data) {
    try {
      let products = await utils.readFile(this.path);
      products = products?.length > 0 ? products : [];

      const productIndex = products.findIndex((product) => product.id === id);

      if (productIndex !== -1) {
        products[productIndex] = {
          ...products[productIndex],
          ...data,
        };

        await utils.writeFile(this.path, products);
        return {
          mensaje: "Producto actualizado",
          producto: products[productIndex],
        };
      } else {
        throw new Error("No existe el producto solicitado");
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error al actualizar el producto por ID");
    }
  }

  async deleteProductById(id) {
    try {
      let products = await utils.readFile(this.path);
      products = products?.length > 0 ? products : [];

      const productIndex = products.findIndex((product) => product.id === id);

      if (productIndex !== -1) {
        const product = products[productIndex];
        products.splice(productIndex, 1);

        await utils.writeFile(this.path, products);
        return { mensaje: "Producto eliminado", producto };
      } else {
        throw new Error("No existe el producto solicitado");
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error al eliminar el producto por ID");
    }
  }
}
