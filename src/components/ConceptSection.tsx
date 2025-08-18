import { motion } from "framer-motion";
import { Music, Heart, MapPin } from "lucide-react";

const ConceptSection = () => {
  const features = [
    {
      icon: Music,
      title: "Intimate acoustics",
      description: "Small-group concerts for a unique musical experience",
    },
    {
      icon: Heart,
      title: "Warm atmosphere",
      description: "Dim lighting and cozy atmosphere on Geneva",
    },
    {
      icon: MapPin,
      title: "Secret venues",
      description: "Private concerts with secret locations",
    },
  ];

  return (
    <section
      id="concept"
      className="py-20 md:px-6 bg-gradient-to-b from-background to-lowlight-charcoal"
    >
      <div className="container mx-auto max-w-4xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-serif font-light text-gradient mb-6">
            The Concept
          </h2>
          <div className="space-y-6 text-lg text-muted-foreground max-w-3xl mx-auto">
            <p>
              The Lowlight Sessions reinvents the concert experience by creating
              moments of musical intimacy in Geneva.
            </p>
            <p>
              Each session is designed as an enchanted interlude where music
              meets urban architecture, under the Geneva stars.
            </p>
            <p>
              With a deliberately limited capacity and special attention to
              ambiance, we create unique memories for music lovers seeking
              authenticity.
            </p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-amber rounded-full flex items-center justify-center shadow-amber">
                <feature.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-serif text-primary mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConceptSection;
