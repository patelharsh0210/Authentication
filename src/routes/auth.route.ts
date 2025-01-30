import { Router } from "express"
import { createUser, login } from "../controllers/auth.controller";


const router = Router();

router.post("/register", createUser);
router.post("/login", login);



export default router;
