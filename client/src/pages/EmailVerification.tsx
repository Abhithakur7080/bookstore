import { useSearchParams, useNavigate } from "react-router-dom";
import { useVerifyEmailQuery } from "@/services/auth.service";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const EmailVerifyPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const email = params.get("email") || "";
  const token = params.get("token") || "";

  const {
    data,
    isLoading,
    isError,
    isSuccess,
    refetch,
  } = useVerifyEmailQuery(
    { token, email },
    { skip: !email || !token } 
  );

  const renderIcon = () => {
    if (isLoading) return <Loader2 className="w-8 h-8 animate-spin text-blue-500" />;
    if (isSuccess) return <CheckCircle className="w-8 h-8 text-green-600" />;
    if (isError) return <XCircle className="w-8 h-8 text-red-600" />;
    return null;
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-2">{renderIcon()}</div>
          <h2 className="text-lg font-bold">
            {isLoading
              ? "Verifying Email..."
              : isSuccess
              ? "Verified!"
              : "Verification Failed"}
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            {isSuccess && data?.message}
            {isError && "Something went wrong. Try again or request a new link."}
          </p>

          {!isLoading && (
            <div className="flex flex-col gap-2">
              <Button onClick={() => navigate("/login")} className="w-full">
                Go to Login
              </Button>
              {isError && (
                <Button variant="outline" className="w-full" onClick={() => refetch()}>
                  Retry
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerifyPage;
