import express from "express";
import { Server } from "socket.io";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import { __dirname } from "./utils.js";
import { ProductManager } from "./dao/ProductManager.js";
import mongoose from "mongoose";
import Message from "./dao/models/messageModel.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import loginRouter from "./routes/login.routes.js";
import signupRouter from "./routes/signup.routes.js";
import sessionRouter from "./routes/session.routes.js";

dotenv.config()

const app = express();
const PORT = 8080;
const DB_URL = process.env.DB_URL;
const productManager = new ProductManager("productos.json");
const COOKIESECRET = process.env.CODERSECRET;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser(COOKIESECRET));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/", viewsRouter);

const server = app.listen(PORT, () => {
  console.log("servidor esta iniciado en " + PORT);
});

const socketServer = new Server(server);

socketServer.on("connection", (socket) => {
  console.log("cliente conectado, puede trabajar");
  socket.on("addProduct", async (product) => {
    const title = product.title;
    const description = product.description;
    const price = product.price;
    const thumbnail = product.thumbnail;
    const code = product.code;
    const stock = product.stock;
    try {
      const result = await productManager.addProduct(
        title,
        description,
        price,
        thumbnail,
        code,
        stock
      );
      const allProducts = await productManager.getProducts();
      console.log(allProducts);
      result && socketServer.emit("updateProducts", allProducts);
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("deleteProduct", async (id) => {
    console.log(id);
    try {
      const result = await productManager.deleteProductById(id);
      const allProducts = await productManager.getProducts();
      console.log(allProducts);
      result && socketServer.emit("updateProducts", allProducts);
    } catch (err) {
      console.log(err);
    }
  });
});



 Message.find({}, (err, messages) => {
  if (!err) {
    socket.emit("chatMessages", messages);
  }
});
socket.on("chatMessage", async (data) => {
  try {
    const newMessage = new Message({ user: data.user, message: data.message });
    await newMessage.save();
    socketServer.emit("chatMessage", newMessage);
  } catch (err) {
    console.log(err);
  }
});
socket.on("disconnect", () => {
  console.log("Usuario desconectado");
});




app.use(
  session({
    store: MongoStore.create({
      mongoUrl: DB_URL,
      mongoOptions: {
        useNewUrlParser: true,
      },
      ttl: 600,
    }),
    secret: COOKIESECRET,
    resave: false,
    saveUninitialized: true,
  })
);


initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/session", sessionRouter);
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
const environment = async () => {
  try {
    await mongoose.connect(DB_URL);
  } catch (error) {
    console.log(error);
  }
};

environment();

mongoose.connect(DB_URL)
  .then(() => {
    console.log("Base de datos conectada");
  })
  .catch((error) => {
    console.log("Error en conexión a base de datos", error);
  });



