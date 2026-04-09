import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, EffectFade, Autoplay } from 'swiper/modules';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, ArrowRight, Camera, Play } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const photoFiles = [
  'img1.jpg',
  'img2.jpg',
  'img3.jpg',
  'img4.jpg',
  'img5.jpg',
  'img6.jpg',
  'img7.jpg',
  'img8.jpg',
  'img9.jpg',
  'img10.jpg',
  'img11.jpg',
  'img12.jpg',
  'img13.jpg',
  'img14.jpg',
  'img15.jpeg',
  'img16.jpg',
  'img17.jpg',
  'img18.jpg',
  'img19.jpeg',
  'img20.jpeg',
];

const videoFiles = ['vid1.mp4', 'vid2.mp4', 'vid3.mp4'];

const memoriesData = [
  ...photoFiles.map((fileName) => ({
    type: 'image',
    src: `/assets/group-photos/${fileName}`,
  })),
  ...videoFiles.map((fileName) => ({
    type: 'video',
    src: `/assets/group-videos/${fileName}`,
  })),
].map((memory, index) => ({
  id: index + 1,
  type: memory.type,
  src: memory.src,
  title: `Memory ${String(index + 1).padStart(2, '0')}`,
}));

const GroupMemories = () => {
  const componentRef = useRef();
  const [activeBg, setActiveBg] = useState(
    memoriesData.find((memory) => memory.type === 'image')?.src || ''
  );

  // Setup the continuous "breathing" animation for the active slide
  let breatheAnimation = useRef(null);

  useGSAP(() => {
    // Initial entry animation for the whole section
    gsap.fromTo(".memory-card-inner", 
      { opacity: 0, scale: 0.96 },
      { opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" }
    );
  }, { scope: componentRef });

  return (
    <div ref={componentRef} className="relative w-full min-h-[100dvh] bg-black overflow-hidden font-inter flex flex-col pt-10">
      
      {/* 1. THE DYNAMIC AURA BACKGROUND */}
      {/* This creates a massive, heavily blurred glow that matches the current photo's colors */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-[64px] scale-125 saturate-150 transition-all duration-700 ease-out"
          style={{ backgroundImage: `url(${activeBg})` }}
        />
        {/* Dark overlay to ensure the cards pop */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Header Area */}
      <div className="w-full px-6 md:px-12 z-20 flex justify-between items-start shrink-0 relative">
        <div>
          <p className="text-blue-500 font-mono tracking-[0.3em] uppercase text-xs md:text-sm mb-2 flex items-center gap-3">
              <Camera size={14} /> The Archives
          </p>
          <h2 className="text-4xl md:text-6xl font-space font-black text-white tracking-tighter drop-shadow-2xl">
            Memories.
          </h2>
        </div>
      </div>

      {/* Main Carousel Area */}
      <div className="flex-1 w-full relative z-10 flex flex-col justify-center pb-24 px-4 md:px-12 mt-4">
        
        {memoriesData.length === 0 && (
          <div className="text-white/50 text-center py-20 font-mono border border-white/10 rounded-xl bg-black/50 backdrop-blur-md max-w-2xl mx-auto w-full">
            No media found in `/public/assets/group-photos` or `/public/assets/group-videos`.
          </div>
        )}

        <Swiper
          modules={[Navigation, Pagination, Keyboard, EffectFade, Autoplay]}
          effect="fade" 
          fadeEffect={{ crossFade: true }}
          speed={700}
          spaceBetween={0}
          slidesPerView={1}
          centeredSlides={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          grabCursor={true}
          keyboard={{ enabled: true }}
          navigation={{
            nextEl: '.memories-next',
            prevEl: '.memories-prev',
          }}
          onSlideChange={(swiper) => {
            const activeSlide = swiper.slides[swiper.activeIndex];
            const media = activeSlide.querySelector('.memory-media');
            const textWrap = activeSlide.querySelector('.memory-text');
            const activeMemory = memoriesData[swiper.activeIndex];
            
            // Update the background aura
            if (activeMemory?.type === 'image') {
              setActiveBg(activeMemory.src);
            }

            // Kill any previous breathing animation
            if (breatheAnimation.current) breatheAnimation.current.kill();
            
            // THE "MEMORY FOCUS" ANIMATION
            // Use transform/opacity-heavy animation for smoother slide transitions
            if (media) {
              gsap.fromTo(media,
                { scale: 1.08, opacity: 0.75 },
                { 
                  scale: 1, 
                  opacity: 1,
                  duration: 0.8, 
                  ease: "power2.out",
                  onComplete: () => {
                    // Start the continuous slow breathing once it's in focus
                    breatheAnimation.current = gsap.to(media, {
                        scale: 1.02,
                        duration: 10,
                        ease: "none",
                        repeat: -1,
                        yoyo: true
                    });
                  }
                }
              );
            }
            
            // Slide in the text smoothly
            if (textWrap) {
                gsap.fromTo(textWrap, 
                { opacity: 0, y: 24 },
                { opacity: 1, y: 0, duration: 0.5, delay: 0.1, ease: "power2.out" }
                );
            }
          }}
          className="w-full h-full max-w-[1400px] aspect-[4/5] md:aspect-[16/9] lg:aspect-[21/9] max-h-[75vh]"
        >
          {memoriesData.map((memory, index) => (
            <SwiperSlide key={memory.id} className="flex items-center justify-center p-2">
                
              {/* THE MASSIVE MEMORY CARD */}
              <div 
                className="memory-card-inner relative w-full h-full bg-[#0a0a0a] rounded-[2rem] md:rounded-[3rem] overflow-hidden group shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/10 will-change-transform"
                // Interactive 3D Tilt (Same as Hall of Fame)
                onMouseMove={(e) => {
                    const card = e.currentTarget;
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = ((y - centerY) / centerY) * -2; 
                    const rotateY = ((x - centerX) / centerX) * 2;

                    gsap.to(card, {
                      rotateX: rotateX,
                      rotateY: rotateY,
                      duration: 0.5,
                      ease: "power2.out",
                      transformPerspective: 1500,
                    });
                }}
                onMouseLeave={(e) => {
                    gsap.to(e.currentTarget, { rotateX: 0, rotateY: 0, duration: 0.7, ease: "power3.out" });
                }}
              >
                
                {/* Image/Video Layer */}
                <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
                  {memory.type === 'video' ? (
                    <>
                      <video 
                        src={memory.src} 
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="memory-media w-full h-full object-cover will-change-transform"
                      />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                        <Play fill="white" size={24} className="text-white ml-1" />
                      </div>
                    </>
                  ) : (
                    <img 
                      src={memory.src} 
                      alt={memory.title} 
                      className="memory-media w-full h-full object-cover will-change-transform"
                      loading="lazy"
                    />
                  )}
                </div>
                
                {/* Cinematic Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-95 transition-opacity duration-700" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)] pointer-events-none" />

                {/* The Content Overlay (Pinned to bottom) */}
                <div className="memory-text absolute bottom-0 left-0 w-full p-8 md:p-14 lg:p-20 flex flex-col items-start text-left z-20">
                  
                  <h3 className="text-4xl sm:text-6xl md:text-7xl font-space font-bold text-white tracking-tighter leading-[0.9] drop-shadow-[0_10px_20px_rgba(0,0,0,1)] max-w-5xl">
                    {memory.title}
                  </h3>

                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Controls (Centered at bottom) */}
        <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-6 sm:gap-8">
          <button className="memories-prev p-4 bg-black/40 border border-white/10 rounded-full text-white/70 hover:bg-white/10 hover:text-white hover:scale-110 transition-all cursor-pointer backdrop-blur-xl shadow-2xl">
            <ArrowLeft size={24} />
          </button>
          
          <div className="hidden md:flex items-center gap-3 text-white/50 text-sm font-mono tracking-widest uppercase">
            Browse Archives
          </div>

          <button className="memories-next p-4 bg-black/40 border border-white/10 rounded-full text-white/70 hover:bg-white/10 hover:text-white hover:scale-110 transition-all cursor-pointer backdrop-blur-xl shadow-2xl">
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupMemories;
