import React from "react";
import {
  Search,
  Star,
  Heart,
  Shield,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: <Search className="w-8 h-8 text-white" />,
    title: "Advanced Search",
    subtitle:
      "Easily explore our entire book collection using filters like genre, author name, publication year, or bestseller status to quickly find what you're looking for.",
    color: "from-blue-500 to-cyan-500",
    lightColor: "from-blue-50 to-cyan-50",
    accentColor: "text-blue-600",
    borderColor: "border-blue-100",
  },
  {
    icon: <Star className="w-8 h-8 text-white" />,
    title: "User Reviews & Ratings",
    subtitle:
      "Make informed choices by reading detailed feedback, ratings, and personal experiences shared by verified customers across all our book titles.",
    color: "from-amber-500 to-orange-500",
    lightColor: "from-amber-50 to-orange-50",
    accentColor: "text-amber-600",
    borderColor: "border-amber-100",
  },
  {
    icon: <Heart className="w-8 h-8 text-white" />,
    title: "Wishlist & Favourites",
    subtitle:
      "Save your favorite books to revisit later, track upcoming reads, and manage a personalized reading list accessible across all your devices.",
    color: "from-pink-500 to-rose-500",
    lightColor: "from-pink-50 to-rose-50",
    accentColor: "text-pink-600",
    borderColor: "border-pink-100",
  },
  {
    icon: <Shield className="w-8 h-8 text-white" />,
    title: "Secure Online Payments",
    subtitle:
      "Enjoy a smooth checkout experience with our fully encrypted payment gateways supporting cards, UPI, net banking, and wallet options.",
    color: "from-emerald-500 to-green-500",
    lightColor: "from-emerald-50 to-green-50",
    accentColor: "text-emerald-600",
    borderColor: "border-emerald-100",
  },
];

type Feature = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  lightColor: string;
  accentColor: string;
  borderColor: string;
};

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index }) => (
  <div
    className={`group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${feature.borderColor} border-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-lg p-6 animation-delay-${index}`}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${feature.lightColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg`} />
    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${feature.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300 rounded-bl-full`} />
    <div className="relative z-10">
      <div className="flex items-center gap-4 mb-4">
        <div className={`relative p-3 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {feature.icon}
          <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.color} blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10`} />
        </div>
        <span className={`${feature.accentColor} border border-current bg-white/80 px-3 py-1 font-semibold rounded-full text-sm`}>
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <h4 className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors mb-3">
        {feature.title}
      </h4>
      <div className="flex items-center gap-2 mb-4">
        <div className={`h-1 bg-gradient-to-r ${feature.color} rounded-full transition-all duration-500 w-8 group-hover:w-16`} />
        <Sparkles className={`w-4 h-4 ${feature.accentColor} opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:rotate-12`} />
      </div>
      <p className="text-gray-600 leading-relaxed text-sm group-hover:text-gray-700 transition-colors mb-4">
        {feature.subtitle}
      </p>
      <div className="flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
        <span className={feature.accentColor}>Learn more</span>
        <ArrowRight className={`w-4 h-4 ${feature.accentColor}`} />
      </div>
    </div>
    <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm -z-10`} />
  </div>
);

const FloatingBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse" />
    <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
    <div className="absolute top-1/3 left-1/5 w-64 h-64 bg-gradient-to-br from-amber-400/8 to-orange-400/8 rounded-full blur-2xl animate-pulse delay-2000" />

    <Search className="absolute top-20 right-1/4 w-12 h-12 text-blue-400/20 animate-bounce delay-500 duration-[4000ms]" />
    <Heart className="absolute bottom-20 left-1/4 w-10 h-10 text-pink-400/20 animate-bounce delay-[1500ms] duration-[3000ms]" />
    <Star className="absolute top-1/2 right-20 w-8 h-8 text-amber-400/20 animate-bounce delay-[2500ms] duration-[3500ms]" />
  </div>
);

const SectionHeader = () => (
  <div className="text-center space-y-6 max-w-3xl mx-auto">
    <div className="space-y-4">
      <span className="inline-block px-4 py-2 text-sm font-medium bg-white/80 border border-blue-200 text-blue-700 rounded-full">
        ✨ Premium Features
      </span>
      <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
        Explore More Bookstore Features
      </h2>
      <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
        We go beyond selling books — we deliver thoughtful experiences that make your reading journey extraordinary.
      </p>
    </div>
    <div className="flex items-center justify-center gap-2">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
      <div className="w-2 h-2 bg-blue-500 rounded-full" />
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent" />
    </div>
  </div>
);

const EnhancedFeaturesSection = () => {
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30 overflow-hidden">
      <FloatingBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <SectionHeader />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {features.map((feature, index) => (
            <FeatureCard feature={feature} index={index} key={index} />
          ))}
        </div>
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 border-0 text-white relative overflow-hidden rounded-lg">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10 text-center py-8 px-6">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Start Your Reading Journey?
            </h3>
            <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
              Join thousands of happy readers who trust us for their book discovery and purchasing needs.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
              <span className="bg-white/20 text-white border border-white/30 px-4 py-2 rounded-full flex items-center gap-2">
                <Shield className="w-4 h-4" />
                100% Secure
              </span>
              <span className="bg-white/20 text-white border border-white/30 px-4 py-2 rounded-full flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                50K+ Reviews
              </span>
              <span className="bg-white/20 text-white border border-white/30 px-4 py-2 rounded-full flex items-center gap-2">
                <Heart className="w-4 h-4 fill-pink-400 text-pink-400" />
                Trusted Platform
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
    </section>
  );
};

export default EnhancedFeaturesSection;
