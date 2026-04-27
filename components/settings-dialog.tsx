'use client';

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const { theme, setTheme } = useTheme();
  const [font, setFont] = useState("editorial");
  
  useEffect(() => {
    // Load font preference
    const savedFont = localStorage.getItem("mudmantecosa_font") || "editorial";
    /* eslint-disable react-hooks/set-state-in-effect */
    setFont(savedFont);
    /* eslint-enable react-hooks/set-state-in-effect */
    if (savedFont === "modern") {
      document.documentElement.classList.add("font-modern");
    } else {
      document.documentElement.classList.remove("font-modern");
    }
  }, []);

  const changeFont = (newFont: string) => {
    setFont(newFont);
    localStorage.setItem("mudmantecosa_font", newFont);
    if (newFont === "modern") {
      document.documentElement.classList.add("font-modern");
    } else {
      document.documentElement.classList.remove("font-modern");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
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
            className="relative w-full max-w-sm glass-panel bg-surface p-8 rounded-3xl border border-outline-variant/20 shadow-2xl overflow-hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-headline text-2xl text-on-surface">Ajustes</h3>
              <button onClick={onClose} className="p-2 text-outline hover:text-on-surface transition-colors">
                <X strokeWidth={1.5} />
              </button>
            </div>

            <div className="space-y-8">
              {/* Theme Toggle */}
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-4">
                  Apariencia
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTheme("dark")}
                    className={`py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 border
                      ${theme === "dark"
                        ? "bg-surface-container-highest text-primary border-primary/20"
                        : "border-outline-variant/15 text-outline hover:border-primary/40 hover:text-primary"
                      }
                    `}
                  >
                    Oscuro
                  </button>
                  <button
                    onClick={() => setTheme("light")}
                    className={`py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 border
                      ${theme === "light"
                        ? "bg-surface-container-highest text-primary border-primary/20"
                        : "border-outline-variant/15 text-outline hover:border-primary/40 hover:text-primary"
                      }
                    `}
                  >
                    Claro
                  </button>
                </div>
              </div>

              {/* Font Toggle */}
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-4">
                  Tipografía
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => changeFont("editorial")}
                    className={`py-3 flex flex-col items-center gap-1 rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 border
                      ${font === "editorial"
                        ? "bg-surface-container-highest text-primary border-primary/20"
                        : "border-outline-variant/15 text-outline hover:border-primary/40 hover:text-primary"
                      }
                    `}
                  >
                    <span>Editorial</span>
                  </button>
                  <button
                    onClick={() => changeFont("modern")}
                    className={`py-3 flex flex-col items-center gap-1 font-modern rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 border
                      ${font === "modern"
                        ? "bg-surface-container-highest text-primary border-primary/20"
                        : "border-outline-variant/15 text-outline hover:border-primary/40 hover:text-primary"
                      }
                    `}
                  >
                    <span>Moderna</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
