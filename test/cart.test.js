import mongoose from "mongoose";
import supertest from "supertest";
import envConfig from "../src/config/env.config.js";
import cartServices from "../src/services/cart.services.js";
import { expect } from "chai";

const requester = supertest(`http://localhost:${envConfig.PORT}`);

describe("Test Cart Controllers", () => {
    let cartId;
    let cookie;

    before(async () => {
     
        const loginUser = {
            email: "usuario3@test.com",
            password: "12347",
        };

        const { headers } = await requester.post("/api/session/login").send(loginUser);
        const cookieResult = headers["set-cookie"][0];

        cookie = {
            name: cookieResult.split("=")[0],
            value: cookieResult.split("=")[1],
        };

        
        const cartResponse = await requester.post("/api/carts").set("Cookie", [`${cookie.name}=${cookie.value}`]);
        cartId = cartResponse.body.payload._id;
    });

    it("[POST] /api/carts debe crear un nuevo carrito", async () => {
        const { status, _body, ok } = await requester
            .post("/api/carts")
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);

        expect(status).to.be.equal(201);
        expect(ok).to.be.equal(true);
        expect(_body.payload).to.have.property("_id");
    });

    it("[POST] /api/carts/:cid/product/:pid debe agregar un producto al carrito", async () => {
        const newProduct = {
            title: "Producto Test",
            description: "Este es un producto Test",
            price: 300,
            thumbnail: ["http://www.google.com/img"],
            code: "ABC123",
            stock: 50,
        };

        const productResponse = await requester
            .post("/api/products")
            .send(newProduct)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);

        const productId = productResponse.body.payload._id;

        const { status, _body, ok } = await requester
            .post(`/api/carts/${cartId}/product/${productId}`)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);

        expect(status).to.be.equal(200);
        expect(ok).to.be.equal(true);
        expect(_body.payload).to.have.property("products").that.is.an("array").with.lengthOf(1);
    });

    it("[PUT] /api/carts/:cid/product/:pid debe actualizar la cantidad de un producto en el carrito", async () => {
        const newProduct = {
            title: "Producto Test",
            description: "Este es un producto Test",
            price: 300,
            thumbnail: ["http://www.google.com/img"],
            code: "ABC123",
            stock: 50,
        };

        const productResponse = await requester
            .post("/api/products")
            .send(newProduct)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);

        const productId = productResponse.body.payload._id;

        await requester
            .post(`/api/carts/${cartId}/product/${productId}`)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);

        const updateData = { quantity: 2 };
        const { status, _body, ok } = await requester
            .put(`/api/carts/${cartId}/product/${productId}`)
            .send(updateData)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);

        expect(status).to.be.equal(200);
        expect(ok).to.be.equal(true);
        expect(_body.payload.products[0].quantity).to.equal(2);
    });

    it("[DELETE] /api/carts/:cid/product/:pid debe eliminar un producto del carrito", async () => {
        const newProduct = {
            title: "Producto Test",
            description: "Este es un producto Test",
            price: 300,
            thumbnail: ["http://www.google.com/img"],
            code: "ABC123",
            stock: 50,
        };

        const productResponse = await requester
            .post("/api/products")
            .send(newProduct)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);

        const productId = productResponse.body.payload._id;

        await requester
            .post(`/api/carts/${cartId}/product/${productId}`)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);

        const { status, _body, ok } = await requester
            .delete(`/api/carts/${cartId}/product/${productId}`)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);

        expect(status).to.be.equal(200);
        expect(ok).to.be.equal(true);
        expect(_body.payload.products).to.not.include(productId);
    });

    it("[GET] /api/carts/:cid debe devolver un carrito por id", async () => {
        const { status, _body, ok } = await requester
            .get(`/api/carts/${cartId}`)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);

        expect(status).to.be.equal(200);
        expect(ok).to.be.equal(true);
        expect(_body.payload).to.have.property("_id", cartId);
    });

    it("[DELETE] /api/carts/:cid/product debe eliminar todos los productos del carrito", async () => {
        const { status, _body, ok } = await requester
            .delete(`/api/carts/${cartId}/products`)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);

        expect(status).to.be.equal(200);
        expect(ok).to.be.equal(true);
        expect(_body.payload.products).to.be.empty;
    });

    it("[POST] /api/carts/:cid/purchase debe comprar el carrito", async () => {
        const newProduct = {
            title: "Producto Test",
            description: "Este es un producto Test",
            price: 300,
            thumbnail: ["http://www.google.com/img"],
            code: "ABC123",
            stock: 50,
        };

        const productResponse = await requester
            .post("/api/products")
            .send(newProduct)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);

        const productId = productResponse.body.payload._id;

        await requester
            .post(`/api/carts/${cartId}/product/${productId}`)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);

        const { status, _body, ok } = await requester
            .post(`/api/carts/${cartId}/purchase`)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);

        expect(status).to.be.equal(200);
        expect(ok).to.be.equal(true);
        expect(_body.payload).to.have.property("ticket");
    });

    after(async () => {
        
        await cartServices.deleteAll(); 
        mongoose.disconnect();
    });
});
