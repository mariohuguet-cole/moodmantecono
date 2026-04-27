"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Info,
  BookOpen,
  PenLine,
  Calendar,
  LineChart,
  Settings,
} from "lucide-react";
import { useJournal, type Mood, type Energy } from "@/hooks/use-journal";
import Image from "next/image";
import { SettingsDialog } from "@/components/settings-dialog";
import { StatsDialog } from "@/components/stats-dialog";

const MOODS: {
  id: Mood;
  emoji: string;
  label: string;
  color: string;
  bg: string;
}[] = [
  {
    id: "incredible",
    emoji: "😄",
    label: "Increíble",
    color: "text-[#4ade80]",
    bg: "bg-[#4ade80]",
  },
  {
    id: "good",
    emoji: "😊",
    label: "Bien",
    color: "text-[#38bdf8]",
    bg: "bg-[#38bdf8]",
  },
  {
    id: "normal",
    emoji: "😐",
    label: "Normal",
    color: "text-[#fbbf24]",
    bg: "bg-[#fbbf24]",
  },
  {
    id: "bad",
    emoji: "😞",
    label: "Mal",
    color: "text-[#fb923c]",
    bg: "bg-[#fb923c]",
  },
  {
    id: "horrible",
    emoji: "😢",
    label: "Horrible",
    color: "text-[#f87171]",
    bg: "bg-[#f87171]",
  },
];

