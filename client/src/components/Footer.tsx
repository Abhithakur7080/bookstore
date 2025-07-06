import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  Mail,
  MapPin,
  Phone,
  Rss,
  TwitterIcon,
  ArrowRight,
  Heart,
  Star,
} from "lucide-react";
import {
  useMeQuery,
  useToggleNewsletterMutation,
} from "@/services/user.service";
import toast from "react-hot-toast";

const Footer = () => {
  const { data, isLoading: loadingUser, refetch } = useMeQuery();
  const [toggleNewsletter, { isLoading }] = useToggleNewsletterMutation();

  const email = data?.user?.email || "";
  const subscribed = data?.user?.preferences?.newsletterSubscribed || false;

  const handleSubscribe = async () => {
    try {
      await toggleNewsletter({ subscribed: !subscribed }).unwrap();
      await refetch();
      toast(subscribed ? "Newsletter Unsubscribed" : "Newsletter Subscribed", {
  icon: "✨",
});
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const linkList = [
    { title: "Browse Books", isNew: false },
    { title: "Gift Cards", isNew: true },
    { title: "Return Policy", isNew: false },
    { title: "Terms of Service", isNew: false },
  ];

  const communityList = [
    { title: "Book Clubs", isNew: false },
    { title: "Author Events", isNew: true },
    { title: "Blog & Tips", isNew: false },
    { title: "Affiliate Program", isNew: false },
  ];

  const renderList = (items: { title: string; isNew: boolean }[]) =>
    items.map((item, i) => (
      <li
        key={i}
        className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-200"
      >
        <ArrowRight className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
        <Button
          variant="link"
          className="p-0 h-auto text-sm text-inherit font-normal hover:underline hover:underline-offset-4"
        >
          {item.title}
        </Button>
        {item.isNew && (
          <Badge
            variant="secondary"
            className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 border-green-200"
          >
            New
          </Badge>
        )}
      </li>
    ));

  return (
    <footer className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-muted-foreground relative overflow-hidden">
      {/* Background visuals */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />

      <div className="relative z-10 pt-16 pb-0">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                Book Store
              </h2>
              <p className="text-base leading-relaxed text-slate-600 max-w-md">
                Your gateway to timeless stories and infinite possibilities. Discover books that
                inspire, educate, and transform your world — all in one magical place.
              </p>

              {/* Trust */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                  <span className="text-sm text-slate-600 ml-1">4.9/5 (2.1k reviews)</span>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-4 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg">
                  <Rss className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Stay in the Loop</p>
                  <p className="text-xs text-slate-600">Join 50,000+ book lovers</p>
                </div>
              </div>
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  type="email"
                  readOnly
                  value={email}
                  placeholder="Your email"
                  className="bg-white/80 border-white/40 cursor-not-allowed"
                />
                <Button
                  disabled={isLoading || loadingUser}
                  onClick={handleSubscribe}
                  className={`whitespace-nowrap  shadow-lg ${isLoading ? "opacity-50 cursor-not-allowed" : " cursor-pointer"} ${subscribed ? "bg-gradient-to-b from-gray-900 to-gray-500" : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"}`}
                >
                  {subscribed ? "Unsubscribe" : "Subscribe"}
                </Button>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Heart className="w-3 h-3 text-red-400" />
                Get curated book recommendations, exclusive offers, and literary events.
              </p>
            </div>
          </div>

          {/* Lists */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
              Learn More
            </h3>
            <ul className="space-y-3">{renderList(linkList)}</ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full" />
              Our Community
            </h3>
            <ul className="space-y-3">{renderList(communityList)}</ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full" />
              Contact Us
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3 group">
                <div className="p-2 bg-blue-100 group-hover:bg-blue-200 rounded-lg transition-colors">
                  <Phone className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">+91 98765 43210</p>
                  <p className="text-xs text-slate-500">Mon-Fri, 9AM-6PM</p>
                </div>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-2 bg-green-100 group-hover:bg-green-200 rounded-lg transition-colors">
                  <Mail className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">support@bookstore.in</p>
                  <p className="text-xs text-slate-500">24/7 support</p>
                </div>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-2 bg-purple-100 group-hover:bg-purple-200 rounded-lg transition-colors">
                  <MapPin className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">New Delhi, India</p>
                  <p className="text-xs text-slate-500">Visit our store</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-slate-200/50" />

        {/* Footer Bottom */}
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-6 bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-t-lg">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-white">
            <p>© {new Date().getFullYear()} Book Store Inc. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Button variant="link" className="p-0 h-auto text-xs text-white">
                Privacy Policy
              </Button>
              <Button variant="link" className="p-0 h-auto text-xs text-white">
                Cookie Policy
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-white mr-2">Follow us:</span>
            <div className="flex gap-2">
              {[
                {
                  icon: TwitterIcon,
                  label: "Twitter",
                  color: "hover:bg-blue-100 hover:text-blue-600",
                },
                {
                  icon: FacebookIcon,
                  label: "Facebook",
                  color: "hover:bg-blue-100 hover:text-blue-700",
                },
                {
                  icon: InstagramIcon,
                  label: "Instagram",
                  color: "hover:bg-pink-100 hover:text-pink-600",
                },
                {
                  icon: LinkedinIcon,
                  label: "LinkedIn",
                  color: "hover:bg-blue-100 hover:text-blue-700",
                },
              ].map(({ icon: Icon, label, color }) => (
                <Button
                  key={label}
                  variant="ghost"
                  size="icon"
                  aria-label={label}
                  className={`rounded-full text-white h-9 w-9 transition-all duration-200 ${color}`}
                >
                  <Icon className="w-4 h-4" />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
