import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Event } from "./EventCard";
import { toast } from "sonner";

const BookingForm = ({
  event,
  onClose,
}: {
  event: Event;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SUPABASE_URL
        }/functions/v1/booking-email?firstname=${formData.firstName}&lastname=${
          formData.lastName
        }&email=${formData.email}&eventUuid=${event.id}&eventName=${
          event.title
        }`
      );
      if (response.ok) {
        toast.success(
          "Your booking has been sent, check your email to confirm"
        );
        setIsLoading(false);
        onClose();
      } else {
        console.error("Failed to submit booking form");
        toast.error("Failed to submit booking form, please try again");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error submitting booking form:", error);
      toast.error("Failed to submit booking form, please try again");
      setIsLoading(false);
    }
  };

  return (
    <section id="booking" className="py-20 md:px-6 bg-lowlight-charcoal">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-serif font-light text-gradient mb-6">
            Booking
          </h2>
          <p className="text-xl text-muted-foreground">
            Reserve your spot for the {event.title} session
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="card-event space-y-6 p-7"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                First Name *
              </label>
              <input
                type="text"
                required
                className="input-elegant w-full"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Last Name *
              </label>
              <input
                type="text"
                required
                className="input-elegant w-full"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              className="input-elegant w-full"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-hero w-full text-lg py-4 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </span>
            ) : (
              "Book now"
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default BookingForm;
