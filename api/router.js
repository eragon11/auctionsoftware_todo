
import userRouter from './modules/User/user.route';
import userAuthRouter from './modules/UserAuth/userAuth.route';
let router = [];

router.push(userRouter);
router.push(userAuthRouter);

export default router;