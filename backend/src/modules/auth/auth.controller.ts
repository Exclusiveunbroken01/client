import type { Request, Response } from "express";
import * as authService from "./auth.service.js";
import type { LoginInput, RegisterInput } from "./auth.types.js";

/*
|--------------------------------------------------------------------------
| Register User
|--------------------------------------------------------------------------
*/

export const register = async (req: Request, res: Response) => {
  const data: RegisterInput = req.body;

  const result = await authService.register(data);

  res.status(201).json({
    success: true,
    message: "Registration successful! You can now log in.",
    data: result,
  });
};

/*
|--------------------------------------------------------------------------
| Login User
|--------------------------------------------------------------------------
*/

export const login = async (req: Request, res: Response) => {
  try {
    const data: LoginInput = req.body;
    const result = await authService.login(data);

    const cookieOptions = {
      httpOnly: true,
      // Must be true for SameSite: none
      // In production, ensure your site is on HTTPS
      secure: true, 
      sameSite: "none" as const, 
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      path: "/",
    };

    // 1. Set JWT as HTTP-only cookie
    res.cookie("token", result.token, cookieOptions);

    // 2. UI-flag cookie (Accessible to JS)
    res.cookie("isLoggedIn", "true", {
      ...cookieOptions,
      httpOnly: false, // Allow client-side JS to see this flag
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { user: result.user },
    });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
};

/*
|--------------------------------------------------------------------------
| Logout User
|--------------------------------------------------------------------------
*/

export const logout = (req: Request, res: Response) => {
  const clearOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
    path: '/', 
  };

  res.clearCookie('token', clearOptions);
  res.clearCookie('isLoggedIn', { ...clearOptions, httpOnly: false });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
};
