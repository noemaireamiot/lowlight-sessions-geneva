import { useState } from "react";
import { motion } from "framer-motion";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with Supabase
    console.log("Newsletter signup:", { email, consent });
  };

  return (
    <motion.section
      className="py-16 md:px-6 bg-gradient-to-r from-lowlight-charcoal to-lowlight-smoke"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto max-w-2xl text-center">
        <h3 className="text-3xl font-serif text-gradient mb-4">
          Stay informed
        </h3>
        <p className="text-muted-foreground mb-8">
          Receive announcements for upcoming sessions in advance
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4"
        >
          <input
            type="email"
            placeholder="Your email"
            className="input-elegant flex-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn-hero px-8">
            Subscribe
          </button>
        </form>
      </div>
    </motion.section>
  );
};

export default NewsletterSection;
