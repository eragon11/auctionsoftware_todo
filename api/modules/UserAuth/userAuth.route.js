import express from "express";
import UserAuthController from "./userAuth.controller";
const router = express.Router();


//Authenticate user and provide token for login
router.post('/users/login', (req, res) => {
    return UserAuthController.login(req, res);
});

// Admin can signup with API
router.post('/users/signup', (req, res) => {
    return UserAuthController.signup(req, res);
});

// Forget password email
router.post('/users/forget_password/:email_id', (req, res) => {
    return UserAuthController.forgetPassword(req, res);
});

// Change password email
router.post('/users/change_password/:password_uuid', (req, res) => {
    return UserAuthController.changePassword(req, res);
});

// Verify email ID
router.post('/users/email/:email_id/verify/:uuid', (req, res) => {
    return UserAuthController.verifyEmail(req, res);
});

export default router;