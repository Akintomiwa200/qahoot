import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Users,
  BookOpen,
  Trophy,
  ArrowRight,
  Gamepad2,
  Music,
  Palette,
  Rocket,
  Star,
  Heart
} from 'lucide-react';

// ────────────────────────────────────────────────────────────────────────────
// Solid Kahoot-style colour palette
// purple: #46178f  blue: #1368ce  green: #26890c  red: #e21b3c  amber: #ffa602
// ────────────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Rocket,
    title: 'Host a Quiz',
    description: 'Create custom quizzes & invite players worldwide',
    bg: '#46178f',
    border: '#250754',
    path: '/create-quiz',
    btnLabel: 'Create Quiz',
  },
  {
    icon: Users,
    title: 'Join a Battle',
    description: 'Enter a room code & compete in real-time',
    bg: '#1368ce',
    border: '#083c7d',
    path: '/join',
    btnLabel: 'Join Now',
  },
  {
    icon: BookOpen,
    title: 'Quiz Library',
    description: '1 000+ ready-to-play quizzes',
    bg: '#26890c',
    border: '#124a04',
    path: '/quiz-library',
    btnLabel: 'Explore',
  },
  {
    icon: Palette,
    title: 'Customise',
    description: 'Themes, music & power-ups',
    bg: '#e21b3c',
    border: '#870d21',
    path: '/quiz-settings',
    btnLabel: 'Settings',
  },
];

const STATS = [
  { icon: Gamepad2, value: '1M+',  label: 'Quizzes',   color: '#1368ce' },
  { icon: Users,    value: '50K+', label: 'Players',   color: '#e21b3c' },
  { icon: Star,     value: '4.9',  label: 'Rating',    color: '#ffa602' },
  { icon: Heart,    value: '100+', label: 'Countries', color: '#26890c' },
];

const BADGES = ['🚀 Fast-paced', '🎯 Real-time', '🏆 Leaderboards', '🎮 Power-ups'];

// Motion helpers
const fade = (delay = 0) => ({
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 110, damping: 16, delay },
  },
});

const tapHover = {
  hover: { scale: 1.04, y: -4, transition: { type: 'spring' as const, stiffness: 300, damping: 20 } },
  tap:   { scale: 0.96 },
};

