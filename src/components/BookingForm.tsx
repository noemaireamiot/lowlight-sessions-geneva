import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    quantity: 1,
    promoCode: '',
    acceptTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Integrate with Supabase and Stripe
    setTimeout(() => {
      setIsLoading(false);
      console.log('Booking form submitted:', formData);
    }, 2000);
  };

  return (
    <section id="booking" className="py-20 px-6 bg-lowlight-charcoal">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-serif font-light text-gradient mb-6">
            Réservation
          </h2>
          <p className="text-xl text-muted-foreground">
            Réservez votre place pour la prochaine session
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="card-event space-y-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Prénom *
              </label>
              <input
                type="text"
                required
                className="input-elegant w-full"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nom *
              </label>
              <input
                type="text"
                required
                className="input-elegant w-full"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              E-mail *
            </label>
            <input
              type="email"
              required
              className="input-elegant w-full"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nombre de places (max 4)
            </label>
            <select
              className="input-elegant w-full"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
            >
              {[1, 2, 3, 4].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Code promo (optionnel)
            </label>
            <input
              type="text"
              className="input-elegant w-full"
              value={formData.promoCode}
              onChange={(e) => setFormData({ ...formData, promoCode: e.target.value })}
            />
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="terms"
              required
              className="mt-1"
              checked={formData.acceptTerms}
              onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
            />
            <label htmlFor="terms" className="text-sm text-muted-foreground">
              J'accepte les conditions générales et la politique de confidentialité *
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-hero w-full text-lg py-4 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Traitement...
              </span>
            ) : (
              'Payer maintenant'
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default BookingForm;