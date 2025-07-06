import React from "react";
import { ShieldCheck, RefreshCcw, Headphones, Star, Users, BookOpen, Heart, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Type for a feature item
interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  colorTheme?: "blue" | "green" | "purple" | "orange" | "pink" | "indigo";
}

// List of features to show on the page
const aboutFeatures: Feature[] = [
  {
    icon: <RefreshCcw className="w-5 h-5 text-white" />,
    title: "Easy Returns",
    description: "Not satisfied? Return within 7 days with our hassle-free guarantee and full refund policy.",
    colorTheme: "blue"
  },
  {
    icon: <Headphones className="w-5 h-5 text-white" />,
    title: "Live Customer Support", 
    description: "Get personalized help from real humans 24/7 via chat, email, or phone support.",
    colorTheme: "green"
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-white" />,
    title: "Secure Payment Options",
    description: "Your transactions are protected by bank-level encryption and fraud protection.",
    colorTheme: "purple"
  },
  {
    icon: <BookOpen className="w-5 h-5 text-white" />,
    title: "Vast Collection",
    description: "Discover over 50,000 books across all genres, from bestsellers to rare finds.",
    colorTheme: "orange"
  },
  {
    icon: <Heart className="w-5 h-5 text-white" />,
    title: "Personalized Recommendations",
    description: "Get curated book suggestions based on your reading preferences and history.",
    colorTheme: "pink"
  },
  {
    icon: <Award className="w-5 h-5 text-white" />,
    title: "Quality Guarantee",
    description: "Every book is carefully inspected for quality, condition, and authenticity.",
    colorTheme: "indigo"
  }
];

// Background colors for icons with enhanced gradients
const colorThemes = {
  blue: "bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 shadow-blue-500/25",
  green: "bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 shadow-green-500/25", 
  purple: "bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-600 shadow-purple-500/25",
  orange: "bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 shadow-orange-500/25",
  pink: "bg-gradient-to-br from-pink-500 via-rose-600 to-red-600 shadow-pink-500/25",
  indigo: "bg-gradient-to-br from-indigo-500 via-blue-600 to-purple-600 shadow-indigo-500/25"
};

// One feature card with enhanced styling
const FeatureCard: React.FC<{ 
  feature: Feature; 
  index: number;
}> = ({ feature, index }) => {
  const bgColorClass = colorThemes[feature.colorTheme || "blue"];

  return (
    <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-border/20 bg-white/80 backdrop-blur-lg hover:bg-white/90">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-start gap-4">
          {/* Enhanced icon with glow effect */}
          <div className="relative">
            <Avatar className={`w-14 h-14 ${bgColorClass} group-hover:scale-110 transition-all duration-300 shadow-lg`}>
              <AvatarFallback className="bg-transparent">
                {feature.icon}
              </AvatarFallback>
            </Avatar>
            <div className={`absolute inset-0 w-14 h-14 ${bgColorClass} rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10`} />
          </div>

          {/* Title and index with better typography */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors line-clamp-1">
                {feature.title}
              </CardTitle>
              <Badge variant="secondary" className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 font-medium shrink-0">
                {String(index + 1).padStart(2, '0')}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Enhanced description */}
      <CardContent className="pt-0 relative z-10">
        <p className="text-gray-600 leading-relaxed text-sm group-hover:text-gray-700 transition-colors">
          {feature.description}
        </p>
      </CardContent>

      {/* Animated border effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
    </Card>
  );
};

// Enhanced section header with better gradients
const SectionHeader: React.FC = () => (
  <div className="text-center space-y-6">
    <div className="space-y-4 max-w-3xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent leading-tight">
        Why Choose Our Bookstore?
      </h2>
      <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
        We're committed to delivering an exceptional book-buying experience that goes beyond your expectations.
      </p>
    </div>
    
    {/* Enhanced separator with animation */}
    <div className="flex justify-center">
      <div className="w-24 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg" />
    </div>
  </div>
);

// Enhanced floating elements
const FloatingElements: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {/* Animated background shapes */}
    <div className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
    <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
    <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-br from-green-400/15 to-emerald-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
    
    {/* Floating book icons */}
    <div className="absolute top-20 right-20 text-blue-400/30 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }}>
      <BookOpen className="w-8 h-8" />
    </div>
    <div className="absolute bottom-32 left-16 text-purple-400/30 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '2.5s' }}>
      <Star className="w-6 h-6" />
    </div>
    <div className="absolute top-1/3 right-1/4 text-pink-400/30 animate-bounce" style={{ animationDelay: '2.5s', animationDuration: '3.5s' }}>
      <Heart className="w-7 h-7" />
    </div>
  </div>
);

// Enhanced bottom stats section
const StatsSection: React.FC = () => (
  <Card className="border-0 bg-gradient-to-r from-gray-50/80 to-blue-50/80 backdrop-blur-sm shadow-lg">
    <CardContent className="text-center py-8">
      <div className="flex flex-wrap justify-center items-center gap-8 text-sm">
        <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 bg-white/80 border-green-200 hover:bg-green-50 transition-colors cursor-default">
          <ShieldCheck className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-green-800">SSL Secured</span>
        </Badge>

        <Separator orientation="vertical" className="h-6 bg-gray-300 hidden sm:block" />

        <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 bg-white/80 border-blue-200 hover:bg-blue-50 transition-colors cursor-default">
          <Users className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-blue-800">50,000+ Happy Readers</span>
        </Badge>

        <Separator orientation="vertical" className="h-6 bg-gray-300 hidden sm:block" />

        <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 bg-white/80 border-yellow-200 hover:bg-yellow-50 transition-colors cursor-default">
          <Star className="w-5 h-5 text-yellow-600 fill-yellow-500" />
          <span className="font-semibold text-yellow-800">4.9/5 Rating</span>
        </Badge>

        <Separator orientation="vertical" className="h-6 bg-gray-300 hidden sm:block" />

        <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 bg-white/80 border-purple-200 hover:bg-purple-50 transition-colors cursor-default">
          <BookOpen className="w-5 h-5 text-purple-600" />
          <span className="font-semibold text-purple-800">50K+ Books</span>
        </Badge>
      </div>
    </CardContent>
  </Card>
);

// Main enhanced section
const AboutSection: React.FC = () => {
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 overflow-hidden">
      
      {/* Enhanced floating background elements */}
      <FloatingElements />

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <SectionHeader />

        {/* Enhanced cards grid */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
            {aboutFeatures.map((feature, index) => (
              <div 
                key={`feature-${index}`}
                className="transform transition-all duration-300"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <FeatureCard 
                  feature={feature}
                  index={index}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced bottom stats */}
        <StatsSection />
      </div>

      {/* Subtle bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/50 to-transparent pointer-events-none" />
    </section>
  );
};

export default AboutSection;