// ────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: '#f0edf8' }}>

      {/* ── Solid geometric background shapes ─────────────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top-left triangle */}
        <motion.div
          className="absolute"
          style={{
            top: -80, left: -80,
            width: 340, height: 340,
            background: '#e21b3c',
            opacity: 0.18,
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          }}
          animate={{ rotate: [0, 6, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Top-right circle */}
        <motion.div
          className="absolute rounded-full"
          style={{
            top: 60, right: -60,
            width: 260, height: 260,
            background: '#ffa602',
            opacity: 0.22,
          }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Bottom-left square */}
        <motion.div
          className="absolute"
          style={{
            bottom: -60, left: 100,
            width: 220, height: 220,
            background: '#1368ce',
            opacity: 0.18,
            borderRadius: 24,
          }}
          animate={{ rotate: [0, 90, 180, 270, 360] }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
        />
        {/* Bottom-right diamond */}
        <motion.div
          className="absolute"
          style={{
            bottom: 40, right: 80,
            width: 200, height: 200,
            background: '#26890c',
            opacity: 0.18,
            transform: 'rotate(45deg)',
            borderRadius: 16,
          }}
          animate={{ rotate: [45, 55, 45] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-24">

        {/* Hero */}
        <motion.section
          variants={fade(0)}
          initial="hidden"
          animate="visible"
          className="text-center mb-20 space-y-6"
        >
          {/* Logo row */}
          <div className="flex items-center justify-center gap-4 mb-2">
            <motion.div
              animate={{ rotate: [0, 12, -12, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: 1 }}
            >
              <Trophy
                className="w-16 h-16 drop-shadow-md"
                style={{ color: '#ffa602' }}
                fill="#ffa602"
              />
            </motion.div>
          </div>

          <h1
            className="text-7xl md:text-9xl font-black uppercase tracking-tight leading-none"
            style={{ color: '#46178f', letterSpacing: '-0.02em' }}
          >
            QuizBlast
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-gray-700 max-w-xl mx-auto">
            Real-time quiz battles. Test your knowledge.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {BADGES.map((b, i) => (
              <motion.span
                key={b}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                whileHover={{ scale: 1.08 }}
                className="px-5 py-2.5 bg-white border-2 border-gray-200 rounded-2xl text-base font-bold text-gray-700 shadow-sm cursor-default select-none"
              >
                {b}
              </motion.span>
            ))}
          </div>
        </motion.section>

        {/* Feature cards */}
        <motion.section
          variants={fade(0.15)}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                custom={i}
                variants={tapHover}
                whileHover="hover"
                whileTap="tap"
                className="flex flex-col cursor-pointer"
                onClick={() => navigate(f.path)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && navigate(f.path)}
              >
                {/* Card */}
                <div
                  className="flex flex-col flex-1 rounded-3xl overflow-hidden shadow-xl"
                  style={{ border: `4px solid ${f.border}`, background: '#fff' }}
                >
                  {/* Coloured banner */}
                  <div
                    className="flex items-center justify-center py-8"
                    style={{ background: f.bg }}
                  >
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                      <Icon className="w-9 h-9 text-white" />
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-col flex-1 p-6 gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-gray-800 mb-1">{f.title}</h2>
                      <p className="text-base font-medium text-gray-500">{f.description}</p>
                    </div>

                    {/* Kahoot-style button */}
                    <button
                      className="mt-auto flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-lg font-black text-white transition-all active:translate-y-1"
                      style={{
                        background: f.bg,
                        borderBottom: `5px solid ${f.border}`,
                      }}
                      onClick={e => { e.stopPropagation(); navigate(f.path); }}
                    >
                      {f.btnLabel}
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.section>

        {/* Stats bar */}
        <motion.section
          variants={fade(0.25)}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {STATS.map(s => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                whileHover={{ y: -6 }}
                className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-md"
                style={{ borderBottom: `5px solid ${s.color}` }}
              >
                <Icon className="w-8 h-8 mb-3" style={{ color: s.color }} />
                <span className="text-4xl font-black text-gray-800">{s.value}</span>
                <span className="mt-1 text-sm font-bold uppercase tracking-widest text-gray-400">
                  {s.label}
                </span>
              </motion.div>
            );
          })}
        </motion.section>

        {/* CTA Banner */}
        <motion.section
          variants={fade(0.35)}
          initial="hidden"
          animate="visible"
          className="relative overflow-hidden rounded-3xl text-center px-8 py-16 shadow-2xl"
          style={{
            background: '#ffa602',
            borderBottom: '8px solid #cc8502',
          }}
        >
          {/* Small decorative squares */}
          {[
            { size: 60, top: -20, left: 40,  rotate: 22,  color: '#e21b3c', opacity: 0.35 },
            { size: 80, bottom: -30, right: 60, rotate: -15, color: '#46178f', opacity: 0.3  },
          ].map((s, i) => (
            // biome-ignore lint: decorative element, key is stable
            <div
              key={i}
              className="absolute pointer-events-none"
              style={{
                width: s.size, height: s.size,
                background: s.color,
                opacity: s.opacity,
                borderRadius: 10,
                top: s.top, bottom: s.bottom,
                left: s.left, right: s.right,
                transform: `rotate(${s.rotate}deg)`,
              }}
            />
          ))}

          <h2 className="text-5xl md:text-6xl font-black uppercase text-white drop-shadow-sm mb-4">
            Ready to Play?
          </h2>
          <p className="text-xl font-bold text-white/90 mb-10 max-w-lg mx-auto">
            Jump into the ultimate real-time quiz experience!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <motion.button
              whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
              onClick={() => navigate('/create-quiz')}
              className="px-10 py-5 rounded-2xl text-xl font-black text-white transition-all active:translate-y-1"
              style={{ background: '#46178f', borderBottom: '5px solid #250754' }}
            >
              🚀 Start Hosting
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
              onClick={() => navigate('/join')}
              className="px-10 py-5 rounded-2xl text-xl font-black text-[#46178f] bg-white transition-all active:translate-y-1"
              style={{ borderBottom: '5px solid #ccc' }}
            >
              🎮 Join Game
            </motion.button>
          </div>
        </motion.section>

        {/* Footer note */}
        <motion.footer
          variants={fade(0.45)}
          initial="hidden"
          animate="visible"
          className="mt-16 flex flex-wrap justify-center gap-8 text-sm font-bold text-gray-400 uppercase tracking-widest"
        >
          <span className="flex items-center gap-2">
            <Music className="w-4 h-4" style={{ color: '#46178f' }} />
            Music &amp; Sounds
          </span>
          <span className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4" style={{ color: '#e21b3c' }} />
            WebSocket Technology
          </span>
          <span>© 2026 QuizBlast</span>
        </motion.footer>
      </div>
    </div>
  );
}
