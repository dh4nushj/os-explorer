import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Play, RotateCcw, Trash2 } from "lucide-react";

interface Process {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  remainingTime: number;
  completionTime?: number;
  waitingTime?: number;
  turnaroundTime?: number;
}

interface GanttBlock {
  processId: string;
  startTime: number;
  endTime: number;
}

const PROCESS_COLORS: Record<string, string> = {
  P1: "from-cyan-500 to-cyan-600",
  P2: "from-magenta-500 to-pink-500",
  P3: "from-purple-500 to-violet-500",
  P4: "from-emerald-500 to-green-500",
  P5: "from-amber-500 to-orange-500",
  P6: "from-rose-500 to-red-500",
  P7: "from-blue-500 to-indigo-500",
  P8: "from-teal-500 to-cyan-500",
};

const getProcessColor = (id: string) => {
  return PROCESS_COLORS[id] || "from-gray-500 to-gray-600";
};

const DEFAULT_PROCESSES: Process[] = [
  { id: "P1", arrivalTime: 0, burstTime: 4, priority: 2, remainingTime: 4 },
  { id: "P2", arrivalTime: 1, burstTime: 3, priority: 1, remainingTime: 3 },
  { id: "P3", arrivalTime: 2, burstTime: 5, priority: 3, remainingTime: 5 },
  { id: "P4", arrivalTime: 3, burstTime: 2, priority: 4, remainingTime: 2 },
  { id: "P5", arrivalTime: 4, burstTime: 6, priority: 1, remainingTime: 6 },
];

