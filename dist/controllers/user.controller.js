"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const lodash_1 = __importDefault(require("lodash"));
const middleware_1 = require("../middleware");
const models_1 = require("../models");
const utils_1 = require("../utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_2 = require("../utils");
const send_mail_1 = __importDefault(require("../utils/send-mail"));
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, birthday, password } = req.body;
        const existingUser = yield models_1.UserModel.findOne({
            where: { email: email },
        });
        if (existingUser) {
            return (0, utils_1.sendResponse)(res, {
                code: 400,
                status: "Error",
                message: "Email đã được đăng ký",
            });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        models_1.UserModel.sync({ alter: true }).then(() => {
            return models_1.UserModel.create({
                name: name,
                email: email,
                birthday: birthday,
                password: hashedPassword,
            });
        });
        return (0, utils_1.sendResponse)(res, {
            code: 200,
            status: "Success",
            message: "Tạo tài khoản thành công.",
        });
    }
    catch (error) {
        next(error);
    }
});
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield models_1.UserModel.findOne({ where: { email: email } });
        if (!user) {
            return (0, utils_1.sendResponse)(res, {
                code: 400,
                status: "Error",
                message: "Email hoặc mật khẩu không đúng, vui lòng thử lại.",
            });
        }
        const isPasswordMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            return (0, utils_1.sendResponse)(res, {
                code: 400,
                status: "Error",
                message: "Email hoặc mật khẩu không đúng, vui lòng thử lại.",
            });
        }
        const userObj = lodash_1.default.omit(user.toJSON(), ["password"]);
        const accessToken = (0, middleware_1.generateToken)(user);
        console.log(accessToken);
        return (0, utils_1.sendResponse)(res, {
            code: 200,
            status: "Success",
            message: "Đăng nhập thành công.",
            data: userObj,
            accessToken: accessToken,
        });
    }
    catch (error) { }
});
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, birthday, photoURL, coins } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(200).json({
                code: 400,
                status: "Error",
                message: "Vui lòng kiểm tra lại.",
            });
        }
        const user = yield models_1.UserModel.findByPk(userId);
        if (!user) {
            return res.status(200).json({
                code: 400,
                status: "Error",
                message: "Người dùng không tồn tại.",
            });
        }
        user.update({
            name,
            birthday,
            photoURL,
            coins,
        });
        return res.status(200).json({
            code: 200,
            status: "Success",
            message: "Cập nhật thông tin thành công.",
        });
    }
    catch (error) { }
});
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        const user = yield models_1.UserModel.findByPk(userId, {
            attributes: { exclude: ["password"] },
        });
        if (!user) {
            return (0, utils_1.sendResponse)(res, {
                code: 400,
                status: "Error",
                message: "Người dùng không tồn tại.",
            });
        }
        return (0, utils_1.sendResponse)(res, {
            code: 200,
            status: "Success",
            data: user,
        });
    }
    catch (error) { }
});
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, template } = req.body;
        if (!email) {
            return (0, utils_1.sendResponse)(res, {
                code: 400,
                status: "Error",
                message: "Email bắt buộc phải nhập.",
            });
        }
        const user = yield models_1.UserModel.findOne({ where: { email: email } });
        if (!user) {
            return (0, utils_1.sendResponse)(res, {
                code: 400,
                status: "Error",
                message: "Email không tồn tại!.",
            });
        }
        // Tạo token có thời gian hết hạn
        const accessToken = (0, middleware_1.generateToken)(user);
        // Thực hiện gửi email
        const resetPasswordUrl = `${utils_2.DOMAIN}/reset-password?token=${accessToken}`;
        let emailContent = `<a hreft='${resetPasswordUrl}'>Reset password</a>`;
        if (template) {
            emailContent = template.replace('{{urlResetPassword}}', resetPasswordUrl);
        }
        (0, send_mail_1.default)(email, 'Reset password', '', emailContent)
            .then(() => {
            return (0, utils_1.sendResponse)(res, {
                code: 200,
                status: "Success",
                message: "Email đặt lại mật khẩu đã được gửi.",
                accessToken: accessToken
            });
        })
            .catch((error) => {
            return (0, utils_1.sendResponse)(res, {
                code: 500,
                status: 'Error',
                message: 'Gửi email thất bại',
            });
        });
    }
    catch (error) {
        return (0, utils_1.sendResponse)(res, {
            code: 500,
            status: 'Error',
            message: error,
        });
    }
});
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { password } = req.body;
        if (!password) {
            return (0, utils_1.sendResponse)(res, {
                code: 400,
                status: 'Error',
                message: 'Password không hợp lệ.',
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, utils_2.JWT_SECRET_KEY);
        if (!decoded || !decoded.id) {
            return (0, utils_1.sendResponse)(res, {
                code: 400,
                status: 'Error',
                message: 'Token không hợp lệ hoặc đã hết hạn.',
            });
        }
        const user = yield models_1.UserModel.findOne({ where: { id: decoded.id } });
        if (!user) {
            return res.status(200).json({
                code: 400,
                status: "Error",
                message: "Người dùng không tồn tại.",
            });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        user.update({
            password: hashedPassword,
        });
        return (0, utils_1.sendResponse)(res, {
            code: 200,
            status: 'Success',
            message: 'Mật khẩu đã được đặt lại thành công.',
        });
    }
    catch (error) {
        return (0, utils_1.sendResponse)(res, {
            code: 500,
            status: 'Error',
            message: error,
        });
    }
});
const UserController = {
    signUp,
    login,
    updateProfile,
    getProfile,
    forgotPassword,
    resetPassword
};
exports.default = UserController;
