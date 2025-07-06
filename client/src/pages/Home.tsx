import {
  useGetFeaturedBooksQuery,
  useGetNewArrivalsQuery,
  useGetPopularBooksQuery,
} from "@/services/book.service";
//components
import BooksSlider from "@/components/home/BooksSlider";
import Hero from "@/components/home/Hero";
import AboutSection from "@/components/home/AboutSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import PromoBanner from "@/components/home/PromoBanner";
import CookiesBanner from "@/components/home/CookieBanner";


const Home = () => {
const { data: newArrivalsData, isLoading: loadingNew } = useGetNewArrivalsQuery();
const { data: featuredBooksData, isLoading: loadingFeatured } = useGetFeaturedBooksQuery();
const { data: popularBooksData, isLoading: loadingPopular } = useGetPopularBooksQuery();

const newArrivals = newArrivalsData?.books ?? [];
const featuredBooks = featuredBooksData?.books ?? [];
const popularBooks = popularBooksData?.books ?? [];
  return (
    <section className="min-h-screen">
      <Hero />
      <BooksSlider
        books={newArrivals}
        title="New Arrivals"
        slogan="Fresh titles just in"
        loading={loadingNew}
      />
      <BooksSlider
        books={featuredBooks}
        title="Featured Books"
        slogan="Handpicked titles just for you"
        loading={loadingFeatured}
      />
      <AboutSection />
      <BooksSlider
        books={popularBooks}
        title="Popular Books"
        slogan="Bestsellers and trending titles"
        loading={loadingPopular}
      />
      <FeaturesSection />
      <PromoBanner />
      <CookiesBanner />
    </section>
  );
};


export default Home;
