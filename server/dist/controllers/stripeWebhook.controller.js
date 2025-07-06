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
exports.stripeWebhook = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
const stripe_1 = require("../utils/stripe");
const config_1 = require("../config");
const stripeWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = req.headers["stripe-signature"];
    console.log("sig", sig);
    let event;
    try {
        event = stripe_1.stripe.webhooks.constructEvent(req.body, sig, config_1.serverConfig.stripeWebHookSecret);
    }
    catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === "payment_intent.succeeded") {
        const intent = event.data.object;
        const metadata = intent.metadata;
        const user = yield user_model_1.default.findById(metadata.userId).populate("cart.productId");
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const items = user.cart.map((item) => ({
            product: item.productId._id,
            quantity: item.quantity,
            price: item.productId.price,
        }));
        const newOrder = yield order_model_1.default.create({
            user: metadata.userId,
            items,
            shippingAddress: {
                name: metadata.name,
                address: metadata.address,
            },
            paymentMethod: "card",
            paymentStatus: "paid",
            totalAmount: intent.amount / 100,
        });
        user.orders.push(newOrder._id);
        user.cart = [];
        yield user.save();
    }
    res.sendStatus(200);
});
exports.stripeWebhook = stripeWebhook;
