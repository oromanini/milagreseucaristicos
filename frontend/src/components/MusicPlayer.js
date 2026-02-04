import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, Upload, Volume2 } from 'lucide-react';
import { Button } from './ui/button';

export const MusicPlayer = ({ className = '' }) => {
  const audioRef = useRef(null);
  const [audioSrc, setAudioSrc] = useState('');
  const [trackName, setTrackName] = useState('Selecione uma música');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);

  const volumeLabel = useMemo(() => `${Math.round(volume * 100)}%`, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current || !audioSrc) {
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    audioRef.current.play();
    setIsPlaying(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const url = URL.createObjectURL(file);
    setAudioSrc(url);
    setTrackName(file.name);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className={`music-player ${className}`} data-testid="music-player">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[color:var(--text-secondary)] text-xs uppercase tracking-[0.3em]">Música</p>
          <p className="text-[color:var(--text-primary)] text-sm font-medium truncate max-w-[200px]">
            {trackName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            id="audio-upload"
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="audio-upload">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-[color:var(--text-secondary)] hover:text-[color:var(--gold)]"
            >
              <Upload className="w-4 h-4" />
            </Button>
          </label>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={togglePlay}
            className="border-[#D4AF37]/40 text-[color:var(--gold)] hover:bg-[#D4AF37]/10"
            disabled={!audioSrc}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <Volume2 className="w-4 h-4 text-[color:var(--text-secondary)]" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(event) => setVolume(Number(event.target.value))}
          className="music-player-slider"
        />
        <span className="text-[color:var(--text-secondary)] text-xs">{volumeLabel}</span>
      </div>

      <audio
        ref={audioRef}
        src={audioSrc}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};
