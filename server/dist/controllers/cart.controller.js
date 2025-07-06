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
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user.model"));
const book_model_1 = __importDefault(require("../models/book.model"));
const statusCodes_1 = require("../utils/statusCodes");
const cart_validatation_1 = require("../validatations/cart.validatation");
class CartController {
    constructor() {
        this.getCart = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user = yield user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id).populate({
                    path: "cart.productId",
                    model: book_model_1.default,
                });
                if (!user) {
                    return res
                        .status(statusCodes_1.StatusCode.NotFound)
                        .json({ message: "User not found" });
                }
                const items = user.cart.map((item) => ({
                    product: item.productId,
                    quantity: item.quantity,
                    addedAt: item.addedAt,
                }));
                return res.status(statusCodes_1.StatusCode.OK).json({ items, message: "User Cart Fetched" });
            }
            catch (error) {
                return res.status(statusCodes_1.StatusCode.InternalServerError).json({
                    message: "Failed to fetch cart",
                    error,
                });
            }
        });
        this.mergeCart = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = cart_validatation_1.mergeCartSchema.safeParse(req.body);
            if (!result.success) {
                const errors = {};
                result.error.errors.forEach((err) => {
                    if (err.path && err.path.length > 0) {
                        errors[err.path[0]] = err.message;
                    }
                });
                return res.status(statusCodes_1.StatusCode.BadRequest).json({ errors });
            }
            try {
                const user = yield user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                if (!user) {
                    return res
                        .status(statusCodes_1.StatusCode.NotFound)
                        .json({ message: "User not found" });
                }
                const guestItems = result.data || [];
                guestItems.forEach((incomingItem) => {
                    const existingIndex = user.cart.findIndex((item) => item.productId.equals(incomingItem.product._id));
                    if (existingIndex !== -1) {
                        user.cart[existingIndex].quantity += incomingItem.quantity;
                    }
                    else {
                        user.cart.push({
                            productId: new mongoose_1.default.Types.ObjectId(incomingItem.product._id),
                            quantity: incomingItem.quantity,
                            addedAt: new Date(),
                        });
                    }
                });
                yield user.save();
                return res.status(statusCodes_1.StatusCode.OK).json({ message: "User & Local cart merged" });
            }
            catch (error) {
                return res.status(statusCodes_1.StatusCode.InternalServerError).json({
                    message: "Failed to merge cart",
                    error,
                });
            }
        });
        this.addToCart = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = cart_validatation_1.addToCartSchema.safeParse(req.body);
            if (!result.success) {
                const errors = {};
                result.error.errors.forEach((err) => {
                    if (err.path && err.path.length > 0) {
                        errors[err.path[0]] = err.message;
                    }
                });
                console.log(errors);
                return res.status(statusCodes_1.StatusCode.BadRequest).json({ errors });
            }
            try {
                const user = yield user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                if (!user) {
                    return res
                        .status(statusCodes_1.StatusCode.NotFound)
                        .json({ message: "User not found" });
                }
                const { productId, quantity } = result.data;
                if (!productId || quantity < 1) {
                    return res
                        .status(statusCodes_1.StatusCode.BadRequest)
                        .json({ message: "Invalid product or quantity" });
                }
                const index = user.cart.findIndex((item) => item.productId.equals(productId));
                if (index >= 0) {
                    user.cart[index].quantity = quantity;
                }
                else {
                    user.cart.push({
                        productId: new mongoose_1.default.Types.ObjectId(productId),
                        quantity,
                        addedAt: new Date(),
                    });
                }
                yield user.save();
                return res.status(statusCodes_1.StatusCode.OK).json({ message: "Item added to cart" });
            }
            catch (error) {
                return res.status(statusCodes_1.StatusCode.InternalServerError).json({
                    message: "Failed to add to cart",
                    error,
                });
            }
        });
        this.removeFromCart = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const paramCheck = cart_validatation_1.cartItemParamSchema.safeParse(req.params);
                if (!paramCheck.success) {
                    return res.status(statusCodes_1.StatusCode.BadRequest).json({
                        errors: paramCheck.error.flatten().fieldErrors,
                    });
                }
                const { productId } = paramCheck.data;
                const user = yield user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                if (!user) {
                    return res
                        .status(statusCodes_1.StatusCode.NotFound)
                        .json({ message: "User not found" });
                }
                user.cart = user.cart.filter((item) => !item.productId.equals(productId));
                yield user.save();
                return res.status(statusCodes_1.StatusCode.OK).json({ message: "Item removed from cart" });
            }
            catch (error) {
                return res.status(statusCodes_1.StatusCode.InternalServerError).json({
                    message: "Failed to remove item from cart",
                    error,
                });
            }
        });
        this.increaseQuantity = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const paramCheck = cart_validatation_1.cartItemParamSchema.safeParse(req.params);
                if (!paramCheck.success) {
                    return res.status(statusCodes_1.StatusCode.BadRequest).json({
                        errors: paramCheck.error.flatten().fieldErrors,
                    });
                }
                const { productId } = paramCheck.data;
                if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
                    return res.status(statusCodes_1.StatusCode.BadRequest).json({ message: "Invalid product ID" });
                }
                const user = yield user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                if (!user) {
                    return res.status(statusCodes_1.StatusCode.NotFound).json({ message: "User not found" });
                }
                const index = user.cart.findIndex((item) => item.productId.equals(productId));
                if (index === -1) {
                    return res.status(statusCodes_1.StatusCode.NotFound).json({ message: "Product not in cart" });
                }
                user.cart[index].quantity += 1;
                yield user.save();
                return res.status(statusCodes_1.StatusCode.OK).json({ message: "Quantity increased" });
            }
            catch (error) {
                return res.status(statusCodes_1.StatusCode.InternalServerError).json({
                    message: "Failed to increase quantity",
                    error,
                });
            }
        });
        this.decreaseQuantity = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const paramCheck = cart_validatation_1.cartItemParamSchema.safeParse(req.params);
                if (!paramCheck.success) {
                    return res.status(statusCodes_1.StatusCode.BadRequest).json({
                        errors: paramCheck.error.flatten().fieldErrors,
                    });
                }
                const { productId } = paramCheck.data;
                if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
                    return res.status(statusCodes_1.StatusCode.BadRequest).json({ message: "Invalid product ID" });
                }
                const user = yield user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                if (!user) {
                    return res.status(statusCodes_1.StatusCode.NotFound).json({ message: "User not found" });
                }
                const index = user.cart.findIndex((item) => item.productId.equals(productId));
                if (index === -1) {
                    return res.status(statusCodes_1.StatusCode.NotFound).json({ message: "Product not in cart" });
                }
                if (user.cart[index].quantity > 1) {
                    user.cart[index].quantity -= 1;
                }
                else {
                    // Optional: remove item if quantity reaches 0
                    user.cart.splice(index, 1);
                }
                yield user.save();
                return res.status(statusCodes_1.StatusCode.OK).json({ message: "Quantity decreased" });
            }
            catch (error) {
                return res.status(statusCodes_1.StatusCode.InternalServerError).json({
                    message: "Failed to decrease quantity",
                    error,
                });
            }
        });
        this.clearCart = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user = yield user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                if (!user) {
                    return res
                        .status(statusCodes_1.StatusCode.NotFound)
                        .json({ message: "User not found" });
                }
                user.cart = [];
                yield user.save();
                return res.status(statusCodes_1.StatusCode.OK).json({ message: "Cart cleared successfully" });
            }
            catch (error) {
                return res.status(statusCodes_1.StatusCode.InternalServerError).json({
                    message: "Failed to clear cart",
                    error,
                });
            }
        });
    }
}
exports.default = new CartController();
