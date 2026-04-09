import { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, Autoplay } from 'swiper/modules';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, ArrowRight, CornerDownLeft } from 'lucide-react';
import { studentsData } from '../data/studentsData';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const animateCardReset = (card) => {
  gsap.to(card, {
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    duration: 0.7,
    ease: "power3.out",
  });
};

const handleCardPointerMove = (event) => {
  if (event.pointerType !== 'mouse') return;

  const card = event.currentTarget;
  if (card.__tiltFrame) return;

  const rect = card.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const rotateX = ((y - centerY) / centerY) * -3;
  const rotateY = ((x - centerX) / centerX) * 3;

  card.__tiltFrame = requestAnimationFrame(() => {
    card.__tiltFrame = null;

    gsap.to(card, {
      rotateX,
      rotateY,
      scale: 1.01,
      duration: 0.35,
      ease: "power2.out",
      transformPerspective: 1500,
      overwrite: 'auto',
    });
  });
};

const handleCardPointerDown = (event) => {
  if (event.pointerType === 'mouse') return;

  gsap.to(event.currentTarget, {
    scale: 0.985,
    duration: 0.2,
    ease: "power2.out",
  });
};

const ImmersiveHallOfFame = () => {
  const componentRef = useRef();
  const breatheAnimation = useRef(null);
  const swiperRef = useRef(null);
  const observerRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(".swiper-slide-active .student-card-inner", 
      { opacity: 0, y: 40, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power4.out" }
    );

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const bgContainer = componentRef.current?.querySelector(".vortex-bg");
    if (bgContainer && bgContainer.children.length === 0) {
      const maxBackgroundPortraits = prefersReducedMotion ? 0 : window.innerWidth < 768 ? 0 : 4;
      const bgStudents = [...studentsData].sort(() => 0.5 - Math.random()).slice(0, maxBackgroundPortraits);
      bgStudents.forEach((student, i) => {
        const img = document.createElement("img");
        img.src = student.image;
        img.loading = "lazy";
        img.decoding = "async";
        img.className = "absolute w-12 h-12 md:w-20 md:h-20 rounded-full opacity-0 object-cover border border-white/5 grayscale blur-[2px]";
        bgContainer.appendChild(img);

        gsap.fromTo(img, 
          {
            x: gsap.utils.random(-window.innerWidth/1.5, window.innerWidth/1.5),
            y: gsap.utils.random(-window.innerHeight/1.5, window.innerHeight/1.5),
            z: gsap.utils.random(-1500, -500),
            opacity: 0
          },
          {
            opacity: gsap.utils.random(0.01, 0.04), 
            z: 300, 
            duration: gsap.utils.random(24, 36), 
            repeat: -1,
            delay: i * 0.2,
            ease: "none",
          }
        );
      });
    }
  }, { scope: componentRef });

  useEffect(() => () => {
    if (breatheAnimation.current) breatheAnimation.current.kill();
  }, []);

  useEffect(() => {
    const section = componentRef.current;
    const swiper = swiperRef.current;
    const autoplay = swiper?.autoplay;
    if (!section || !autoplay) return;

    const updateAutoplay = (isVisible) => {
      if (!swiper.initialized || !swiper.params.autoplay) return;

      if (isVisible) {
        autoplay.start?.();
      } else {
        autoplay.stop?.();
      }
    };

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        updateAutoplay(entry.isIntersecting);
      },
      { threshold: 0.45 }
    );

    observerRef.current.observe(section);

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      updateAutoplay(false);
    };
  }, []);

  return (
    <div ref={componentRef} className="relative w-full min-h-[100dvh] bg-black overflow-hidden font-inter flex flex-col">
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black z-0" />
      <div className="vortex-bg absolute inset-0 z-0 pointer-events-none [perspective:1000px] flex items-center justify-center" />

      <div className="w-full p-6 md:p-10 z-20 flex justify-between items-start shrink-0 relative">
        <div>
          <h2 className="text-4xl md:text-6xl font-space font-black text-white tracking-tighter drop-shadow-2xl">
            Hall of<br/>Fame.
          </h2>
          <div className="w-16 md:w-24 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 mt-4 rounded-full"/>
        </div>
        
        <div className="text-right hidden md:block">
          <p className="text-white/50 font-mono text-sm tracking-[0.2em]">RAGHU INSTITUTE OF TECHNOLOGY</p>
          <p className="text-blue-400 font-space tracking-[0.4em] text-xs mt-2 uppercase font-bold drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]">CSE Class of CSE-D</p>
        </div>
      </div>

      <div className="flex-1 w-full relative z-10 flex flex-col justify-center pb-24 md:pb-32 px-4 md:px-12">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onInit={(swiper) => {
            swiperRef.current = swiper;
            swiper.autoplay?.stop?.();
          }}
          modules={[Navigation, Pagination, Keyboard, Autoplay]}
          speed={450}
          spaceBetween={24}
          slidesPerView={1}
          centeredSlides={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            enabled: true,
          }}
          grabCursor={true}
          keyboard={{ enabled: true }}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          onSlideChange={(swiper) => {
            const activeSlide = swiper.slides[swiper.activeIndex];
            const innerCard = activeSlide.querySelector('.student-card-inner');
            const quoteText = activeSlide.querySelector('.student-quote');
            
            gsap.fromTo(innerCard,
              { opacity: 0, scale: 0.98 },
              { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
            );
            
            if (quoteText) {
                gsap.fromTo(quoteText, 
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.6, delay: 0.3, ease: "power2.out" }
                );
            }
          }}
          className="w-full h-full max-w-[1400px] aspect-[4/5] md:aspect-[4/3] lg:aspect-[16/9] max-h-[85vh]"
        >
          {studentsData.map((student, index) => (
            <SwiperSlide key={student.id} className="flex items-center justify-center p-2">
                
              <div 
                className="student-card-inner relative flex h-full w-full flex-col bg-zinc-900 rounded-[2rem] md:rounded-[3rem] overflow-hidden group shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/10 md:block"
                onPointerMove={handleCardPointerMove}
                onPointerLeave={(e) => animateCardReset(e.currentTarget)}
                onPointerDown={handleCardPointerDown}
                onPointerUp={(e) => animateCardReset(e.currentTarget)}
                onPointerCancel={(e) => animateCardReset(e.currentTarget)}
              >
                
                <div className="relative h-[52%] w-full overflow-hidden bg-black md:absolute md:inset-0 md:h-full">
                  <img 
                    src={student.image} 
                    alt={student.name} 
                    loading="lazy"
                    decoding="async"
                    fetchPriority={index === 0 ? 'high' : 'low'}
                    className="absolute inset-0 w-full h-full object-contain object-bottom opacity-95 md:grayscale md:group-hover:grayscale-0 md:group-hover:scale-[1.01] transition-[filter,transform] duration-500 ease-out z-0"
                  />
                  <div className="absolute inset-0 hidden md:block bg-gradient-to-t from-black via-black/55 to-transparent opacity-95" />
                  <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-black/80 via-black/25 to-transparent opacity-90" />
                </div>

                <div className="relative z-20 mt-auto w-full flex flex-col items-start text-left bg-black px-5 py-6 sm:px-6 sm:py-7 md:absolute md:bottom-0 md:left-0 md:bg-transparent md:p-14 lg:p-20">
                  
                  <span className="mb-4 sm:mb-6 font-mono text-xs md:text-sm tracking-[0.3em] text-blue-300 border border-blue-400/30 px-5 py-2 rounded-full bg-blue-950/40 backdrop-blur-md shadow-lg flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                    {student.rollNo}
                  </span>
                  
                  <h3 className="text-2xl sm:text-4xl md:text-7xl lg:text-8xl font-space font-bold text-white tracking-tighter leading-[0.95] mb-3 md:mb-4 drop-shadow-[0_10px_20px_rgba(0,0,0,1)] break-words max-w-[90%]">
                    {student.name}
                  </h3>
                  
                  <p className="text-base sm:text-lg md:text-2xl lg:text-3xl font-inter font-light text-blue-200/80 italic mb-5 sm:mb-7 md:mb-12 drop-shadow-lg max-w-3xl">
                    "{student.tag}"
                  </p>

                  <div className="student-quote w-full max-w-4xl border-l-4 border-blue-500 pl-4 sm:pl-5 md:pl-8 py-2 relative">
                    <span className="absolute -top-6 -left-2 text-6xl text-white/5 font-serif select-none pointer-events-none">"</span>
                    <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-gray-300 font-light leading-relaxed tracking-wide shadow-black drop-shadow-md">
                      {student.quote || "Code your own destiny."} 
                    </p>
                  </div>

                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-6 sm:gap-8">
          <button className="swiper-button-prev-custom p-4 bg-white/5 border border-white/10 rounded-full text-white/70 hover:bg-white/10 hover:text-white hover:border-blue-400/50 hover:scale-110 transition-all cursor-pointer backdrop-blur-md shadow-xl">
            <ArrowLeft size={24} />
          </button>
          
          <div className="hidden md:flex items-center gap-3 text-white/40 text-sm font-mono border border-white/10 px-6 py-2.5 rounded-full bg-black/60 backdrop-blur-md shadow-inner">
            <CornerDownLeft size={16}/> Use Arrow Keys to Navigate
          </div>

          <button className="swiper-button-next-custom p-4 bg-white/5 border border-white/10 rounded-full text-white/70 hover:bg-white/10 hover:text-white hover:border-blue-400/50 hover:scale-110 transition-all cursor-pointer backdrop-blur-md shadow-xl">
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImmersiveHallOfFame;
