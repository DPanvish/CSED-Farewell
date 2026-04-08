import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ChevronDown, Camera, Users, Heart } from 'lucide-react';

import GroupMemories from './components/GroupMemories';
import ImmersiveHallOfFame from './components/ImmersiveHallOfFame';
import BackgroundMusic from './components/BackgroundMusic';

gsap.registerPlugin(ScrollTrigger);

const splitTextToWords = (text) => {
  const words = text.split(" ");
  return words.map((word, index) => (
    <span
      key={`${word}-${index}`}
      className="word inline-block opacity-0 [transform:translateY(2rem)] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
    >
      {word}
      {index < words.length - 1 ? "\u00A0" : ""}
    </span>
  ));
};

function App() {
  const container = useRef();
  
  useGSAP(() => {
    // 1. Hero Text Reveal
    const loadTl = gsap.timeline();
    
    loadTl.to(".word", {
      y: 0,
      opacity: 1,
      duration: 1.2,
      stagger: 0.15,
      ease: "power4.out",
      delay: 0.2 
    })
    .to(".scroll-indicator", { opacity: 1, duration: 1 }, "-=0.5");

    // 2. Hero Pin & Zoom-out
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: 1,
      }
    });

    scrollTl.to(".college-wrapper", { opacity: 0, scale: 1.5, filter: "blur(10px)", duration: 2 })
            .to(".scroll-indicator", { opacity: 0, duration: 0.5 }, "<")
            .fromTo(".batch-name", 
              { opacity: 0, y: 100, scale: 0.8 }, 
              { opacity: 1, y: 0, scale: 1, duration: 2 }
            );

    // 3. SECTION HEADERS REVEAL ANIMATIONS
    const sectionHeaders = gsap.utils.toArray('.section-transition');

    sectionHeaders.forEach((header) => {
      const icon = header.querySelector('.transition-icon');
      const title = header.querySelector('.transition-title');
      const line = header.querySelector('.transition-line');

      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: header,
          start: "top 75%", 
          end: "center center",
          toggleActions: "play none none reverse",
        }
      });

      headerTl.fromTo(title, 
        { opacity: 0, y: 80, rotationX: -45, transformPerspective: 1000 },
        { opacity: 1, y: 0, rotationX: 0, duration: 1.2, ease: "power3.out" }
      )
      .fromTo(icon, 
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" }, 
        "-=0.8"
      )
      .fromTo(line,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.6"
      );

      // Text moves slower than scroll for depth
      gsap.to(header.querySelector('.transition-content'), {
        y: 100,
        ease: "none",
        scrollTrigger: {
          trigger: header,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });

    // 4. THE CURTAIN PUSH EXIT (For Swiper Sections)
    // As you scroll past a main section, it shrinks and blurs into the background
    const swiperSections = gsap.utils.toArray('.swiper-section-wrapper');
    
    swiperSections.forEach((section) => {
        gsap.to(section, {
            scale: 0.9,
            opacity: 0,
            filter: "blur(20px)",
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "bottom 90%", // Triggers right as you leave the bottom of the swiper
                end: "bottom top",
                scrub: true
            }
        });
    });

    // 5. FOOTER REVEAL
    gsap.fromTo(".footer-content", 
        { y: -50, opacity: 0 },
        { 
            y: 0, opacity: 1, 
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".footer-section",
                start: "top bottom",
                end: "bottom bottom",
                scrub: 1
            }
        }
    );

  }, { scope: container });

  return (
    <div ref={container} className="relative w-full font-inter bg-black">

      <BackgroundMusic />
      
      {/* Background Texture */}
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay" 
           style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/stardust.png')` }}>
      </div>

      {/* 1. HERO SECTION */}
      <section className="hero-section h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
        <div className="college-wrapper absolute flex flex-col items-center justify-center w-full">
          <h1 className="text-4xl md:text-6xl font-space font-bold text-center px-4">
            {splitTextToWords("Batch 2K22 - 2K26 CSE-D")}
          </h1>
        </div>
        
        <div className="batch-name absolute opacity-0 flex flex-col items-center w-full z-10">
          <h2 className="text-4xl md:text-7xl font-space font-bold tracking-tight text-center text-white px-4">
            Raghu Institute of Technology
          </h2>
          <p className="mt-4 text-xl md:text-2xl tracking-[0.2em] uppercase text-gray-400 font-light text-center px-4">
            Computer Science Engineering
          </p>
        </div>

        <div className="scroll-indicator absolute bottom-10 opacity-0 flex flex-col items-center text-gray-500 animate-bounce">
          <span className="text-sm tracking-widest uppercase mb-2">Scroll to explore</span>
          <ChevronDown size={24} />
        </div>
      </section>

      {/* --------------------------------------------------------- */}
      {/* TRANSITION SCREEN 1: THE ARCHIVES */}
      {/* --------------------------------------------------------- */}
      <section className="section-transition h-[60vh] md:h-[80vh] w-full bg-[#030303] flex items-center justify-center relative overflow-hidden z-20">
        <div className="transition-content flex flex-col items-center text-center px-4">
          <div className="transition-icon w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(59,130,246,0.15)]">
            <Camera size={40} className="text-blue-500" />
          </div>
          
          <h2 className="transition-title text-5xl md:text-8xl font-space font-black text-white tracking-tighter drop-shadow-2xl">
            The Archives.
          </h2>
          
          <div className="transition-line w-24 md:w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mt-8 rounded-full origin-left" />
          
          <p className="transition-title mt-6 text-gray-500 font-mono tracking-widest uppercase text-sm md:text-base">
            4 Years of Memories
          </p>
        </div>
      </section>

      {/* 2. GROUP MEMORIES COMPONENT */}
      <section className="swiper-section-wrapper relative w-full z-10 bg-black">
        <GroupMemories />
      </section>


      {/* --------------------------------------------------------- */}
      {/* TRANSITION SCREEN 2: HALL OF FAME */}
      {/* --------------------------------------------------------- */}
      {/* Notice z-20 here. It ensures this screen slides OVER the shrinking Group Memories */}
      <section className="section-transition h-[60vh] md:h-[80vh] w-full bg-[#030303] flex items-center justify-center relative overflow-hidden z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
        <div className="transition-content flex flex-col items-center text-center px-4">
          <div className="transition-icon w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(236,72,153,0.15)]">
            <Users size={40} className="text-pink-500" />
          </div>
          
          <h2 className="transition-title text-5xl md:text-8xl font-space font-black text-white tracking-tighter drop-shadow-2xl">
            Hall of Fame.
          </h2>
          
          <div className="transition-line w-24 md:w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mt-8 rounded-full origin-left" />
          
          <p className="transition-title mt-6 text-gray-500 font-mono tracking-widest uppercase text-sm md:text-base">
            The Class of CSE-D
          </p>
        </div>
      </section>

      {/* 3. HALL OF FAME COMPONENT */}
      <section className="swiper-section-wrapper relative w-full z-10 bg-black">
        <ImmersiveHallOfFame />
      </section>

      {/* --------------------------------------------------------- */}
      {/* THE FINALE / FOOTER */}
      {/* --------------------------------------------------------- */}
      <footer className="footer-section h-[40vh] w-full bg-[#050505] flex items-center justify-center relative z-20 border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
        <div className="footer-content flex flex-col items-center text-center px-4">
            <h2 className="text-3xl md:text-5xl font-space font-bold text-white mb-4">
                End of an Era.
            </h2>
            <p className="text-gray-500 font-mono tracking-widest uppercase text-sm flex items-center gap-2">
                Signing off <Heart size={14} className="text-pink-500" /> 2026
            </p>
        </div>
      </footer>

    </div>
  );
}

export default App;