const ENERGIES: { id: Energy; label: string }[] = [
  { id: "low", label: "Baja" },
  { id: "medium", label: "Media" },
  { id: "high", label: "Alta" },
];

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export default function Home() {
  const { entries, saveEntry, getEntry, isLoaded } = useJournal();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Form state
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<Energy | null>(null);
  const [word, setWord] = useState("");
  const [note, setNote] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  // Format date as YYYY-MM-DD for storage
  const dateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

  // Load entry when date changes
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (!isLoaded) return;
    const entry = getEntry(dateKey);
    if (entry) {
      setSelectedMood(entry.emoji);
      setSelectedEnergy(entry.energy);
      setWord(entry.word);
      setNote(entry.note);
    } else {
      setSelectedMood(null);
      setSelectedEnergy(null);
      setWord("");
      setNote("");
    }
    setIsSaved(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [dateKey, isLoaded, getEntry]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood || !selectedEnergy) return;

    saveEntry({
      date: dateKey,
      emoji: selectedMood,
      energy: selectedEnergy,
      word,
      note,
      timestamp: Date.now(),
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Calendar generation
  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const startingDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Monday start

  const daysFromPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const calendarDays = [];

  // Previous month days
  for (let i = startingDayIndex - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysFromPrevMonth - i,
      isCurrentMonth: false,
      dateStr: "",
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: true,
      dateStr: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`,
    });
  }

  // Next month days to fill grid
  const remainingDays = 42 - calendarDays.length;
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: false,
      dateStr: "",
    });
  }

  const formattedDisplayDate = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(selectedDate);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh)] overflow-hidden">
      {/* Side Navigation Shell (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col h-screen w-16 fixed left-0 top-0 border-r border-outline-variant/15 bg-background z-[60] items-center py-8 gap-10">
        <BookOpen
          className="text-primary w-8 h-8 font-light"
          strokeWidth={1.5}
        />
        <div className="flex flex-col gap-8 flex-1 justify-center">
          <button className="text-primary scale-125 transition-colors">
            <PenLine strokeWidth={1.5} />
          </button>
          <button className="text-outline hover:text-primary transition-colors">
            <Calendar strokeWidth={1.5} />
          </button>
          <button 
            className="text-outline hover:text-primary transition-colors"
            onClick={() => setIsStatsOpen(true)}
          >
            <LineChart strokeWidth={1.5} />
          </button>
          <button 
            className="text-outline hover:text-primary transition-colors"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col md:flex-row lg:ml-16 h-full">
        {/* Left Column: Side Navigation & Calendar */}
        <aside className="flex flex-col h-full w-full md:w-[450px] bg-surface border-r border-outline-variant/15 shrink-0">
          {/* Top Navigation / Banner inside sidebar for mobile, or global? Let's put it global but offset */}
          <nav className="flex justify-between items-center w-full px-8 py-4 bg-surface-container-low border-b border-outline-variant/15">
            <span className="font-headline italic text-2xl text-primary tracking-tight">
              Mudmantecosa
            </span>
            <div className="flex md:hidden items-center gap-4">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20">
                <Image
                  src="https://picsum.photos/seed/user/100/100"
                  alt="Avatar"
                  width={32}
                  height={32}
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </nav>

          <div className="p-8 pb-4">
            <h1 className="font-headline text-5xl font-light tracking-tight text-on-surface mb-2 capitalize">
              {MONTH_NAMES[currentMonth]}
            </h1>
            <p className="text-on-surface-variant font-label text-sm uppercase tracking-[0.2em] mb-8">
              Selecciona una fecha del santuario
            </p>
          </div>

          {/* Calendar Grid */}
          <div className="px-8 flex-1 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-7 gap-3 mb-12">
              {/* Day Headers */}
              {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
                <div
                  key={day}
                  className="text-center text-[10px] font-bold text-outline uppercase tracking-widest pb-4"
                >
                  {day}
                </div>
              ))}

              {/* Days */}
              {calendarDays.map((d, i) => {
                const entry = d.isCurrentMonth ? entries[d.dateStr] : null;
                const moodData = entry
                  ? MOODS.find((m) => m.id === entry.emoji)
                  : null;
                const isSelected = d.isCurrentMonth && d.dateStr === dateKey;

                if (!d.isCurrentMonth) {
                  return (
                    <div
                      key={i}
                      className="aspect-square flex items-center justify-center text-xs text-outline/30"
                    >
                      {d.day}
                    </div>
                  );
                }

                return (
                  <button
                    key={i}
                    onClick={() =>
                      setSelectedDate(
                        new Date(currentYear, currentMonth, d.day),
                      )
                    }
                    className={`aspect-square flex flex-col items-center justify-center text-xs rounded-lg transition-all relative
                      ${isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-surface scale-110 z-10 rounded-xl" : "hover:scale-105"}
                      ${
                        moodData
                          ? `${moodData.bg}/20 ${moodData.color} font-bold border border-current/30`
                          : isSelected
                            ? "bg-primary text-on-primary font-black shadow-xl"
                            : "bg-surface-container text-on-surface-variant/50 hover:bg-surface-container-high"
                      }
                    `}
                  >
                    {d.day}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-5 gap-2 pb-8 border-t border-outline-variant/10 pt-6">
              {MOODS.map((m) => (
                <div
                  key={m.id}
                  className="flex flex-col items-center gap-1.5 opacity-60"
                >
                  <span className={`w-3 h-3 rounded-full ${m.bg}`}></span>
                  <span className="text-[8px] uppercase tracking-tighter">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 mt-auto border-t border-outline-variant/15">
            <button 
              onClick={() => setIsStatsOpen(true)}
              className="w-full py-4 rounded-xl border border-outline-variant/15 flex items-center justify-center gap-3 text-on-surface-variant font-label hover:bg-surface-container-high transition-all active:scale-95 group"
            >
              <LineChart className="text-primary group-hover:rotate-12 transition-transform w-5 h-5" />
              Ver Estadísticas Mensuales
            </button>
          </div>
        </aside>

        {/* Right Column: Entry Panel */}
        <section className="flex-1 h-full overflow-y-auto custom-scrollbar bg-surface-container-lowest flex flex-col relative">
          {/* Top Banner (Desktop) */}
          <div className="hidden md:flex justify-between items-center w-full px-12 py-6 absolute top-0 left-0 right-0 z-20">
            <div className="flex items-center gap-4 bg-surface-container-high/50 px-4 py-1.5 rounded-full border border-outline-variant/10 backdrop-blur-md">
              <Info className="text-primary w-4 h-4" />
              <span className="text-xs text-on-surface-variant font-medium uppercase tracking-widest">
                Modo Local - Los datos se guardan en tu navegador
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-right">
                <p className="text-sm font-bold text-primary leading-none">
                  Modo Local
                </p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">
                  Sin conexión
                </p>
              </span>
              <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/20 flex items-center justify-center">
                <Image
                  src="https://picsum.photos/seed/user/100/100"
                  alt="Avatar"
                  width={40}
                  height={40}
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          {/* Background Decorative Element */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="flex-1 flex items-center justify-center p-6 md:p-12 pt-24 md:pt-32">
            <motion.div
              key={dateKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-2xl glass-panel rounded-3xl p-8 md:p-12 border border-outline-variant/5 shadow-2xl relative"
            >
              <header className="mb-12">
                <h2 className="font-headline text-4xl md:text-5xl text-on-surface leading-tight mb-2 capitalize">
                  {formattedDisplayDate}
                </h2>
                <p className="text-primary/70 font-label italic tracking-wide">
                  ¿Cómo te sientes en este instante?
                </p>
              </header>

              <form onSubmit={handleSave} className="space-y-10">
                {/* Emoji Selector */}
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-6">
                    Estado de Ánimo
                  </label>
                  <div className="flex flex-wrap md:flex-nowrap justify-between gap-4">
                    {MOODS.map((m) => (
                      <motion.button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedMood(m.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="group flex flex-col items-center gap-3 transition-all relative"
                      >
                        <span
                          className={`text-3xl transition-all duration-300 ${selectedMood === m.id ? "scale-125 grayscale-0" : "grayscale group-hover:grayscale-0"}`}
                        >
                          {m.emoji}
                        </span>
                        {selectedMood === m.id && (
                          <motion.span
                            layoutId="activeMood"
                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_#ffe2b3]"
                          ></motion.span>
                        )}
                        <span
                          className={`text-[10px] uppercase tracking-widest font-bold transition-colors ${selectedMood === m.id ? "text-primary" : "text-outline group-hover:text-primary"}`}
                        >
                          {m.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Energy Selector */}
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-4">
                    Nivel de Energía
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {ENERGIES.map((e) => (
                      <button
                        key={e.id}
                        type="button"
                        onClick={() => setSelectedEnergy(e.id)}
                        className={`py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 border
                          ${
                            selectedEnergy === e.id
                              ? "bg-surface-container-highest text-primary border-primary/20"
                              : "border-outline-variant/15 text-outline hover:border-primary/40 hover:text-primary"
                          }
                        `}
                      >
                        {e.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Word Field */}
                <div className="relative group">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-1">
                    Una palabra para hoy
                  </label>
                  <input
                    type="text"
                    maxLength={30}
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    placeholder="P. ej. Resiliencia"
                    className="w-full bg-transparent border-0 border-b-2 border-surface-container-highest py-3 px-0 text-on-surface placeholder:text-outline/40 focus:ring-0 focus:border-primary transition-all font-headline text-2xl italic tracking-tight"
                  />
                  <span className="absolute right-0 bottom-4 text-[10px] text-outline/30 font-bold uppercase tracking-tighter">
                    {word.length} / 30
                  </span>
                </div>

                {/* Textarea */}
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-4">
                    ¿Qué ha pasado hoy?
                  </label>
                  <textarea
                    rows={4}
                    maxLength={150}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Escribe aquí los fragmentos de tu día..."
                    className="w-full bg-surface-container-high/30 rounded-2xl border border-outline-variant/10 p-5 text-on-surface placeholder:text-outline/40 focus:ring-1 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none leading-relaxed"
                  ></textarea>
                  <div className="flex justify-end mt-2">
                    <span className="text-[10px] text-outline/30 font-bold uppercase tracking-tighter">
                      {note.length} / 150
                    </span>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-4">
                  <motion.button
                    type="submit"
                    disabled={!selectedMood || !selectedEnergy}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-5 rounded-2xl font-bold uppercase tracking-[0.3em] text-sm shadow-xl transition-all relative overflow-hidden
                      ${
                        !selectedMood || !selectedEnergy
                          ? "bg-surface-container-highest text-outline cursor-not-allowed"
                          : "bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-primary/10 hover:shadow-primary/20"
                      }
                    `}
                  >
                    <AnimatePresence mode="wait">
                      {isSaved ? (
                        <motion.span
                          key="saved"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="block"
                        >
                          ¡Guardado!
                        </motion.span>
                      ) : (
                        <motion.span
                          key="save"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="block"
                        >
                          Guardar Entrada
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </section>
      </div>

      <SettingsDialog isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <StatsDialog isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} currentDate={selectedDate} />
    </div>
  );
}
