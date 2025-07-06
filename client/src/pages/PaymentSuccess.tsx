import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCompleteStripeOrderMutation } from "@/services/order.service";
import {
  CheckCircle,
  Package,
  ShoppingBag,
  ArrowRight,
  Home,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const session_id = query.get("session_id");
  const success = query.get("success");
  const cancelled = query.get("cancelled");

  const [completeStripeOrder] = useCompleteStripeOrderMutation();
  const [status, setStatus] = useState<"processing" | "success" | "error" | "invalid">("processing");
  const [orderData, setOrderData] = useState<any>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (success === "false" || cancelled === "true") {
      setStatus("error");
      return;
    }

    if (session_id) {
      completeStripeOrder({ sessionId: session_id })
        .unwrap()
        .then((res) => {
          setOrderData(res.order);
          setStatus("success");
          setTimeout(() => setShowAnimation(true), 500);
        })
        .catch((err) => {
          console.error("Failed to complete order:", err);
          setStatus("error");
        });
    } else if (!success && !cancelled && !session_id) {
      setStatus("invalid");
    }
  }, [session_id, success, cancelled, completeStripeOrder]);

  const ProcessingView = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-10">
        <div className="relative">
          <Package className="w-16 h-16 text-blue-600 mx-auto animate-bounce" />
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 rounded-full animate-ping"></div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">Processing Your Order</h1>
          <p className="text-gray-600">Please wait while we confirm your payment...</p>
        </div>
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-100"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-200"></div>
        </div>
      </div>
    </div>
  );
  console.log(orderData)

  const SuccessView = () => (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white-100 flex items-center justify-center p-4 pt-28 pb-10">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className={`relative mx-auto transition-all duration-1000 ${showAnimation ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <div className="absolute inset-0 w-24 h-24 bg-green-200 rounded-full mx-auto animate-ping opacity-75"></div>
          </div>

          <div className={`space-y-2 transition-all duration-1000 delay-300 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <h1 className="text-3xl font-bold text-gray-800">Order Confirmed!</h1>
            <p className="text-gray-600">Thank you for your purchase</p>
          </div>
        </div>

        <Card className={`transition-all duration-1000 delay-500 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2">
              <Receipt className="w-5 h-5" />
              Order Details
            </CardTitle>
            <CardDescription>Your order has been successfully placed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderData && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Order ID:</span>
                  <Badge variant="outline" className="font-mono">
                    {orderData._id?.slice(-8).toUpperCase()}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Amount:</span>
                  <span className="font-semibold">₹{orderData.totalAmount}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Payment Method:</span>
                  <Badge variant="secondary">
                    {orderData.paymentMethod === 'stripe' ? 'Card Payment' : 'Cash on Delivery'}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    {orderData.status}
                  </Badge>
                </div>

                {orderData.items && (
                  <div className="pt-2 border-t">
                    <span className="text-sm font-medium">Items:</span>
                    <div className="mt-2 space-y-1">
                      {orderData.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.quantity}x Product</span>
                          <span>₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Alert className={`border-green-200 bg-green-50 transition-all duration-1000 delay-700 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <ShoppingBag className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Your order has been confirmed and will be processed shortly. You'll receive an email confirmation soon.
          </AlertDescription>
        </Alert>

        <div className={`flex flex-col sm:flex-row gap-3 transition-all duration-1000 delay-900 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <Button onClick={() => navigate('/orders')} className="flex-1 bg-green-600 hover:bg-green-700">
            <Receipt className="w-4 h-4 mr-2" />
            View Orders
          </Button>
          <Button onClick={() => navigate('/')} variant="outline" className="flex-1 border-green-200 hover:bg-green-50">
            <Home className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </div>

        <div className={`text-center space-y-2 transition-all duration-1000 delay-1100 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <p className="text-sm text-gray-600">What's next?</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span>Order Processing</span>
            <ArrowRight className="w-4 h-4" />
            <span>Shipping</span>
            <ArrowRight className="w-4 h-4" />
            <span>Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );

  const ErrorView = () => (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <Package className="w-16 h-16 text-red-600" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">Payment Failed</h1>
          <p className="text-gray-600">Something went wrong while processing your order</p>
        </div>

        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            Please contact our support team or try placing your order again.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={() => navigate('/checkout')} className="flex-1 bg-red-600 hover:bg-red-700">
            Try Again
          </Button>
          <Button onClick={() => navigate('/')} variant="outline" className="flex-1 border-red-200 hover:bg-red-50">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );

  const InvalidView = () => (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <p className="text-lg text-gray-500">
        Invalid payment attempt or expired session. Please try again or return to homepage.
      </p>
    </div>
  );

  if (status === "processing") return <ProcessingView />;
  if (status === "error") return <ErrorView />;
  if (status === "invalid") return <InvalidView />;
  return <SuccessView />;
};

export default PaymentSuccessPage;
