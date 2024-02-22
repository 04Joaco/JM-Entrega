import { ProductManager } from "./ProductManager.js";
import { __dirname } from "./utils.js";

console.log("dirname", __dirname);
let myFirstStore = new ProductManager("/productos.json");
myFirstStore.getProducts().then((data) => console.log(data));