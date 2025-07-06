import React, { useState } from 'react';
import { Home, ArrowLeft, Search, BookOpen, Library } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const NotFoundPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}&category=all&author=all&rating=0&price=1000&page=1`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Decorative Book Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-16 h-20 bg-blue-500 rounded-sm transform rotate-12"></div>
        <div className="absolute top-20 right-20 w-14 h-18 bg-green-500 rounded-sm transform -rotate-6"></div>
        <div className="absolute bottom-20 left-20 w-12 h-16 bg-purple-500 rounded-sm transform rotate-45"></div>
        <div className="absolute bottom-40 right-40 w-18 h-22 bg-pink-500 rounded-sm transform -rotate-12"></div>
        <div className="absolute top-1/2 left-1/4 w-10 h-14 bg-indigo-500 rounded-sm transform rotate-30"></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-20 bg-teal-500 rounded-sm transform -rotate-20"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-2xl mx-auto space-y-8">
          
          {/* 404 with Book Icon */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <BookOpen className="w-16 h-16 text-amber-600" />
              <div className="text-6xl md:text-8xl font-bold text-amber-600">
                404
              </div>
              <Library className="w-16 h-16 text-amber-600" />
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-amber-900">
              Chapter Not Found
            </h1>
            <p className="text-lg text-amber-800 max-w-md mx-auto leading-relaxed">
              It looks like this page has been checked out by another reader. 
              Let's help you find your next great read!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => window.history.back()}
              variant="outline" 
              size="lg"
              className="border-amber-300 text-amber-700 hover:bg-amber-50 font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous Page
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/'}
              size="lg"
              className="bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 font-semibold"
            >
              <Home className="w-4 h-4 mr-2" />
              Library Home
            </Button>
          </div>

          {/* Search Books Section */}
          <Card className="bg-gradient-to-r from-white to-amber-50 border-amber-200 shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                  <label className="text-sm font-medium text-amber-700">
                    Search for Books
                  </label>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Find your next favorite book..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    className="pl-10 bg-white border-amber-200 text-amber-900 placeholder-amber-400 focus:border-amber-400 focus:ring-amber-400"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Navigation */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-4">
              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-blue-800">
                  Popular Sections
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-50 text-xs"
                    onClick={() => window.location.href = '/fiction'}
                  >
                    Fiction
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-50 text-xs"
                    onClick={() => window.location.href = '/non-fiction'}
                  >
                    Non-Fiction
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-purple-300 text-purple-700 hover:bg-purple-50 text-xs"
                    onClick={() => window.location.href = '/romance'}
                  >
                    Romance
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-pink-300 text-pink-700 hover:bg-pink-50 text-xs"
                    onClick={() => window.location.href = '/mystery'}
                  >
                    Mystery
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help Text */}
          <p className="text-sm text-amber-600 font-medium">
            📚 Need help finding a book? Contact our librarians for assistance!
          </p>

        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;