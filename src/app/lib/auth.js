import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User";
import dbConnect from "./dbConnect";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// JWT Token functions
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// Password functions
export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// Authentication functions
export async function getUserFromToken(req) {
  await dbConnect();
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    return user || null;
  } catch (err) {
    return null;
  }
}

export function authenticate(request) {
  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }
  const token = authHeader.split(" ")[1];
  const payload = jwt.verify(token, JWT_SECRET);
  return payload.userId;
}
