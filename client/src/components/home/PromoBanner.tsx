import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Sparkles, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const PromoBanner = () => {
  const [show, setShow] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  if (!show) return null;

  return (
    <Card
      className={`fixed bottom-6 left-6 w-80 shadow-2xl py-1.5 z-50 border-0 overflow-hidden transform transition-all duration-300
        bg-gradient-to-br from-indigo-400 to-purple-600 
        animate-float hover:scale-105 hover:shadow-3xl`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating background shapes */}
      <div className="absolute inset-0 opacity-20">
        <div
          className={`absolute top-2 right-2 w-20 h-20 bg-white rounded-full transition-transform duration-300 
            ${isHovered ? "scale-110" : "scale-100"} animate-pulse-bg`}
        />
        <div
          className="absolute bottom-3 left-3 w-12 h-12 bg-yellow-300 rounded-full animate-bounce-bg"
        />
      </div>

      <CardContent className="relative p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
              <BookOpen className="w-5 h-5 text-white/90" />
            </div>
            <p className="text-sm font-bold text-white">Limited Time Offer!</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShow(false)}
            className="hover:bg-white/20 transition-colors duration-200"
          >
            <X className="w-4 h-4 text-white/80 hover:text-white" />
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-extrabold text-white leading-tight">
            📚 Unlock Premium Books
          </h3>
          <p className="text-sm text-white/90 leading-relaxed">
            Join thousands of readers! Get exclusive access to bestsellers, early releases, and special discounts.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-white/80">
          <span className="bg-white/20 px-2 py-1 rounded-full">✨ Free Trial</span>
          <span className="bg-white/20 px-2 py-1 rounded-full">🎁 50% Off</span>
        </div>
        <Link to={"/shop"}>
        <Button
          size="sm"
          className={`w-full text-sm font-semibold text-purple-700 hover:text-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg 
          ${isHovered ? "bg-gradient-to-r from-yellow-400 to-yellow-500" : "bg-white"}`}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Explore Now - Join Free!
        </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default PromoBanner;
