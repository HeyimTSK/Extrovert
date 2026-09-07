import { useState } from 'react';
import {
  Users,
  UserPlus,
  Check,
  Sparkles,
  MapPin,
  TrendingUp,
  MessageSquare,
  Heart,
  Share2,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface Person {
  id: string;
  name: string;
  username: string;
  avatarColor: string;
  vibe: string;
  favoriteGenre: string;
  location: string;
  attendingEvent?: string;
  mutualConnections: number;
}

const SUGGESTED_PEOPLE: Person[] = [
  {
    id: 'user_1',
    name: 'Sarah Chen',
    username: 'sarah_techno',
    avatarColor: 'from-purple-500 to-pink-500',
    vibe: 'Berlin underground regular · Vinyl hunter',
    favoriteGenre: 'Peak Time Techno',
    location: 'Mumbai',
    attendingEvent: 'Neon Nights',
    mutualConnections: 14,
  },
  {
    id: 'user_2',
    name: 'Marcus Vance',
    username: 'marcus_vibe',
    avatarColor: 'from-orange-500 to-rose-600',
    vibe: 'Afrobeats dancer & nightlife photographer',
    favoriteGenre: 'Afrobeats · Amapiano',
    location: 'Delhi',
    attendingEvent: 'Rooftop Rave',
    mutualConnections: 8,
  },
  {
    id: 'user_3',
    name: 'Priya Sharma',
    username: 'priya_bass',
    avatarColor: 'from-cyan-500 to-blue-600',
    vibe: 'Synthwave dreamer · Top 5% Extrovert',
    favoriteGenre: 'Indie Dance · Dark Disco',
    location: 'Bangalore',
    attendingEvent: 'The Social Experiment',
    mutualConnections: 21,
  },
  {
    id: 'user_4',
    name: 'Leo Rossi',
    username: 'leo_noir',
    avatarColor: 'from-fuchsia-600 to-indigo-700',
    vibe: 'Afterhours resident DJ & sound architect',
    favoriteGenre: 'Deep Melodic Techno',
    location: 'Goa',
    attendingEvent: 'Midnight Society',
    mutualConnections: 19,
  },
  {
    id: 'user_5',
    name: 'Ananya Roy',
    username: 'ananya_waves',
    avatarColor: 'from-amber-500 to-rose-500',
    vibe: 'Sunset chaser & barefoot terrace enthusiast',
    favoriteGenre: 'Organic House',
    location: 'Mumbai',
    attendingEvent: 'Sunset Sessions',
    mutualConnections: 11,
  },
  {
    id: 'user_6',
    name: 'Dev Malik',
    username: 'dev_hyper',
    avatarColor: 'from-emerald-500 to-teal-600',
    vibe: 'Garage skipper & modular synthesist',
    favoriteGenre: 'UK Garage · Hyperpop',
    location: 'Bangalore',
    attendingEvent: 'Friday After Dark',
    mutualConnections: 6,
  },
];

const INITIAL_POSTS = [
  {
    id: 1,
    author: 'Sarah Chen',
    username: 'sarah_techno',
    avatarColor: 'from-purple-500 to-pink-500',
    content: 'Just grabbed a guestlist pass for Neon Nights tonight. Who is stepping into the booth?',
    highlight: 'joined Rooftop Rave',
    time: '25m ago',
    likes: 18,
    comments: 4,
  },
  {
    id: 2,
    author: 'Alex Rivera',
    username: 'alex_extrovert',
    avatarColor: 'from-cyan-500 to-blue-600',
    content: 'The sound system at Warehouse 7 is unmatched. Setting up the pre-game crew now.',
    highlight: 'is attending Neon Nights',
    time: '1h ago',
    likes: 32,
    comments: 9,
  },
  {
    id: 3,
    author: 'Priya Sharma',
    username: 'priya_bass',
    avatarColor: 'from-amber-500 to-rose-500',
    content: 'Referred 2 friends to Nubpack and unlocked 60 HVTS tokens! Table reservation secured.',
    highlight: 'earned 20 HVTS',
    time: '3h ago',
    likes: 47,
    comments: 12,
  },
];

interface SocialPageProps {
  connectedUserIds: string[];
  onToggleConnect: (userId: string) => void;
}

export default function SocialPage({
  connectedUserIds,
  onToggleConnect,
}: SocialPageProps) {
  const { showToast } = useToast();
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  const toggleLike = (postId: number) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter(id => id !== postId));
    } else {
      setLikedPosts([...likedPosts, postId]);
      showToast('Liked post', 'info');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#1c1c1c]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/30">
              Extrovert Social Network
            </span>
            <span className="text-xs text-[#777]">· Realtime Community</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white">
            Community & Connections
          </h1>
          <p className="text-xs sm:text-sm text-[#888] mt-1 font-medium">
            Connect with verified partygoers, join pre-parties, and check live nightlife activity.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#121212] border border-[#222] text-xs font-bold text-purple-300 self-start sm:self-auto">
          <Users size={14} className="text-purple-400" />
          <span>{connectedUserIds.length} Connections</span>
        </div>
      </div>

      {/* ── 2-COLUMN RESPONSIVE LAYOUT (Suggested People & Activity Feed) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ── LEFT: SUGGESTED EXTROVERTS (7 Columns) ── */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold uppercase tracking-wide text-white flex items-center gap-2">
              <Sparkles size={16} className="text-purple-400" />
              Suggested People to Connect With
            </h2>
            <span className="text-xs text-[#666]">Mutual Vibe</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SUGGESTED_PEOPLE.map(person => {
              const isConnected = connectedUserIds.includes(person.id);
              return (
                <div
                  key={person.id}
                  className="bg-[#101010] border border-[#1e1e1e] hover:border-[#333] rounded-3xl p-5 flex flex-col justify-between gap-4 transition-all shadow-lg hover:shadow-purple-950/20"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${person.avatarColor} flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-md`}
                    >
                      {person.name.split(' ').map(n => n[0]).join('')}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-white truncate leading-tight">
                        {person.name}
                      </p>
                      <p className="text-xs text-[#888] truncate">
                        @{person.username}
                      </p>
                      <p className="text-[10px] text-purple-400 font-medium flex items-center gap-1 mt-1">
                        <MapPin size={10} /> {person.location} · {person.mutualConnections} mutual
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-[#AAA] line-clamp-2 leading-relaxed">
                    {person.vibe}
                  </p>

                  {person.attendingEvent && (
                    <div className="px-3 py-1.5 rounded-xl bg-[#161616] border border-[#242424] text-[11px] text-[#888] flex items-center justify-between">
                      <span className="text-[#666]">Attending:</span>
                      <span className="font-semibold text-purple-300 truncate max-w-[130px]">
                        {person.attendingEvent}
                      </span>
                    </div>
                  )}

                  {/* Connect Button */}
                  <button
                    onClick={() => {
                      onToggleConnect(person.id);
                      showToast(
                        isConnected
                          ? `Disconnected from ${person.name}`
                          : `Connection request sent to ${person.name}!`,
                        isConnected ? 'info' : 'success'
                      );
                    }}
                    id={`connect-btn-${person.id}`}
                    className={`
                      w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2
                      ${isConnected
                        ? 'bg-green-950/70 border border-green-500/40 text-green-400 hover:bg-green-900/40'
                        : 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white hover:opacity-90 shadow-md shadow-purple-950/30'
                      }
                    `}
                  >
                    {isConnected ? (
                      <>
                        <Check size={14} className="text-green-400" />
                        CONNECTED
                      </>
                    ) : (
                      <>
                        <UserPlus size={14} />
                        CONNECT
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: COMMUNITY ACTIVITY FEED (5 Columns) ── */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold uppercase tracking-wide text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-purple-400" />
              Nightlife Feed & Activity
            </h2>
            <span className="text-xs text-green-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Live
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {INITIAL_POSTS.map(post => {
              const isLiked = likedPosts.includes(post.id);
              return (
                <div
                  key={post.id}
                  className="bg-[#101010] border border-[#1e1e1e] rounded-3xl p-5 flex flex-col gap-3.5 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl bg-gradient-to-br ${post.avatarColor} flex items-center justify-center text-white font-bold text-xs shadow-sm`}
                      >
                        {post.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white leading-tight">
                          {post.author}
                        </p>
                        <p className="text-[10px] text-[#777]">
                          @{post.username} · {post.time}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-purple-300 bg-purple-950/40 px-2 py-0.5 rounded-md border border-purple-500/20">
                      {post.highlight}
                    </span>
                  </div>

                  <p className="text-xs text-[#CCC] leading-relaxed">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#181818] text-xs text-[#777]">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-pink-400 font-bold' : 'hover:text-[#AAA]'}`}
                    >
                      <Heart size={14} className={isLiked ? 'fill-pink-400 text-pink-400' : ''} />
                      <span>{post.likes + (isLiked ? 1 : 0)}</span>
                    </button>

                    <button
                      onClick={() => showToast('Opening discussion...', 'info')}
                      className="flex items-center gap-1.5 hover:text-[#AAA] transition-colors"
                    >
                      <MessageSquare size={14} />
                      <span>{post.comments} comments</span>
                    </button>

                    <button
                      onClick={() => showToast('Post shared', 'info')}
                      className="hover:text-[#AAA] transition-colors"
                    >
                      <Share2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
