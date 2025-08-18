import { motion } from 'framer-motion';
import EventCard from './EventCard';

// Mock data - sera remplacé par des données Supabase
const upcomingEvents = [
  {
    id: '1',
    title: 'Jazz Quartet sous les étoiles',
    date: '2024-03-15',
    time: '19:30',
    location: 'Rooftop Eaux-Vives (adresse envoyée par e-mail)',
    price: 45,
    capacity: 25,
    remainingSpots: 8,
    status: 'available' as const,
    description: 'Une soirée jazz intime avec un quartet exceptionnel sur un rooftop avec vue sur le lac Léman.'
  },
  {
    id: '2',
    title: 'Acoustique Folk & Stories',
    date: '2024-03-22',
    time: '20:00',
    location: 'Rooftop Plainpalais (adresse envoyée par e-mail)',
    price: 40,
    capacity: 20,
    remainingSpots: 3,
    status: 'low-availability' as const,
    description: 'Concert acoustique intimiste alliant musique folk et récits, dans un cadre chaleureux.'
  },
  {
    id: '3',
    title: 'Electronic Sunset Session',
    date: '2024-03-29',
    time: '18:00',
    location: 'Rooftop Carouge (adresse envoyée par e-mail)',
    price: 50,
    capacity: 30,
    remainingSpots: 0,
    status: 'sold-out' as const,
    description: 'Musique électronique ambient et downtempo pour accompagner le coucher de soleil genevois.'
  }
];

const pastEvents = [
  {
    id: 'past-1',
    title: 'Piano Bar Nocturne',
    date: '2024-02-14',
    artist: 'Marie Delacroix',
    location: 'Rooftop Champel',
    year: '2024'
  },
  {
    id: 'past-2',
    title: 'Strings & Wine',
    date: '2024-01-28',
    artist: 'Geneva String Quartet',
    location: 'Rooftop Pâquis',
    year: '2024'
  },
  {
    id: 'past-3',
    title: 'Blues in the Mist',
    date: '2024-01-15',
    artist: 'John Mitchell Trio',
    location: 'Rooftop Servette',
    year: '2024'
  }
];

const SessionsSection = () => {
  const handleBookEvent = (eventId: string) => {
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleJoinWaitlist = (eventId: string) => {
    // TODO: Implement waitlist functionality with Supabase
    console.log('Join waitlist for event:', eventId);
  };

  return (
    <section id="sessions" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-serif font-light text-gradient mb-6">
            Prochaines Sessions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos concerts intimistes dans les plus beaux rooftops de Genève
          </p>
        </motion.div>

        {/* Upcoming Events */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <EventCard
                event={event}
                onBook={handleBookEvent}
                onWaitlist={handleJoinWaitlist}
              />
            </motion.div>
          ))}
        </div>

        {/* Past Events Section */}
        <motion.div
          className="border-t border-border pt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-serif font-light text-primary mb-8 text-center">
            Sessions Précédentes
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event, index) => (
              <motion.div
                key={event.id}
                className="card-event group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -3, scale: 1.02 }}
              >
                {/* Image placeholder */}
                <div className="relative h-32 bg-gradient-to-br from-lowlight-charcoal to-lowlight-smoke overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-muted-foreground text-center text-sm">
                      Photo fournie plus tard
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-lowlight-deep/60 to-transparent"></div>
                </div>

                <div className="p-4">
                  <h4 className="font-serif text-lg text-primary mb-2">
                    {event.title}
                  </h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{event.artist}</p>
                    <p>{event.location}</p>
                    <p>{new Date(event.date).toLocaleDateString('fr-CH')}</p>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                      {event.artist}
                    </span>
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                      {event.year}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SessionsSection;