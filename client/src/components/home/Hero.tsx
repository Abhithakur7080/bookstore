import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, BookOpen, Users, Award, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-24 mt-[4.5rem]">
      {/* Enhanced Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 rounded-full blur-3xl opacity-40" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-gradient-to-tl from-blue-200 via-cyan-200 to-emerald-200 rounded-full blur-3xl opacity-40" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 rounded-full blur-3xl opacity-20 animate-spin" style={{ animationDuration: '30s' }} />
        
        {/* Floating Books Animation */}
        <div className="absolute top-20 left-20 w-8 h-8 bg-blue-400 rounded-md opacity-20 animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-32 w-6 h-6 bg-purple-400 rounded-md opacity-20 animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-40 w-7 h-7 bg-pink-400 rounded-md opacity-20 animate-bounce" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-20 w-5 h-5 bg-indigo-400 rounded-md opacity-20 animate-bounce" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Content */}
        <Card className="flex-1 border-none shadow-none bg-transparent">
          <CardContent className="space-y-8 animate-fade-in-up p-0">
            {/* Trust Indicators */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium text-slate-700">4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-slate-700">50K+ Readers</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                <Award className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-slate-700">Award Winner</span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
              <span className="inline-block mb-2">
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">
                  Discover Your Next
                </span>
              </span>
              <br />
              <span className="inline-flex items-center gap-4 text-slate-800">
                Favorite Book
                <div className="relative">
                  <BookOpen className="w-12 h-12 text-blue-600" />
                  <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-2 -right-2" />
                </div>
              </span>
            </h1>

            {/* Enhanced Description */}
            <div className="space-y-4">
              <p className="text-slate-600 text-xl leading-relaxed">
                Browse through{" "}
                <Badge variant="outline" className="inline-flex bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border-indigo-200 font-semibold px-3 py-1">
                  🔥 10,000+ Bestsellers
                </Badge>{" "}
                across{" "}
                <Badge variant="outline" className="inline-flex bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-purple-200 font-semibold px-3 py-1">
                  📚 50+ Genres
                </Badge>
              </p>
              
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white border-0 font-bold px-4 py-2 shadow-lg hover:scale-105 transition-transform">
                  ✨ Inspire
                </Badge>
                <Badge variant="outline" className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 font-bold px-4 py-2 shadow-lg hover:scale-105 transition-transform">
                  🎓 Educate
                </Badge>
                <Badge variant="outline" className="bg-gradient-to-r from-green-500 to-teal-500 text-white border-0 font-bold px-4 py-2 shadow-lg hover:scale-105 transition-transform">
                  🎭 Entertain
                </Badge>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/shop">
                <Button
                  size="lg"
                  className="group px-8 py-4 text-lg font-semibold bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-2xl hover:from-rose-500 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 hover:shadow-3xl"
                >
                  Shop Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold bg-white/80 backdrop-blur-sm border-2 border-slate-200 text-slate-700 hover:bg-white hover:border-purple-300 hover:text-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Browse Categories
              </Button>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <h3 className="font-semibold text-slate-800 mb-2">📦 Free Shipping</h3>
                <p className="text-sm text-slate-600">On orders over ₹500</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <h3 className="font-semibold text-slate-800 mb-2">🔄 Easy Returns</h3>
                <p className="text-sm text-slate-600">30-day return policy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Image with Enhanced Design */}
        <Card className="flex-1 hidden md:flex justify-center animate-fade-in border-none shadow-none bg-transparent">
          <CardContent className="p-0 relative">
            {/* Decorative Elements */}
            <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-xl opacity-60 " />
            <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-xl opacity-60" />
            
            {/* Main Image Container */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
              <img
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794"
                alt="Books Hero"
                className="relative w-full max-w-lg rounded-2xl shadow-2xl object-cover transition-all duration-500 group-hover:scale-105 group-hover:shadow-3xl"
              />
              
              {/* Floating Stats */}
              <div className="absolute -top-4 -left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">2M+</div>
                  <div className="text-xs text-slate-600">Books Sold</div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">24/7</div>
                  <div className="text-xs text-slate-600">Support</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Wave Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
};

export default Hero;