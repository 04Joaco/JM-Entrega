import crypto from "crypto";
import utils from "../utils.js";

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async addCart() {
    try {
      let data = await utils.readFile(this.path);
      const carts = data?.length > 0 ? data : [];
      const id = crypto.randomUUID();

      const newCart = {
        id,
        timestamp: Date.now(),
        products: [],
      };

      carts.push(newCart);
      await utils.writeFile(this.path, carts);

      return newCart;
    } catch (error) {
      console.log(error);
      throw new Error("Error al agregar el carrito");
    }
  }

  async getCarts() {
    try {
      let data = await utils.readFile(this.path);
      const carts = data?.length > 0 ? data : [];

      return carts?.length > 0 ? carts : "aun no hay registros";
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener los carritos");
    }
  }

  async getCartById(id) {
    try {
      let data = await utils.readFile(this.path);
      const carts = data?.length > 0 ? data : [];
      let cart = carts.find((dato) => dato.id === id);

      if (cart !== undefined) {
        return cart;
      } else {
        throw new Error("No existe el carrito solicitado");
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el carrito por ID");
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const cart = await this.getCartById(cid);
      const { products } = cart;
      const productIndex = products.findIndex(
        (product) => product.product === pid
      );

      if (productIndex !== -1) {
        products[productIndex].quantity++;
      } else {
        products.push({
          product: pid,
          quantity: 1,
        });
      }

      await this.updateCart(cart);
      return cart;
    } catch (err) {
      console.log(err);
      throw new Error("Error al agregar producto al carrito");
    }
  }

  async removeProductFromCart(cid, pid) {
    try {
      const cart = await this.getCartById(cid);
      const { products } = cart;
      const productIndex = products.findIndex(
        (product) => product.product === pid
      );

      if (productIndex !== -1) {
        products.splice(productIndex, 1);
        await this.updateCart(cart);
        return cart;
      } else {
        throw new Error("No existe el producto en el carrito");
      }
    } catch (err) {
      console.log(err);
      throw new Error("Error al eliminar producto del carrito");
    }
  }

  async updateProductQuantity(cid, pid, quantity) {
    try {
      const cart = await this.getCartById(cid);
      const { products } = cart;
      const productIndex = products.findIndex(
        (product) => product.product === pid
      );

      if (productIndex !== -1) {
        products[productIndex].quantity = quantity;
        await this.updateCart(cart);
        return cart;
      } else {
        throw new Error("No existe el producto en el carrito");
      }
    } catch (err) {
      console.log(err);
      throw new Error("Error al actualizar cantidad de producto en el carrito");
    }
  }

  async removeAllProductsFromCart(cid) {
    try {
      const cart = await this.getCartById(cid);
      cart.products = [];
      await this.updateCart(cart);
      return cart;
    } catch (err) {
      console.log(err);
      throw new Error("Error al eliminar todos los productos del carrito");
    }
  }

  async updateCart(cart) {
    const { id } = cart;
    const carts = await this.getCarts();
    const cartToUpdateIndex = carts.findIndex((carro) => carro.id === id);

    if (cartToUpdateIndex !== -1) {
      carts.splice(cartToUpdateIndex, 1, cart);
      await utils.writeFile(this.path, carts);
    } else {
      throw new Error("No existe el carrito solicitado");
    }
  }
}

export { CartManager };