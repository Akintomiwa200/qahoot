import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Zap, 
  Users, 
  BookOpen, 
  Settings, 
  Trophy, 
  Sparkles,
  ArrowRight,
  Gamepad2,
  Music,
  Palette,
  Crown,
  Flame,
  Rocket,
  Target,
  Star,
  Heart
} from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeBlob, setActiveBlob] = useState(0);
  const [floatingNumbers, setFloatingNumbers] = useState<{ id: number; x: number; y: number; value: number }[]>([]);

  // Animated floating particles effect
  useEffect(() => {
    const interval = setInterval(() => {
      setFloatingNumbers(prev => [
        ...prev,
        {
          id: Date.now(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          value: Math.floor(Math.random() * 1000)
        }
      ].slice(-8));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    }
  };

  const cardVariants = {
    hover: {
      scale: 1.05,
      y: -8,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 15
      }
    },
    tap: { scale: 0.98 }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse" as const
    }
  };

  const features = [
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Host a Quiz",
      description: "Create custom quizzes & invite players worldwide",
      color: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/20 to-pink-500/20",
      onClick: () => navigate('/create-quiz'),
      buttonText: "Create Quiz",
      buttonVariant: "default" as const
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Join a Battle",
      description: "Enter room code & compete in real-time",
      color: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/20 to-cyan-500/20",
      onClick: () => navigate('/join'),
      buttonText: "Join Now",
      buttonVariant: "secondary" as const
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Quiz Library",
      description: "1000+ ready-to-play quizzes",
      color: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/20 to-emerald-500/20",
      onClick: () => navigate('/quiz-library'),
      buttonText: "Explore",
      buttonVariant: "outline" as const
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Customize",
      description: "Themes, music & power-ups",
      color: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/20 to-red-500/20",
      onClick: () => navigate('/quiz-settings'),
      buttonText: "Settings",
      buttonVariant: "outline" as const
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Animated Gradient Blobs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/30 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
      />

      {/* Floating Score Numbers Effect */}
      <AnimatePresence>
        {floatingNumbers.map(num => (
          <motion.div
            key={num.id}
            className="absolute text-primary/40 font-bold text-2xl pointer-events-none"
            initial={{ x: `${num.x}%`, y: `${num.y}%`, opacity: 0, scale: 0.5 }}
            animate={{ y: `${num.y - 20}%`, opacity: [0, 1, 0], scale: [0.5, 1, 0.8] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3 }}
          >
            +{num.value}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section with Enhanced Animation */}
        <motion.div variants={itemVariants} className="text-center space-y-6 mb-16">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20"
            whileHover={{ scale: 1.05 }}
          >
            <Flame className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">🔥 50,000+ Active Players</span>
          </motion.div>

          <div className="space-y-4">
            <motion.div
              className="flex items-center justify-center gap-4"
              animate={pulseAnimation}
            >
              <Zap className="w-16 h-16 text-primary" />
              <Sparkles className="w-8 h-8 text-secondary" />
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
              QuizBlast
            </h1>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <Trophy className="w-12 h-12 text-primary mx-auto" />
            </motion.div>
          </div>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Real-time quiz battles. Test your knowledge. Compete with friends.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {['🚀 Fast-paced', '🎯 Real-time', '🏆 Leaderboards', '🎮 Power-ups'].map((badge, idx) => (
              <motion.span
                key={idx}
                className="px-4 py-2 bg-muted rounded-full text-sm font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                whileHover={{ scale: 1.1, backgroundColor: "hsl(var(--primary) / 0.1)" }}
              >
                {badge}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div variants={itemVariants} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardHeader>
                  {/* Animated gradient overlay on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0`}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="relative z-10 space-y-4">
                    <motion.div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      {React.cloneElement(feature.icon, { className: "w-8 h-8 text-white" })}
                    </motion.div>
                    <CardTitle className="text-xl">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <Button
                    variant={feature.buttonVariant}
                    className="w-full group"
                    onClick={feature.onClick}
                  >
                    {feature.buttonText}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section with Counters */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: <Gamepad2 className="w-6 h-6" />, value: "1M+", label: "Quizzes Played" },
            { icon: <Users className="w-6 h-6" />, value: "50K+", label: "Daily Players" },
            { icon: <Star className="w-6 h-6" />, value: "4.9", label: "App Rating" },
            { icon: <Heart className="w-6 h-6" />, value: "100+", label: "Countries" }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              className="text-center p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="flex justify-center mb-2 text-primary">{stat.icon}</div>
              <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Banner */}
        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden border-2 border-primary/50 bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardContent className="p-8 md:p-12">
              <div className="text-center space-y-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="inline-block"
                >
                  <Crown className="w-16 h-16 text-primary" />
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold">Ready to Play?</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Join millions of players in the ultimate quiz battle experience!</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="text-lg px-8"
                    onClick={() => navigate('/create-quiz')}
                  >
                    <Rocket className="w-5 h-5 mr-2" />
                    Start Hosting
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8"
                    onClick={() => navigate('/join')}
                  >
                    <Target className="w-5 h-5 mr-2" />
                    Join Game
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div variants={itemVariants} className="mt-16 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            © 2026 QuizBlast. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Music className="w-3 h-3" />
              🎵 Play with music & sound effects
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              ⚡ Real-time WebSocket technology
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;