export const CPUScheduler = () => {
  const [processes, setProcesses] = useState<Process[]>(DEFAULT_PROCESSES);
  const [ganttChart, setGanttChart] = useState<GanttBlock[]>([]);
  const [stats, setStats] = useState<{ avgWaiting: number; avgTurnaround: number } | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    arrivalTime: "",
    burstTime: "",
    priority: "",
  });

  const addProcess = () => {
    const arrival = parseInt(formData.arrivalTime);
    const burst = parseInt(formData.burstTime);
    const priority = parseInt(formData.priority);

    if (isNaN(arrival) || isNaN(burst) || isNaN(priority)) return;

    const newProcess: Process = {
      id: `P${processes.length + 1}`,
      arrivalTime: arrival,
      burstTime: burst,
      priority: priority,
      remainingTime: burst,
    };

    setProcesses([...processes, newProcess]);
    setFormData({ arrivalTime: "", burstTime: "", priority: "" });
  };

  const runSimulation = async () => {
    if (processes.length === 0) return;

    setIsRunning(true);
    setGanttChart([]);
    setStats(null);

    // Create working copies
    const workingProcesses = processes.map((p) => ({
      ...p,
      remainingTime: p.burstTime,
    }));

    const gantt: GanttBlock[] = [];
    let time = 0;
    let completed = 0;
    const n = workingProcesses.length;

    // Find max time needed
    const maxTime =
      Math.max(...workingProcesses.map((p) => p.arrivalTime)) +
      workingProcesses.reduce((sum, p) => sum + p.burstTime, 0);

    let currentProcess: Process | null = null;
    let currentBlockStart = -1;

    while (completed < n && time <= maxTime) {
      // Get arrived processes with remaining time
      const available = workingProcesses.filter(
        (p) => p.arrivalTime <= time && p.remainingTime > 0
      );

      if (available.length === 0) {
        // No process available, CPU idle
        if (currentProcess !== null) {
          gantt.push({
            processId: currentProcess.id,
            startTime: currentBlockStart,
            endTime: time,
          });
          currentProcess = null;
        }
        time++;
        setCurrentTime(time);
        await new Promise((r) => setTimeout(r, 50));
        continue;
      }

      // Sort by priority (lower = higher priority), then by arrival time (FCFS for ties)
      available.sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        return a.arrivalTime - b.arrivalTime;
      });

      const selected = available[0];

      // Check for preemption
      if (currentProcess !== null && currentProcess.id !== selected.id) {
        // Save current block
        gantt.push({
          processId: currentProcess.id,
          startTime: currentBlockStart,
          endTime: time,
        });
        currentBlockStart = time;
      } else if (currentProcess === null) {
        currentBlockStart = time;
      }

      currentProcess = selected;
      selected.remainingTime--;

      if (selected.remainingTime === 0) {
        // Process completed
        selected.completionTime = time + 1;
        selected.turnaroundTime = selected.completionTime - selected.arrivalTime;
        selected.waitingTime = selected.turnaroundTime - selected.burstTime;
        completed++;

        gantt.push({
          processId: selected.id,
          startTime: currentBlockStart,
          endTime: time + 1,
        });
        currentProcess = null;
      }

      time++;
      setCurrentTime(time);
      setGanttChart([...gantt]);
      await new Promise((r) => setTimeout(r, 100));
    }

    // Calculate stats
    const totalWaiting = workingProcesses.reduce((sum, p) => sum + (p.waitingTime || 0), 0);
    const totalTurnaround = workingProcesses.reduce((sum, p) => sum + (p.turnaroundTime || 0), 0);

    setStats({
      avgWaiting: totalWaiting / n,
      avgTurnaround: totalTurnaround / n,
    });

    setProcesses(workingProcesses);
    setIsRunning(false);
  };

  const reset = () => {
    setGanttChart([]);
    setStats(null);
    setCurrentTime(0);
    setProcesses(
      processes.map((p) => ({
        ...p,
        remainingTime: p.burstTime,
        completionTime: undefined,
        waitingTime: undefined,
        turnaroundTime: undefined,
      }))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-foreground neon-text font-mono">
            CPU SCHEDULER
          </h2>
          <p className="text-muted-foreground font-mono text-sm">
            // Priority Preemptive Algorithm
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={runSimulation}
            disabled={isRunning || processes.length === 0}
            className="cyber-button flex items-center gap-2 disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            <span className="font-mono">RUN</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            className="cyber-button flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="font-mono">RESET</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Input Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-6"
      >
        <h3 className="text-sm font-mono text-muted-foreground mb-4">
          // ADD PROCESS
        </h3>
        <div className="flex gap-4 items-end flex-wrap">
          <div className="space-y-2">
            <label className="text-xs font-mono text-muted-foreground">
              ARRIVAL TIME
            </label>
            <input
              type="number"
              min="0"
              value={formData.arrivalTime}
              onChange={(e) =>
                setFormData({ ...formData, arrivalTime: e.target.value })
              }
              className="w-32 bg-input border border-border rounded-lg px-3 py-2 font-mono text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50"
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-muted-foreground">
              BURST TIME
            </label>
            <input
              type="number"
              min="1"
              value={formData.burstTime}
              onChange={(e) =>
                setFormData({ ...formData, burstTime: e.target.value })
              }
              className="w-32 bg-input border border-border rounded-lg px-3 py-2 font-mono text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50"
              placeholder="5"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-muted-foreground">
              PRIORITY (lower = higher)
            </label>
            <input
              type="number"
              min="1"
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
              className="w-32 bg-input border border-border rounded-lg px-3 py-2 font-mono text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50"
              placeholder="1"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addProcess}
            className="cyber-button flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="font-mono">ADD</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Process Table */}
      <AnimatePresence>
        {processes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-panel overflow-hidden"
          >
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-mono text-muted-foreground">
                // PROCESS QUEUE [{processes.length}]
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-xs font-mono text-muted-foreground">
                      PID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-mono text-muted-foreground">
                      ARRIVAL
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-mono text-muted-foreground">
                      BURST
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-mono text-muted-foreground">
                      PRIORITY
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-mono text-muted-foreground">
                      STATUS
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-mono text-muted-foreground">
                      WT
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-mono text-muted-foreground">
                      TAT
                    </th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {processes.map((process, index) => (
                    <motion.tr
                      key={process.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/50 hover:bg-muted/30"
                    >
                      <td className="px-4 py-3">
                        <span
                          className={`font-mono font-bold bg-gradient-to-r ${getProcessColor(
                            process.id
                          )} bg-clip-text text-transparent`}
                        >
                          {process.id}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-foreground">
                        {process.arrivalTime}
                      </td>
                      <td className="px-4 py-3 font-mono text-foreground">
                        {process.burstTime}
                      </td>
                      <td className="px-4 py-3 font-mono text-foreground">
                        {process.priority}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-mono ${
                            process.completionTime !== undefined
                              ? "bg-neon-green/20 text-neon-green"
                              : process.remainingTime < process.burstTime
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {process.completionTime !== undefined
                            ? "DONE"
                            : process.remainingTime < process.burstTime
                            ? "RUNNING"
                            : "WAITING"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-primary">
                        {process.waitingTime ?? "-"}
                      </td>
                      <td className="px-4 py-3 font-mono text-secondary">
                        {process.turnaroundTime ?? "-"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            setProcesses(processes.filter((p) => p.id !== process.id))
                          }
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gantt Chart */}
      <AnimatePresence>
        {ganttChart.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-mono text-muted-foreground">
                // GANTT CHART
              </h3>
              <span className="font-mono text-primary">
                T = {currentTime}
              </span>
            </div>
            <div className="overflow-x-auto pb-4">
              <div className="flex items-end gap-0.5 min-w-max">
                {ganttChart.map((block, index) => {
                  const width = (block.endTime - block.startTime) * 40;
                  return (
                    <motion.div
                      key={`${block.processId}-${block.startTime}`}
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex flex-col items-center origin-left"
                    >
                      <div
                        className={`h-12 bg-gradient-to-r ${getProcessColor(
                          block.processId
                        )} rounded-sm flex items-center justify-center gantt-block`}
                        style={{ width: `${width}px` }}
                      >
                        <span className="font-mono font-bold text-white text-sm">
                          {block.processId}
                        </span>
                      </div>
                      <div className="flex justify-between w-full mt-1">
                        <span className="text-xs font-mono text-muted-foreground">
                          {block.startTime}
                        </span>
                        {index === ganttChart.length - 1 && (
                          <span className="text-xs font-mono text-primary">
                            {block.endTime}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <AnimatePresence>
        {stats && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="glass-panel p-6 text-center">
              <p className="text-xs font-mono text-muted-foreground mb-2">
                AVG WAITING TIME
              </p>
              <p className="text-3xl font-mono font-bold text-primary neon-text">
                {stats.avgWaiting.toFixed(2)}
              </p>
            </div>
            <div className="glass-panel p-6 text-center">
              <p className="text-xs font-mono text-muted-foreground mb-2">
                AVG TURNAROUND TIME
              </p>
              <p className="text-3xl font-mono font-bold text-secondary neon-text-magenta">
                {stats.avgTurnaround.toFixed(2)}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
