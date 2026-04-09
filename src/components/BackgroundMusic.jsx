import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.4;
    audio.play()
      .then(() => {
        setIsPlaying(true);
        setHasInteracted(true);
      })
      .catch(() => {
        // Browsers often block unmuted autoplay until the user interacts.
      });
  }, []);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted && audioRef.current) {
        audioRef.current.volume = 0.4; // Set volume to 40% so it's ambient, not blasting
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setHasInteracted(true);
          })
          .catch((error) => console.log("Autoplay prevented:", error));
      }
    };

    // Listen for the first click or scroll to trigger the audio
    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('scroll', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
    };
  }, [hasInteracted]);

  const toggleMute = (e) => {
    e.stopPropagation(); // Prevent this click from triggering the window listener again
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      {/* Replace the src with your actual audio file path. 
        Put your audio file in the public folder (e.g., public/farewell-theme.mp3)
      */}
      <audio ref={audioRef} src="/farewell-theme.mp3" loop autoPlay />

      <button
        onClick={toggleMute}
        className={`fixed bottom-6 md:bottom-10 right-6 md:right-10 z-[100] w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)] border ${
          isPlaying 
            ? 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:scale-110' 
            : 'bg-black/50 border-white/5 text-gray-500 hover:bg-black/80 hover:scale-110'
        }`}
        aria-label="Toggle Background Music"
      >
        {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
        
        {/* Subtle pulsing ring effect when music is playing */}
        {isPlaying && (
          <span className="absolute inset-0 rounded-full border border-white/30 animate-ping opacity-50 pointer-events-none" />
        )}
      </button>
    </>
  );
};

export default BackgroundMusic;
