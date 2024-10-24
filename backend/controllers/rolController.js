import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//region createRol
/*
 * this controller is used to create a new Rol, it receives the name of the Rol in the request body
 * and then it creates the Rol in the database
 * if the name is not provided, it returns a 400 status code with an error message
 * if the Rol already exists, it returns a 400 status code with an error message
 * if the Rol is created successfully, it returns a 201 status code with the Rol object
 * if there is an error, it returns a 500 status code with the error message
 */
export const createRol = async (req, res) => {
  try {
    let { name } = req.body;
    name = name.toUpperCase();

    if (!name) {
      res.status(400).json({
        msg: "El nombre del Rol es requerido",
        title: "Error al crear el Rol",
        error: true,
      });
    } else {
      const rolExists = await prisma.rol.findFirst({
        where: {
          name,
        },
      });
      if (rolExists) {
        res.status(400).json({
          msg: "El Rol ya existe",
          title: "Error al crear el Rol",
          error: true,
        });
      } else {
        const rol = await prisma.rol.create({
          data: {
            name,
          },
        });
        res.status(201).json({ msg: rol, title: "Rol creado", error: false });
      }
    }
  } catch (error) {
    res.status(500).json({
      msg: error.message,
      title: "Error al crear el Rol",
      error: true,
    });
  }
};

//region getAllRoles
/*
 * this controller is used to get all the roles from the database
 * if there are no roles, it returns a 404 status code with an error message
 * if there are roles, it returns a 200 status code with the roles array
 * if there is an error, it returns a 500 status code with the error message
 */
export const getAllRoles = async (req, res) => {
  try {
    const roles = await prisma.rol.findMany();
    if (roles.length === 0) {
      res.status(404).json({
        msg: "No hay roles",
        title: "Error al obtener los roles",
        error: true,
      });
    } else {
      res.status(200).json({ msg: roles, title: "Roles", error: false });
    }
  } catch (error) {
    res.status(500).json({
      msg: error.message,
      title: "Error al obtener los roles",
      error: true,
    });
  }
};

//region getRolById
/*
 * this controller is used to get a Rol by its id, it receives the id in the request params
 * and then it searches for the Rol in the database
 * if the Rol is not found, it returns a 404 status code with an error message
 * if the Rol is found, it returns a 200 status code with the Rol object
 * if there is an error, it returns a 500 status code with the error message
 */
export const getRolById = async (req, res) => {
  try {
    const { id } = req.params;
    const rol = await prisma.rol.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!rol) {
      res.status(404).json({
        msg: "Rol no encontrado",
        title: "Error al obtener el Rol",
        error: true,
      });
    } else {
      res.status(200).json({ msg: rol, title: "Rol", error: false });
    }
  } catch (error) {
    res.status(500).json({
      msg: error.message,
      title: "Error al obtener el Rol",
      error: true,
    });
  }
};

//region updateRol
/*
 * this controller is used to update a Rol, it receives the id of the Rol in the request params
 * and the new name of the Rol in the request body
 * then it searches for the Rol in the database and updates its name
 * if the name is not provided, it returns a 400 status code with an error message
 * if the Rol is not found, it returns a 404 status code with an error message
 * if the Rol is updated successfully, it returns a 200 status code with the updated Rol object
 * if there is an error, it returns a 500 status code with the error message
 */
export const updateRol = async (req, res) => {
  try {
    const { id } = req.params;
    let { name } = req.body;
    name = name.toUpperCase();

    if (!name) {
      res.status(400).json({
        msg: "El nombre del Rol es requerido",
        title: "Error al actualizar el Rol",
        error: true,
      });
    } else {
      const rol = await prisma.rol.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      if (!rol) {
        res.status(404).json({
          msg: "Rol no encontrado",
          title: "Error al actualizar el Rol",
          error: true,
        });
      } else {
        const updatedRol = await prisma.rol.update({
          where: {
            id: parseInt(id),
          },
          data: {
            name,
          },
        });
        res
          .status(200)
          .json({ msg: updatedRol, title: "Rol actualizado", error: false });
      }
    }
  } catch (error) {
    res.status(500).json({
      msg: error.message,
      title: "Error al actualizar el Rol",
      error: true,
    });
  }
};

//region deleteRol
/*
 * this controller is used to delete a Rol, its a soft delete, it means that the Rol is not removed from the database
 * then it searches for the Rol in the database and deletes it
 * if the Rol is not found, it returns a 404 status code with an error message
 * if the Rol is deleted successfully, it returns a 200 status code with a success message
 * if there is an error, it returns a 500 status code with the error message
 */

export const deleteRol = async (req, res) => {
  try {
    const { id } = req.params;
    const rol = await prisma.rol.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!rol) {
      res.status(404).json({
        msg: "Rol no encontrado",
        title: "Error al eliminar el Rol",
        error: true,
      });
    } else {
      const deletedRol = await prisma.rol.update({
        where: {
          id: parseInt(id),
        },
        data: {
          status: !rol.status,
        },
      });
      res.status(200).json({
        msg: deletedRol,
        title: "Rol eliminado",
        error: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: error.message,
      title: "Error al eliminar el Rol",
      error: true,
    });
  }
};
