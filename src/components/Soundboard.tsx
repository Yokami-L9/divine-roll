import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Music,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Zap,
  Wind,
  Flame,
  Waves,
  TreePine,
  Swords,
  Ghost,
  Beer,
} from "lucide-react";

interface SoundTrack {
  id: string;
  name: string;
  icon: React.ElementType;
  category: "ambient" | "music" | "sfx";
  isPlaying: boolean;
  volume: number;
}

const Soundboard = () => {
  const [masterVolume, setMasterVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);

  const [tracks, setTracks] = useState<SoundTrack[]>([
    { id: "1", name: "Таверна", icon: Beer, category: "ambient", isPlaying: false, volume: 50 },
    { id: "2", name: "Лес", icon: TreePine, category: "ambient", isPlaying: false, volume: 50 },
    { id: "3", name: "Ветер", icon: Wind, category: "ambient", isPlaying: false, volume: 50 },
    { id: "4", name: "Вода", icon: Waves, category: "ambient", isPlaying: false, volume: 50 },
    { id: "5", name: "Огонь", icon: Flame, category: "ambient", isPlaying: false, volume: 50 },
    { id: "6", name: "Бой", icon: Swords, category: "music", isPlaying: false, volume: 50 },
    { id: "7", name: "Тревога", icon: Zap, category: "music", isPlaying: false, volume: 50 },
    { id: "8", name: "Призраки", icon: Ghost, category: "ambient", isPlaying: false, volume: 50 },
  ]);

  const quickSounds = [
    { name: "Взрыв", icon: "💥" },
    { name: "Крик", icon: "😱" },
    { name: "Шаги", icon: "👣" },
    { name: "Дверь", icon: "🚪" },
    { name: "Магия", icon: "✨" },
    { name: "Гром", icon: "⚡" },
    { name: "Колокол", icon: "🔔" },
    { name: "Шёпот", icon: "👻" },
  ];

  const scenes = [
    { name: "Таверна", color: "bg-amber-500/20 hover:bg-amber-500/30 text-amber-400" },
    { name: "Подземелье", color: "bg-slate-500/20 hover:bg-slate-500/30 text-slate-400" },
    { name: "Битва", color: "bg-red-500/20 hover:bg-red-500/30 text-red-400" },
    { name: "Лес", color: "bg-green-500/20 hover:bg-green-500/30 text-green-400" },
    { name: "Город", color: "bg-blue-500/20 hover:bg-blue-500/30 text-blue-400" },
    { name: "Погоня", color: "bg-orange-500/20 hover:bg-orange-500/30 text-orange-400" },
    { name: "Тишина", color: "bg-purple-500/20 hover:bg-purple-500/30 text-purple-400" },
    { name: "Хоррор", color: "bg-rose-500/20 hover:bg-rose-500/30 text-rose-400" },
  ];

  const toggleTrack = (id: string) => {
    setTracks(
      tracks.map((t) => (t.id === id ? { ...t, isPlaying: !t.isPlaying } : t))
    );
  };

  const updateTrackVolume = (id: string, volume: number) => {
    setTracks(tracks.map((t) => (t.id === id ? { ...t, volume } : t)));
  };

  const stopAll = () => {
    setTracks(tracks.map((t) => ({ ...t, isPlaying: false })));
  };

  const playingCount = tracks.filter((t) => t.isPlaying).length;

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Music className="w-6 h-6 text-primary gold-glow" />
          <h2 className="text-2xl font-serif font-bold">Саундборд</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Активно: {playingCount}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className={isMuted ? "text-accent" : "text-primary"}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
          <Slider
            value={[masterVolume]}
            onValueChange={([v]) => setMasterVolume(v)}
            max={100}
            className="w-32"
          />
        </div>
      </div>

      {/* Scene Presets */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">
          Сцены
        </h3>
        <div className="flex flex-wrap gap-2">
          {scenes.map((scene) => (
            <Button
              key={scene.name}
              variant="ghost"
              className={`${scene.color} transition-all`}
            >
              {scene.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Ambient Tracks */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">
          Окружение
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tracks.map((track) => (
            <div
              key={track.id}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                track.isPlaying
                  ? "bg-primary/10 border-primary shadow-lg shadow-primary/20"
                  : "bg-background/50 border-border hover:border-primary/30"
              }`}
              onClick={() => toggleTrack(track.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <track.icon
                  className={`w-6 h-6 ${
                    track.isPlaying ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                {track.isPlaying ? (
                  <Pause className="w-4 h-4 text-primary" />
                ) : (
                  <Play className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <div className="text-sm font-medium mb-2">{track.name}</div>
              <Slider
                value={[track.volume]}
                onValueChange={([v]) => updateTrackVolume(track.id, v)}
                max={100}
                className="w-full"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Quick SFX */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">
          Быстрые эффекты
        </h3>
        <div className="flex flex-wrap gap-2">
          {quickSounds.map((sound) => (
            <Button
              key={sound.name}
              variant="outline"
              className="border-accent/50 hover:bg-accent/20 hover:border-accent transition-all active:scale-95"
            >
              <span className="mr-2">{sound.icon}</span>
              {sound.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={stopAll}
          className="border-accent/50 text-accent hover:bg-accent/20"
        >
          <VolumeX className="w-4 h-4 mr-2" />
          Остановить всё
        </Button>
      </div>
    </Card>
  );
};

export default Soundboard;
