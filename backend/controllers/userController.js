import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateToken } from "../tools/generateToken.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config("../");

const prisma = new PrismaClient();
const saltRounds = 10;
//region  CreateUser
/*
 * This controller will create a new user in the database.
 * will receive the name, email and password of the user in the request body.
 * If any of the fields is missing, it will return a 400 status code with an error message.
 * It will check if the user already exists in the database, if it does it will return 400 status code with an error message.
 * If the user is created successfully, it will return a 201 status code with the user data.
 * If an error occurs, it will return a 500 status code with an error message.
 */
export const createUser = async (req, res) => {
  const { name, email, password, rolId } = req.body;
  if (!name || !email || !password || !rolId) {
    res.status(400).json({
      msg: "Todos los campos son requeridos",
      title: "Error al crear el usuario",
      error: true,
    });
  }

  try {
    //check if the user already exists
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user) {
      res.status(400).json({
        msg: "El usuario ya existe",
        title: "Error al crear el usuario",
        error: true,
      });
    }
    const nameUppercase = name.toUpperCase();

    //encrypt the password

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await prisma.user.create({
      data: {
        name: nameUppercase,
        email,
        password: hashedPassword,
        rolId,
      },
    });
    newUser.password = undefined;
    res.status(201).json({
      msg: newUser,
      title: "Usuario creado correctamente",
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
      title: "Error al crear el usuario",
      error: true,
    });
  }
};

//region GetAllUsers
/*
 * This controller will get all users from the database.
 * If the users are obtained successfully, it will return a 200 status code with the users data.
 * If an error occurs, it will return a 500 status code with an error message.
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    users.map((user) => {
      user.password = undefined;
    });
    res.status(200).json({
      msg: users,
      title: "Usuarios obtenidos correctamente",
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      title: "Error al obtener los usuarios",
      msg: error.message,
      error: true,
    });
  }
};

//region getUserById
/*
 * This controller will get a user by its id from the database.
 * It will receive the user id in the request params.
 * If the user is not found, it will return a 404 status code with an error message.
 * If the user is obtained successfully, it will return a 200 status code with the user data.
 * If an error occurs, it will return a 500 status code with an error message.
 */
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      res.status(400).json({
        msg: "El id es requerido",
        title: "Error al obtener el usuario",
        error: true,
      });
    }
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    if (!user) {
      res.status(404).json({
        msg: "Usuario no encontrado",
        title: "Error al obtener el usuario",
        error: true,
      });
    }
    user.password = undefined;
    res.status(200).json({
      msg: user,
      title: "Usuario obtenido correctamente",
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      title: "Error al obtener el usuario",
      msg: error.message,
      error: true,
    });
  }
};

//region updateUser
/*
 * This controller will update a user in the database.
 * It will receive the user id in the request params and the name, email and password of the user in the request body.
 * If any of the fields is missing, it will return a 400 status code with an error message.
 * If the user is not found, it will return a 404 status code with an error message.
 * If the user is updated successfully, it will return a 200 status code with the user data.
 * If an error occurs, it will return a 500 status code with an error message.
 */
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  try {
    //check if the user already exists
    const userExists = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    if (!userExists) {
      res.status(404).json({
        msg: "Usuario no encontrado",
        title: "Error al actualizar el usuario",
        error: true,
      });
    }

    // Hash password
    const dataToUpdate = {
      name,
      email,
    };

    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, saltRounds);
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });
    updatedUser.password = undefined;
    res.status(200).json({
      msg: updatedUser,
      title: "Usuario actualizado correctamente",
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      title: "Error al actualizar el usuario",
      msg: error.message,
      error: true,
    });
  }
};

//region deleteUser
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      res.status(400).json({
        msg: "El id es requerido",
        title: "Error al eliminar el usuario",
        error: true,
      });
    }
    const userExists = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    if (!userExists) {
      res.status(404).json({
        msg: "Usuario no encontrado",
        title: "Error al eliminar el usuario",
        error: true,
      });
    }
    // if exist logical delete
    const deleteUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        status: !userExists.status,
      },
    });
    deleteUser.password = undefined;

    res.status(200).json({
      msg: deleteUser,
      title: "Usuario eliminado correctamente",
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
      title: "Error al eliminar el usuario",
      error: true,
    });
  }
};

//region Login
/*
 * this controller will receive the email and password of the user in the request body.
 * If any of the fields is missing, it will return a 400 status code with an error message.
 * It will check if the user exists in the database, if it does not it will return a 404 status code with an error message.
 * It will check if the password is correct, if it is not it will return a 400 status code with an error message.
 * If the user is logged in successfully, it will return a 200 status code with the user data.
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        msg: "Todos los campos son requeridos",
        title: "Error al iniciar sesión",
        error: true,
      });
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      res.status(404).json({
        msg: "Usuario no encontrado",
        title: "Error al iniciar sesión",
        error: true,
      });
    }
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      res.status(400).json({
        msg: "Contraseña incorrecta",
        title: "Error al iniciar sesión",
        error: true,
      });
    }
    //generate token
    const token = generateToken(user.id);
    const userWithToken = prisma.user.update({
      where: { id: user.id },
      data: { token },
    });
    user.password = undefined;
    user.token = token;
    res.status(200).json({
      msg: user,
      title: "Inicio de sesión correcto",
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
      title: "Error al iniciar sesión",
      error: true,
    });
  }
};
//region getUserByToken
/*
 * this controller will receive the token in the body of the request.
 * If the token is missing, it will return a 400 status code with an error message.
 * If the token is invalid, it will return a 401 status code with an error message.
 * If the token is valid, it will return a 200 status code with the user data.
 */
export const getUserByToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        msg: "El token es requerido",
        title: "Error al verificar el token",
        error: true,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        msg: "Token inválido o ha expirado",
        title: "Error al verificar el token",
        error: true,
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(404).json({
        msg: "Usuario no encontrado",
        title: "Error al verificar el token",
        error: true,
      });
    }

    user.password = undefined;

    return res.status(200).json({
      msg: user,
      title: "Token verificado correctamente",
      error: false,
    });
  } catch (error) {
    console.error("Error al verificar el token:", error);

    return res.status(500).json({
      msg: error.message,
      title: "Error al verificar el token",
      error: true,
    });
  }
};
