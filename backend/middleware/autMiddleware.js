import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  try {
    console.log("token", token);
    const decoded = jwt.decode(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      return res.status(401).json({ message: "Token inválido o ha expirado" });
    } else {
      next();
    }
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o ha expirado" });
  }
};
export default authMiddleware;
