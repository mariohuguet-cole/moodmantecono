'use client';

import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useJournal } from "@/hooks/use-journal";
import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface StatsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentDate: Date; // e.g. from selectedDate to determine month
}

function getEnergyValue(energy: string) {
  if (energy === 'high') return 3;
  if (energy === 'medium') return 2;
  if (energy === 'low') return 1;
  return 0;
}

function getMoodValue(mood: string) {
  if (mood === 'incredible') return 5;
  if (mood === 'good') return 4;
  if (mood === 'normal') return 3;
  if (mood === 'bad') return 2;
  if (mood === 'horrible') return 1;
  return 0;
}

export function StatsDialog({ isOpen, onClose, currentDate }: StatsDialogProps) {
  const { entries } = useJournal();

  const chartData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const daysInMonth = new Date(year, month, 0).getDate();
    
    const data = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      const entry = entries[dateStr];
      if (entry) {
        data.push({
          day: i,
          motivacion: (getEnergyValue(entry.energy) + getMoodValue(entry.emoji)) / 2,
        });
      }
    }
    return data;
  }, [entries, currentDate]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl glass-panel bg-surface p-8 rounded-3xl border border-outline-variant/20 shadow-2xl overflow-hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="font-headline text-3xl text-on-surface leading-none mb-2">Fluctuación</h3>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">Resumen Mensual</p>
              </div>
              <button onClick={onClose} className="p-2 text-outline hover:text-on-surface transition-colors flex-shrink-0">
                <X strokeWidth={1.5} />
              </button>
            </div>

            <div className="w-full h-64 mt-8">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMotivacion" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "var(--outline)", fontSize: 10, fontFamily: "var(--font-body)" }}
                      minTickGap={10}
                    />
                    <YAxis 
                      hide
                      domain={[0, 4]} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "var(--surface-container-high)", 
                        border: "1px solid var(--outline-variant)", 
                        borderRadius: "12px", 
                        fontFamily: "var(--font-body)" 
                      }} 
                      itemStyle={{ color: "var(--primary)", fontWeight: "bold" }}
                      labelStyle={{ color: "var(--on-surface)", marginBottom: "4px" }}
                      formatter={(value: any) => [Number(value).toFixed(1), "Motivación"]}
                      labelFormatter={(label) => `Día ${label}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="motivacion" 
                      stroke="var(--primary)" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorMotivacion)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center border border-dashed border-outline-variant/30 rounded-2xl">
                  <p className="text-sm font-label text-outline/50 uppercase tracking-widest text-center">
                    No hay suficientes ecos<br/>este mes.
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-4 text-[10px] text-on-surface-variant font-bold uppercase tracking-widest justify-center">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                <span>Índice de Motivación Global</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
