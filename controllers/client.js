import Client from "../models/client.js";
import bcrypt from "bcrypt";
import { createJwtToken } from "../utils/token.js";



//  Client singup controller
export const signUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await Client.findOne({ email: email });

    if (userExists) {
      throw new Error(`Email already in use`);
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    req.body.password = hashPassword;

    const newClient = await Client.create({ ...req.body });

    return res
      .status(200)
      .send({ message: "client created successfully", data: newClient._id });
  } catch (error) {
    next(error);
  }
};

export const  signIN = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(req.body)
    const userExists = await Client.findOne({ email: email });
    if (!userExists) {
      throw new Error("User not found");
    }
    const isValid = await bcrypt.compare(password, userExists.password);
    if (!isValid) {
      throw new Error("Invalid password");
    }
    const token = createJwtToken({ user: userExists._id });
    return res
      .status(200)
      .json({ message: "Successfull Login", token: token, data: userExists });
  } catch (error) {
    next(error);
  }
};

export const resetPass = async (req, res, next) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    const clientExists = await Client.findOne({ email: email });

    if (!clientExists) {
      throw new Error(`User not found`);
    }
    if (newPassword !== confirmPassword) {
      throw new Error(`Passwords do not match`);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    clientExists.password = hashedPassword;
    await clientExists.save();

    return res.status(200).send({ message: "Password changed" });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  return res.status(200).send(req.user);
};


