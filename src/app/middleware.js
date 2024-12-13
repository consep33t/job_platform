import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = "sangatrahasia123321";

export function middleware(req) {
  const token = req.cookies.get("token");

  if (!token) {
    return NextResponse.redirect("/login");
  }

  try {
    jwt.verify(token, SECRET_KEY);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect("/login");
  }
}
