import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.SECRET_KEY_JWT);

export async function verifyToken(token?: string) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    // console.log("Token payload:", payload);
    return payload;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}
