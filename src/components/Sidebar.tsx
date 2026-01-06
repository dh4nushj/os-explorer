import { motion } from "framer-motion";
import { Cpu, HardDrive, Brain, Terminal } from "lucide-react";

type View = "cpu" | "disk" | "quiz";

interface SidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
}

const navItems = [
  { id: "cpu" as const, label: "CPU Scheduler", icon: Cpu, sublabel: "Priority Preemptive" },
  { id: "disk" as const, label: "Disk Controller", icon: HardDrive, sublabel: "C-SCAN Algorithm" },
  { id: "quiz" as const, label: "Knowledge Check", icon: Brain, sublabel: "OS Quiz" },
];

export const Sidebar = ({ activeView, onViewChange }: SidebarProps) => {
  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-72 h-screen bg-sidebar border-r border-sidebar-border flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Terminal className="w-8 h-8 text-primary" />
            <motion.div
              className="absolute inset-0 bg-primary/20 rounded-full blur-lg"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground neon-text font-mono">
              OS-NEXUS
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              v2.0.4 // SYSTEM ACTIVE
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4 font-mono">
          // Modules
        </p>
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full p-3 rounded-lg text-left transition-all duration-300 relative overflow-hidden group ${
                isActive
                  ? "bg-primary/10 border border-primary/50"
                  : "hover:bg-muted border border-transparent"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
                  style={{ boxShadow: "0 0 10px hsl(180 100% 50% / 0.8)" }}
                />
              )}
              <div className="flex items-center gap-3">
                <item.icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  }`}
                />
                <div>
                  <p
                    className={`font-medium text-sm ${
                      isActive ? "text-primary neon-text" : "text-foreground"
                    }`}
                  >
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {item.sublabel}
                  </p>
                </div>
              </div>
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="glass-panel p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="text-xs text-muted-foreground font-mono">SYSTEM STATUS</span>
          </div>
          <div className="space-y-1 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Memory</span>
              <span className="text-primary">OK</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kernel</span>
              <span className="text-primary">ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};
