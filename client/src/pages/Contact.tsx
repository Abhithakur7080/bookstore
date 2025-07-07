import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, MapPin, Phone, SendHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import { useSendContactMessageMutation } from "@/services/contact.service";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
type ContactFormData = z.infer<typeof contactSchema>;

const ContactPage = () => {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const [sendContactMessage, { isLoading }] = useSendContactMessageMutation();

  const onSubmit = async (values: ContactFormData) => {
    try {
      await sendContactMessage(values).unwrap();
      toast("Email received! Our team will contact you within 24 hours.", {
        icon: "✉️",
      });
      form.reset();
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Failed to send message.");
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-10 mt-[4.5rem]">
      {/* Page Title */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Get in Touch
        </h1>
        <p className="text-muted-foreground text-sm">
          We'd love to hear from you! Whether it's feedback, a question, or a
          partnership inquiry — drop us a message.
        </p>
      </div>

      {/* Grid: Contact Form + Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Inquiry subject..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your message..."
                      rows={6}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="mt-2">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Message <SendHorizontal className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>

        {/* Contact Info */}
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Phone className="text-primary w-5 h-5 mt-1" />
            <div>
              <p className="font-semibold">Phone</p>
              <p className="text-sm text-muted-foreground">+91 98765 43210</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Mail className="text-primary w-5 h-5 mt-1" />
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-sm text-muted-foreground">
                support@bookstore.in
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <MapPin className="text-primary w-5 h-5 mt-1" />
            <div>
              <p className="font-semibold">Address</p>
              <p className="text-sm text-muted-foreground">
                Book Store HQ, New Delhi, India
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
