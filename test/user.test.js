import mongoose from "mongoose";
import envConfig from "../src/config/env.config.js";
import userRepository from "../src/persistences/mongo/repositories/user.repository.js";
import { expect } from "chai";

// Conectar a la base de datos antes de ejecutar las pruebas
before(async () => {
    await mongoose.connect(envConfig.MONGO_URL);
});

describe("Test User Repository", () => {
    let userId;
    let userEmail;

    it("Obtener todos los usuarios", async () => {
        const users = await userRepository.getAll();
        expect(users).to.be.an("array");
    });

    it("Crear un usuario", async () => {
        const newUser = {
            first_name: "User test",
            last_name: "Test",
            email: "user-test@test.com",
            password: "123",
            age: 20,
        };

        const user = await userRepository.create(newUser);
        userId = user._id;
        userEmail = user.email;

        expect(user.first_name).to.equal("User test");
        expect(user.last_name).to.equal("Test");
        expect(user.email).to.equal("user-test@test.com");
        expect(user.password).to.equal("123");
        expect(user.role).to.equal("user");
    });

    it("Intentar crear un usuario con un correo electrónico existente", async () => {
        const newUser = {
            first_name: "Another User",
            last_name: "Test",
            email: "user-test@test.com", // Correo ya existente
            password: "456",
            age: 25,
        };

        try {
            await userRepository.create(newUser);
        } catch (error) {
            expect(error).to.exist;
            expect(error.message).to.include("duplicate key error");
        }
    });

    it("Obtener un usuario por id", async () => {
        const user = await userRepository.getById(userId);
        expect(user).to.be.an("object");
        expect(user.email).to.equal("user-test@test.com");
        expect(user.password).to.not.equal("asdfqwe");
        expect(user.password).to.not.an("number");
    });

    it("Intentar obtener un usuario con un id que no existe", async () => {
        const user = await userRepository.getById("nonExistingId");
        expect(user).to.be.null;
    });

    it("Obtener un usuario por email", async () => {
        const user = await userRepository.getByEmail(userEmail);
        expect(user).to.be.an("object");
        expect(user.email).to.equal("user-test@test.com");
        expect(user.password).to.not.equal("asdfqwer");
        expect(user.password).to.not.an("number");
    });

    it("Actualizar usuario", async () => {
        const user = await userRepository.update(userId, {
            first_name: "User Update",
            last_name: "Update",
            age: 50,
        });
        expect(user.first_name).to.equal("User Update");
        expect(user.last_name).to.equal("Update");
        expect(user.age).to.not.equal(20);
    });

    it("Eliminar un usuario por id", async () => {
        await userRepository.deleteOne(userId);
        const user = await userRepository.getById(userId);
        expect(user).to.be.null;
    });

    after(async () => {
        console.log("Se ejecuta al finalizar todos los test");
        await mongoose.disconnect();
    });
});
