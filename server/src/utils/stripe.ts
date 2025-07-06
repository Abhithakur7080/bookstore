import Stripe from "stripe";
import { serverConfig } from "../config";

export const stripe = new Stripe(serverConfig.stripeSecretKey as string, {
  apiVersion: "2025-06-30.basil",
});
