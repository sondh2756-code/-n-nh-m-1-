import express from "express";
import {
  signup,
  signin,
  signout,
  refresh,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Chuc nang: dang ky, dang nhap, dang xuat, lam moi accessToken
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.post("/refresh", refresh);

export default router;
