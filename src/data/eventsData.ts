export interface EventItem {
  id: number;
  title: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  genre: string;
  category: 'All' | 'Trending' | 'Tonight' | 'This Week';
  musicType: 'Techno' | 'Afrobeats' | 'Indie' | 'House';
  attendees: number;
  hot: boolean;
  color: string;
  tag: string;
  price: string;
  description: string;
  lineup: string[];
  remainingPasses: number;
}

export interface UserTicket {
  id: string;
  eventId: number;
  eventTitle: string;
  venue: string;
  date: string;
  time: string;
  ticketType: string;
  obtainedAt: string;
  qrCodeData: string;
  status: 'CONFIRMED' | 'CHECKED_IN';
}

export const MOCK_EVENTS: EventItem[] = [
  {
    id: 1,
    title: 'Neon Nights',
    venue: 'Club Noir, Worli',
    city: 'Mumbai',
    date: 'Tonight',
    time: '10:00 PM – 4:30 AM',
    genre: 'Techno · Peak Time',
    category: 'Tonight',
    musicType: 'Techno',
    attendees: 312,
    hot: true,
    color: 'from-purple-600 via-pink-600 to-rose-600',
    tag: 'MEMBERS ONLY',
    price: 'Free with Pass',
    description: 'A subterranean descent into Berlin-inspired industrial techno, pulsating strobes, and heavyweight analog bass. Strictly 21+ vibe verified crowd.',
    lineup: ['Vektor (Live Modular)', 'Anaya (Afterlife Sound)', 'Dexter Noir'],
    remainingPasses: 18,
  },
  {
    id: 2,
    title: 'Rooftop Rave',
    venue: 'Skyline Penthouse, Aerocity',
    city: 'Delhi',
    date: 'Tonight',
    time: '9:00 PM – 3:00 AM',
    genre: 'Afrobeats · R&B · Amapiano',
    category: 'Tonight',
    musicType: 'Afrobeats',
    attendees: 185,
    hot: true,
    color: 'from-orange-500 via-rose-500 to-purple-600',
    tag: 'EARLY ACCESS',
    price: '20 HVTS',
    description: 'High-altitude panoramic views of the city skyline paired with infectious West African rhythms, Amapiano log-drums, and crafted botanical cocktails.',
    lineup: ['DJ Kojo', 'Zara Gold', 'Nairobi Collective'],
    remainingPasses: 24,
  },
  {
    id: 3,
    title: 'The Social Experiment',
    venue: 'Warehouse 7, Indiranagar',
    city: 'Bangalore',
    date: 'This Friday',
    time: '9:30 PM – 3:30 AM',
    genre: 'Indie Dance · Dark Disco',
    category: 'This Week',
    musicType: 'Indie',
    attendees: 240,
    hot: true,
    color: 'from-cyan-500 via-blue-600 to-purple-700',
    tag: 'TRENDING',
    price: 'Free with Pass',
    description: 'An immersive auditory playground blending retro analog synthesizers, French touch, and hypnotic basslines in a raw converted textile warehouse.',
    lineup: ['The Odd Couple', 'Synthetica', 'Rohan B2B Maya'],
    remainingPasses: 30,
  },
  {
    id: 4,
    title: 'Midnight Society',
    venue: 'The Sub-Vault, Vagator',
    city: 'Goa',
    date: 'This Saturday',
    time: '11:00 PM – Sunrise',
    genre: 'Hypnotic Deep Techno',
    category: 'Trending',
    musicType: 'Techno',
    attendees: 420,
    hot: true,
    color: 'from-fuchsia-600 via-purple-700 to-indigo-800',
    tag: 'EXCLUSIVE',
    price: '30 HVTS',
    description: 'A secretive gathering for late-night music purists under the open Goan night sky, featuring custom funktion-one sound and mind-bending laser projections.',
    lineup: ['Aura Echo', 'Monolith (Berlin)', 'Surya'],
    remainingPasses: 12,
  },
  {
    id: 5,
    title: 'Sunset Sessions',
    venue: 'Highline Beach Club, Juhu',
    city: 'Mumbai',
    date: 'This Sunday',
    time: '4:30 PM – 11:00 PM',
    genre: 'Melodic & Organic House',
    category: 'This Week',
    musicType: 'House',
    attendees: 195,
    hot: false,
    color: 'from-amber-500 via-rose-500 to-purple-600',
    tag: 'VIP ACCESS',
    price: 'Free with Pass',
    description: 'Golden hour melodies, barefoot sands, chilled spritzes, and warm sunset grooves as the Arabian sea breeze sweeps across the terrace.',
    lineup: ['Sol & Sound', 'Kavita Deep', 'Aarav (Sunset Set)'],
    remainingPasses: 45,
  },
  {
    id: 6,
    title: 'Friday After Dark',
    venue: 'District 9 Secret Floor, Koramangala',
    city: 'Bangalore',
    date: 'This Friday',
    time: '11:00 PM – 5:00 AM',
    genre: 'Hyperpop · UK Garage · Bass',
    category: 'Trending',
    musicType: 'Indie',
    attendees: 275,
    hot: true,
    color: 'from-emerald-500 via-teal-600 to-cyan-700',
    tag: 'SELLING FAST',
    price: '15 HVTS',
    description: 'High-energy, fast-paced futuristic pop edits, 2-step garage skips, and bass frequencies that shake the ribcage. Pure uninhibited extrovert energy.',
    lineup: ['Bassline Boyz', 'Pixel Princess', 'DJ Hypervibe'],
    remainingPasses: 8,
  },
];
