import { Pause, Play } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

export const MusicPlayer = ({ className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const trackName = 'Anima Christi';

  const togglePlayback = () => {
    setIsPlaying((current) => !current);
  };

  return (
    <div className={`music-player ${className}`} data-testid="music-player">
      <div className="flex flex-wrap items-center gap-4">
        <p className="text-[color:var(--text-primary)] text-sm font-medium tracking-wide">
          {trackName}
        </p>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={togglePlayback}
          className="border-[#D4AF37]/40 text-[color:var(--gold)] hover:bg-[#D4AF37]/10"
          aria-label={isPlaying ? 'Pausar' : 'Tocar'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <div className="flex items-center gap-3 flex-1 min-w-[160px]">
          <span className="text-[color:var(--text-secondary)] text-xs uppercase tracking-[0.2em]">Volume</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            className="music-player-slider"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
};
