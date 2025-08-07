"use client"
import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Navbar from "@/components/landingPage/Navbar";
import LandingPage from "@/components/landingPage/LandingPage";
import About from "@/components/landingPage/About";
import Services from "@/components/landingPage/Services";

export default function Home() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const floatingAnimation = {
    y: [0, -15, 0],
    transition: {
      y: {
        duration: 4,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      },
    },
  };

  return (
    <main className="flex min-h-screen flex-col items-center overflow-x-hidden">
      <Navbar />
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={containerVariants}
        className="w-full"
      >
        <motion.div id="home" variants={itemVariants}>
          <LandingPage floatingAnimation={floatingAnimation} />
        </motion.div>
        <motion.div id="about" variants={itemVariants}>
          <About />
        </motion.div>
        <motion.div id="services" variants={itemVariants}>
          <Services />
        </motion.div>
      </motion.div>
    </main>
  );
}