import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Shield, Cookie } from "lucide-react";

const COOKIE_KEY = "cookieConsent";

const CookiesBanner = () => {
  const [show, setShow] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      setShow(true);
      setTimeout(() => setIsVisible(true), 100);
    }
  }, []);

  const handleConsent = (consent: "granted" | "denied") => {
    localStorage.setItem(COOKIE_KEY, consent);
    setIsVisible(false);
    setTimeout(() => setShow(false), 200);
  };

  if (!show) return null;

  return (
    <Card 
      className={`fixed bottom-6 right-0 md:right-6 w-96 shadow-xl z-50 py-1.5 bg-blue-950 rounded-none border-0 transition-all duration-300 ${
    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
  }`}
    >
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cookie className="w-5 h-5 text-orange-600" />
            <p className="text-sm font-semibold text-white">Cookie Consent</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleConsent("denied")}
            className="hover:bg-gray-600 h-8 w-8"
          >
            <X className="w-4 h-4 text-red-300" />
          </Button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Shield className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-white mb-1">
                Privacy & Cookies
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                This website uses cookies to improve user experience and analyze website traffic. We do not sell personal data to third parties.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Essential</span>
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Analytics</span>
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Functional</span>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            size="sm"
            className="flex-1 text-sm text-white hover:bg-blue-900 cursor-pointer"
            onClick={() => handleConsent("denied")}
          >
            Decline
          </Button>
          <Button
            size="sm"
            className="flex-1 text-sm  text-blue-950 bg-white cursor-pointer hover:text-white"
            onClick={() => handleConsent("granted")}
          >
            Accept All
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          <a href="#" className="underline hover:text-gray-700">Privacy Policy</a> | 
          <a href="#" className="underline hover:text-gray-700 ml-1">Cookie Settings</a>
        </p>
      </CardContent>
    </Card>
  );
};

export default CookiesBanner;