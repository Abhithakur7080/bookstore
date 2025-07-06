import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const newBooks = [
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    image: "https://m.media-amazon.com/images/I/71g2ednj0JL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    title: "Ikigai",
    author: "Héctor García, Francesc Miralles",
    image: "https://m.media-amazon.com/images/I/81l3rZK4lnL.jpg",
  },
  {
    title: "Can't Hurt Me",
    author: "David Goggins",
    image: "https://m.media-amazon.com/images/I/71m-MxdJ2WL.jpg",
  },
];

const NewArrivals = () => {
  return (
    <section className="py-16 w-full bg-muted/40 border-t">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">✨ New Arrivals</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Fresh reads added weekly — grab them before they’re gone!
            </p>
          </div>
          <Button variant="outline" size="sm">
            Browse All
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {newBooks.map((book, index) => (
            <Card key={index} className="group transition-all hover:shadow-lg">
              <CardHeader className="p-0 overflow-hidden">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </CardHeader>
              <CardContent className="pt-4">
                <CardTitle className="text-lg font-semibold text-foreground">{book.title}</CardTitle>
                <p className="text-sm text-muted-foreground">by {book.author}</p>
                <Button className="mt-4 w-full text-sm" variant="secondary">
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
