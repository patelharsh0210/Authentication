import { Router } from "express"
import { createUser, login } from "../controllers/auth.controller.ts";


const router: Router = Router();

router.post("/register", createUser);
router.post("/login", login);



export default router;
