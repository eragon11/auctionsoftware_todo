import UserService from "../User/user.service"
import UserAuthService from "../UserAuth/userAuth.service";
import logger from "../../config/logger.config";
import sha256 from "sha256";
import uuidv1 from "uuid/v1";
import * as _ from "lodash";
import path from "path";
import * as fs from "fs";
import settings from "../../settings";
import EmailService from "../commonServices/email.service";

let config = require("../../config/" + settings.environment + ".config");

const WEB_ENDPOINT = config.default.web_end_point;

const SOURCE_EMAIL = config.default.email.auth.user;

const UserAuthController = {
    login: async (req, res) => {
        try {
            let email_id = req.body.email_id;
            let password = req.body.password;
            let loggedInUser = await UserService.getUserByEmailId(email_id);

            if (loggedInUser) {
                if (loggedInUser.password === sha256(password)) {
                    if (loggedInUser.status === "active") {
                        let payload = {
                            user_id: loggedInUser._id,
                            name: loggedInUser.name,
                            email: loggedInUser.email,
                            city: loggedInUser.city,
                            is_admin: loggedInUser.is_admin
                        };
                        res.send({
                            code: 200,
                            status: "success",
                            message: "Sucessfull Login",
                            data: await UserAuthService.getJwtToken(payload),

                        });
                    } else {
                        res.status(401).send({
                            code: 401,
                            status: "error",
                            data: [],
                            message: "Kindly activate your account to login."
                        });
                    }
                } else {
                    res.status(401).send({
                        code: 401,
                        status: "error",
                        data: [],
                        message: "Invalid Password"
                    });
                }
            } else {
                res.status(401).send({
                    code: 401,
                    status: "error",
                    data: [],
                    message: "Invalid Username"
                });
            }
        } catch (error) {
            console.log(error)
            res.status(401).send({
                code: 401,
                status: "error",
                message: "Invalid Username/Password",
                data: []
            });
        }
    },

    verify: async (req, res, next) => {
        let tokenSignature = req.headers["x-auth-token"] || req.headers["authorization"];
        if (tokenSignature != undefined) {
            let token = await (UserAuthService.verifyAndDecode(tokenSignature));
            req.userToken = token;
            if (token.valid) {
                let user = await UserService.getUserByUserId(token.data.id);
                let loggedInUser = user[0];
                let payload = getPayload(loggedInUser);
                let logInData = await UserAuthService.getUpdatedJwtToken(payload, tokenSignature);
                req.userToken.data = logInData;
                res.setHeader('x-auth-token', logInData.token);
                return next();
            } else {
                res.status(401).send({
                    status: "error",
                    code: 401,
                    message: "Token Invalid"
                });
            }
        } else {
            res.status(401).send({
                status: "error",
                code: 401,
                message: "Authentication Failure"
            });
        }
    },

    signup: async (req, res) => {
        try {
            let User = {};
            User.name = req.body.name;
            User.mobile_number = req.body.mobile_number;
            User.email = req.body.email;
            User.email = User.email.toLowerCase();
            User.city = req.body.city;
            User.password = req.body.password;
            User.dob = req.body.dob;
            User.gender = req.body.gender;
            User.designation = req.body.designation;
            let userEmailExists = await UserService.getUserByEmailId(req.body.email);
            if (!_.isEmpty(userEmailExists)) {
                return res.status(400).send({
                    code: 400,
                    status: "error",
                    message: "User/Email id already exists",
                    data: []
                });
            }
            let savedUser = await UserService.addUser(User);
            User.user_id = savedUser._id;
            let logInData = await UserAuthService.getJwtToken(User);
            //Send email Verification
            await sendEmailVerification(savedUser.email, logInData.token, req.body.password);

            delete logInData.password;
            res.setHeader("x-auth-token", logInData.token);

            res.status(200).send({
                code: 200,
                status: "success",
                message: "Sucessfully Signed Up",
                data: logInData
            });
        } catch (error) {
            logger.error("Error in sign up" + error);
            res.status(400).send({
                code: 400,
                status: "error",
                message: "Error in sign Up:" + error.message,
                data: []
            });
        }
    },

    forgetPassword: async (req, res) => {
        try {
            let email_id = req.params.email_id;

            let User = await UserService.getUserByEmailId(email_id);

            if (User) {
                let FORGET_PASSWORD_HTML = await fs.readFileSync(
                    path.join(__dirname, "../../../EmailTemplates/forgetPassword.html"),
                    "utf-8"
                );

                FORGET_PASSWORD_HTML = FORGET_PASSWORD_HTML.replace(
                    "FORGET_PASSWORD_URL",
                    web_end_point +
                    "/auth/change_password/email/" +
                    encodeURIComponent(email_id) +
                    "/uuid/" +
                    encodeURIComponent(User.password_uuid)
                );

                EmailService.SendEmail(
                    "notexists@sample_notexists.com",
                    email_id,
                    "Change Password",
                    FORGET_PASSWORD_HTML
                );

                return res.status(200).send({
                    status: "success",
                    code: 200,
                    message:
                        "Forgot password email sent successfully for the registered email " +
                        email_id,
                    data: []
                });
            } else {
                return res.status(400).send({
                    status: "error",
                    code: 200,
                    message: "Email id not found :  " + email_id,
                    data: []
                });
            }
        } catch (error) {
            return res.status(400).send({
                status: "error",
                code: 200,
                message:
                    "Error in forgot password request  :" +
                    req.params.email_id +
                    " : " +
                    error,
                data: []
            });
        }
    },

    changePassword: async (req, res) => {
        try {
            let email_id = req.body.email_id;
            let new_password = req.body.password;

            let User = await UserService.getUserByEmailId(email_id);

            let user = {
                password: await sha256(new_password),
                password_uuid: uuidv1()
            };

            let updatedUser = await UserService.updateUserById(User._id, user);

            return res.status(200).send({
                status: "success",
                code: 200,
                message: "Password Changed Successfully. " + email_id,
                data: []
            });
        } catch (error) {
            return res.status(400).send({
                status: "error",
                code: 200,
                message:
                    "Error in password change  :" + req.body.email_id + " : " + error,
                data: []
            });
        }
    },

    verifyEmail: async (req, res) => {
        try {
            let email_id = req.params.email_id;
            let uuid = req.params.uuid;

            let User = await UserService.getUserByEmailId(email_id);

            if (User.status === "active") {
                return res.status(400).send({
                    status: "error",
                    code: 200,
                    message: "User Email has been verified already",
                    data: []
                });
            }

            if (User.password_uuid === uuid) {
                let user = {
                    status: "active",
                    password_uuid: uuidv1()
                };

                let updatedUser = await UserService.updateUserById(User._id, user);

                return res.status(200).send({
                    status: "success",
                    code: 200,
                    message: "Your email " + email_id + " has been verified successfully",
                    data: []
                });
            } else {
                return res.status(400).send({
                    status: "error",
                    code: 200,
                    message: "Unauthorized verification",
                    data: []
                });
            }
        } catch (error) {
            return res.status(400).send({
                status: "error",
                code: 200,
                message:
                    "Error in Email Verification  :" +
                    req.params.email_id +
                    " : " +
                    error,
                data: []
            });
        }
    },
}

let getPayload = function (loggedInUser) {
    let payload = {
        id: loggedInUser.id,
        first_name: loggedInUser.first_name,
        last_name: loggedInUser.last_name,
        email: loggedInUser.email
    };
    return payload;
};

let sendEmailVerification = async (email, verification_uuid, password) => {
    let REGISTRATION_SUCCESS_HTML = await fs.readFileSync(
        path.join(__dirname, "../EmailTemplates/emailVerification.html"),
        "utf-8"
    );


    REGISTRATION_SUCCESS_HTML = REGISTRATION_SUCCESS_HTML.replace(
        "EMAIL_VERIFICATION_URL",
        WEB_ENDPOINT +
        "/verification/email/" +
        encodeURIComponent(email) +
        "/verify/" +
        "id/" +
        encodeURIComponent(verification_uuid)
    ).replace("YOUR_PASSWORD", password);

    EmailService.SendEmail(
        SOURCE_EMAIL,
        email,
        "REGISTRATION SUCCESS : VERIFY YOUR EMAIL",
        REGISTRATION_SUCCESS_HTML
    );

    return;
};

export default UserAuthController;