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
const stripe_1 = require("../utils/stripe");
const statusCodes_1 = require("../utils/statusCodes");
const order_model_1 = __importDefault(require("../models/order.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const config_1 = require("../config");
const zodErrorHelper_1 = require("../utils/zodErrorHelper");
const order_validatations_1 = require("../validatations/order.validatations");
class OrderController {
    constructor() {
        /**
         * Create Stripe checkout session
         */
        this.createCheckoutSession = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = order_validatations_1.CreateCheckoutSessionSchema.safeParse(req.body);
                if (!result.success) {
                    return res
                        .status(statusCodes_1.StatusCode.BadRequest)
                        .json({ errors: (0, zodErrorHelper_1.extractZodErrors)(result.error.errors) });
                }
                const { items, name, address, totalAmount } = result.data;
                const userId = req.user.id;
                const line_items = items.map((item) => ({
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: item.product.name || item.product.title || "Product",
                        },
                        unit_amount: Math.round(item.product.price * 100),
                    },
                    quantity: item.quantity,
                }));
                const session = yield stripe_1.stripe.checkout.sessions.create({
                    payment_method_types: ["card"],
                    mode: "payment",
                    line_items,
                    success_url: `${config_1.serverConfig.frontendUrl}/payment?success=true&session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${config_1.serverConfig.frontendUrl}/payment?success=false&cancelled=true`,
                    customer_email: req.user.email,
                    metadata: {
                        userId,
                        name,
                        address,
                        totalAmount: totalAmount.toString(),
                        items: JSON.stringify(items.map((item) => ({
                            productId: item.product._id || item.product.id,
                            name: item.product.name || item.product.title || "Product",
                            price: item.product.price,
                            quantity: item.quantity,
                        }))).slice(0, 490),
                    },
                });
                return res.status(statusCodes_1.StatusCode.OK).json({ url: session.url });
            }
            catch (error) {
                console.error("Checkout Session Error:", error);
                return res.status(statusCodes_1.StatusCode.InternalServerError).json({
                    message: "Failed to create checkout session",
                    error,
                });
            }
        });
        /**
         * Complete Stripe payment and save order
         */
        this.completeStripeOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = order_validatations_1.CompleteStripeOrderSchema.safeParse(req.body);
                if (!result.success) {
                    return res
                        .status(statusCodes_1.StatusCode.BadRequest)
                        .json({ errors: (0, zodErrorHelper_1.extractZodErrors)(result.error.errors) });
                }
                const { sessionId } = result.data;
                const session = yield stripe_1.stripe.checkout.sessions.retrieve(sessionId);
                const { userId, name, address, items, totalAmount, } = session.metadata;
                const parsedItems = JSON.parse(items);
                // Transform parsed items to match the expected format
                const transformedItems = parsedItems.map((item) => ({
                    product: {
                        _id: item.productId,
                        name: item.name,
                        price: item.price,
                    },
                    quantity: item.quantity,
                }));
                const order = yield this.createOrder({
                    userId,
                    items: transformedItems,
                    name,
                    address,
                    totalAmount: parseFloat(totalAmount),
                    paymentMethod: "stripe",
                    paymentStatus: "paid",
                    stripeSessionId: sessionId,
                });
                yield this.clearUserCart(userId, String(order._id));
                return res.status(statusCodes_1.StatusCode.Created).json({
                    message: "Order placed successfully",
                    order,
                });
            }
            catch (error) {
                console.error("Complete Stripe Order Error:", error);
                return res.status(statusCodes_1.StatusCode.InternalServerError).json({
                    message: "Failed to complete Stripe order",
                    error,
                });
            }
        });
        /**
         * Place Cash on Delivery order
         */
        this.placeCODOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = order_validatations_1.CreateCheckoutSessionSchema.safeParse(req.body);
                if (!result.success) {
                    return res
                        .status(statusCodes_1.StatusCode.BadRequest)
                        .json({ errors: (0, zodErrorHelper_1.extractZodErrors)(result.error.errors) });
                }
                const { items, name, address, totalAmount } = result.data;
                const userId = req.user.id;
                const order = yield this.createOrder({
                    userId,
                    items,
                    name,
                    address,
                    totalAmount,
                    paymentMethod: "cod",
                    paymentStatus: "pending",
                });
                yield this.clearUserCart(userId, String(order._id));
                return res.status(statusCodes_1.StatusCode.Created).json({
                    message: "Order placed with Cash on Delivery",
                    order,
                });
            }
            catch (error) {
                console.error("COD Order Error:", error);
                return res.status(statusCodes_1.StatusCode.InternalServerError).json({
                    message: "Failed to place COD order",
                    error,
                });
            }
        });
        /**
       * Get orders of the logged-in user
       */
        this.getUserOrders = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const orders = yield order_model_1.default.find({ user: userId })
                    .populate("items.product")
                    .sort({ createdAt: -1 });
                return res.status(statusCodes_1.StatusCode.OK).json({ orders });
            }
            catch (error) {
                console.error("Get User Orders Error:", error);
                return res.status(statusCodes_1.StatusCode.InternalServerError).json({
                    message: "Failed to fetch user orders",
                    error,
                });
            }
        });
        /**
         * Admin: Update order status
         */
        this.updateOrderStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId } = req.params;
                const { status } = req.body;
                const validStatuses = ["placed", "processing", "shipped", "delivered", "cancelled"];
                if (!validStatuses.includes(status)) {
                    return res.status(statusCodes_1.StatusCode.BadRequest).json({ message: "Invalid status" });
                }
                const order = yield order_model_1.default.findByIdAndUpdate(orderId, { status }, { new: true }).populate("items.product");
                if (!order) {
                    return res.status(statusCodes_1.StatusCode.NotFound).json({ message: "Order not found" });
                }
                return res.status(statusCodes_1.StatusCode.OK).json({
                    message: "Order status updated successfully",
                    order,
                });
            }
            catch (error) {
                console.error("Update Order Status Error:", error);
                return res.status(statusCodes_1.StatusCode.InternalServerError).json({
                    message: "Failed to update order status",
                    error,
                });
            }
        });
    }
    /**
     * 🔒 Private method to create an order
     */
    createOrder(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, items, name, address, totalAmount, paymentMethod, paymentStatus, stripeSessionId, }) {
            return yield order_model_1.default.create({
                user: userId,
                items: items.map((item) => {
                    var _a, _b, _c;
                    return ({
                        product: ((_a = item.product) === null || _a === void 0 ? void 0 : _a._id) || ((_b = item.product) === null || _b === void 0 ? void 0 : _b.id) || "000000000000000000000000",
                        quantity: item.quantity,
                        price: ((_c = item.product) === null || _c === void 0 ? void 0 : _c.price) || 0,
                    });
                }),
                shippingAddress: { name, address },
                paymentMethod,
                paymentStatus,
                totalAmount,
                status: "placed",
                stripeSessionId,
            });
        });
    }
    /**
     * 🔒 Private method to clear user's cart
     */
    clearUserCart(userId, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_model_1.default.findByIdAndUpdate(userId, {
                $push: { orders: orderId },
                $set: { cart: [] },
            });
        });
    }
}
exports.default = new OrderController();
