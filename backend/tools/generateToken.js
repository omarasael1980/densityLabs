/*
 *  this function receives an id and generates a JWT token with that id as payload
 */

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (id) => {
  const payload = { id };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return token;
};
