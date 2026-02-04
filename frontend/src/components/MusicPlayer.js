import { Play } from 'lucide-react';
import { Button } from './ui/button';

export const MusicPlayer = ({ className = '' }) => {
  const trackName = 'Milagres Eucarísticos (Trilha Oficial)';
  const youtubeUrl = 'https://www.youtube.com/watch?v=BYzT9zOJHF0';
  const embedUrl = 'https://www.youtube.com/embed/BYzT9zOJHF0?rel=0';

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
          <Button
            asChild
            type="button"
            variant="outline"
            size="icon"
            className="border-[#D4AF37]/40 text-[color:var(--gold)] hover:bg-[#D4AF37]/10"
          >
            <a href={youtubeUrl} target="_blank" rel="noreferrer" aria-label="Abrir música no YouTube">
              <Play className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-md border border-[#D4AF37]/20 bg-black/40">
        <div className="aspect-video w-full">
          <iframe
            title="Milagres Eucarísticos"
            src={embedUrl}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};
