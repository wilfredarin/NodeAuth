import bcrypt from "bcrypt";
// import { customErrorHandler } from "../middlewares/errorHandler.js";


export const compareHashedPassword = async (password, hashPassword, next) => {
  try {
    return await bcrypt.compare(password, hashPassword);
  } catch (error) {
    next(
      new customErrorHandler(
        400,
        "encounterd error in comparing hashed password"
      )
    );
  }
};
