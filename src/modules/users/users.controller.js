import { Router } from "express";
import * as Us from "./users.service.js";
import { authentication } from "../../common/middleware/authentication.js";
import { authorization } from "../../common/middleware/authorization.js";
import { RoleEnum } from "../../common/enum/user.enum.js";
import { Validation } from "../../common/middleware/validation.js";
import { signUpSchema } from "./user.validation.js";
import { signinSchema } from "./user.validation.js";
import { multerlocal } from "../../common/middleware/multer.js";
const userRouter = Router()


userRouter.post("/signUp",
    multerlocal({ customPath: "admins", customTypes:  ["image/jpeg", "image/png", "image/jpg"]}).fields([
        { name: "attachment", maxCount: 1},
        {name: "attachments", maxCount:5}
    ]),Validation(signUpSchema), Us.signUp);
userRouter.post("/signUp/gmail", Us.signUpWithGmail);
userRouter.post("/signin",Validation(signinSchema), Us.signin);
userRouter.get("/Profile",authentication,authorization(Object.values(RoleEnum)), Us.getProfile);


export default userRouter;
