import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, HardDrive } from "lucide-react";

interface SeekStep {
  from: number;
  to: number;
  distance: number;
  isJump: boolean;
}

export const DiskController = () => {
  const [headPosition, setHeadPosition] = useState("50");
  const [diskSize, setDiskSize] = useState("200");
  const [requestQueue, setRequestQueue] = useState("98,183,37,122,14,124,65,67");
  const [seekSteps, setSeekSteps] = useState<SeekStep[]>([]);
  const [totalSeek, setTotalSeek] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentHead, setCurrentHead] = useState(50);
  const [currentStep, setCurrentStep] = useState(-1);
  const [visitedPositions, setVisitedPositions] = useState<number[]>([]);

  const runCSCAN = async () => {
    const head = parseInt(headPosition);
    const size = parseInt(diskSize);
    const requests = requestQueue
      .split(",")
      .map((r) => parseInt(r.trim()))
      .filter((r) => !isNaN(r) && r >= 0 && r < size);

    if (isNaN(head) || requests.length === 0) return;

    setIsRunning(true);
    setSeekSteps([]);
    setTotalSeek(0);
    setCurrentHead(head);
    setCurrentStep(-1);
    setVisitedPositions([head]);

    // Sort requests
    const sortedRequests = [...requests].sort((a, b) => a - b);

    // Split into right (>= head) and left (< head)
    const right = sortedRequests.filter((r) => r >= head);
    const left = sortedRequests.filter((r) => r < head);

    const steps: SeekStep[] = [];
    let currentPos = head;
    let total = 0;
    const visited: number[] = [head];

    // Service right side first
    for (const pos of right) {
      const distance = Math.abs(pos - currentPos);
      steps.push({ from: currentPos, to: pos, distance, isJump: false });
      total += distance;
      currentPos = pos;
      visited.push(pos);
    }

    // Go to end of disk
    if (currentPos < size - 1) {
      const distance = (size - 1) - currentPos;
      steps.push({ from: currentPos, to: size - 1, distance, isJump: false });
      total += distance;
      currentPos = size - 1;
      visited.push(size - 1);
    }

    // Jump to beginning (no servicing)
    if (left.length > 0) {
      const jumpDistance = currentPos; // From end to 0
      steps.push({ from: currentPos, to: 0, distance: jumpDistance, isJump: true });
      total += jumpDistance;
      currentPos = 0;
      visited.push(0);

      // Service left side
      for (const pos of left) {
        const distance = Math.abs(pos - currentPos);
        steps.push({ from: currentPos, to: pos, distance, isJump: false });
        total += distance;
        currentPos = pos;
        visited.push(pos);
      }
    }

    // Animate steps
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      setSeekSteps(steps.slice(0, i + 1));
      setCurrentHead(steps[i].to);
      setVisitedPositions(visited.slice(0, i + 2));
      await new Promise((r) => setTimeout(r, steps[i].isJump ? 300 : 500));
    }

    setTotalSeek(total);
    setIsRunning(false);
  };

  const reset = () => {
    setSeekSteps([]);
    setTotalSeek(0);
    setCurrentHead(parseInt(headPosition) || 50);
    setCurrentStep(-1);
    setVisitedPositions([]);
  };

  const diskSizeNum = parseInt(diskSize) || 200;
  const requests = requestQueue
    .split(",")
    .map((r) => parseInt(r.trim()))
    .filter((r) => !isNaN(r) && r >= 0 && r < diskSizeNum);

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
            DISK CONTROLLER
          </h2>
          <p className="text-muted-foreground font-mono text-sm">
            // C-SCAN (Circular SCAN) Algorithm
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={runCSCAN}
            disabled={isRunning}
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
          // CONFIGURATION
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-mono text-muted-foreground">
              HEAD POSITION
            </label>
            <input
              type="number"
              min="0"
              value={headPosition}
              onChange={(e) => setHeadPosition(e.target.value)}
              className="w-full bg-input border border-border rounded-lg px-3 py-2 font-mono text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-muted-foreground">
              DISK SIZE
            </label>
            <input
              type="number"
              min="1"
              value={diskSize}
              onChange={(e) => setDiskSize(e.target.value)}
              className="w-full bg-input border border-border rounded-lg px-3 py-2 font-mono text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-muted-foreground">
              REQUEST QUEUE (comma-separated)
            </label>
            <input
              type="text"
              value={requestQueue}
              onChange={(e) => setRequestQueue(e.target.value)}
              className="w-full bg-input border border-border rounded-lg px-3 py-2 font-mono text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50"
              placeholder="98,183,37,122,14,124,65,67"
            />
          </div>
        </div>
      </motion.div>

      {/* Disk Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-mono text-muted-foreground">
            // DISK TRACK VISUALIZATION
          </h3>
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-primary" />
            <span className="font-mono text-primary">
              Head @ {currentHead}
            </span>
          </div>
        </div>

        {/* Linear Track */}
        <div className="relative h-32 mb-8">
          {/* Track background */}
          <div className="absolute top-1/2 left-0 right-0 h-2 bg-muted rounded-full -translate-y-1/2" />

          {/* Tick marks */}
          <div className="absolute top-1/2 left-0 right-0 flex justify-between -translate-y-1/2">
            {[0, 50, 100, 150, diskSizeNum - 1].map((tick) => (
              <div
                key={tick}
                className="flex flex-col items-center"
                style={{
                  position: "absolute",
                  left: `${(tick / (diskSizeNum - 1)) * 100}%`,
                  transform: "translateX(-50%)",
                }}
              >
                <div className="w-0.5 h-4 bg-muted-foreground/50" />
                <span className="text-xs font-mono text-muted-foreground mt-1">
                  {tick}
                </span>
              </div>
            ))}
          </div>

          {/* Request positions */}
          {requests.map((req, i) => (
            <motion.div
              key={`req-${req}-${i}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`absolute top-1/2 w-3 h-3 rounded-full -translate-y-1/2 -translate-x-1/2 ${
                visitedPositions.includes(req)
                  ? "bg-neon-green shadow-[0_0_10px_hsl(150,100%,50%)]"
                  : "bg-secondary shadow-[0_0_10px_hsl(320,100%,60%)]"
              }`}
              style={{
                left: `${(req / (diskSizeNum - 1)) * 100}%`,
              }}
            />
          ))}

          {/* Path lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
            <AnimatePresence>
              {seekSteps.map((step, i) => {
                const x1 = (step.from / (diskSizeNum - 1)) * 100;
                const x2 = (step.to / (diskSizeNum - 1)) * 100;
                const y = 64; // Center of 128px height

                return (
                  <motion.line
                    key={`line-${i}`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    x1={`${x1}%`}
                    y1={y}
                    x2={`${x2}%`}
                    y2={y}
                    stroke={step.isJump ? "hsl(0, 84%, 60%)" : "hsl(180, 100%, 50%)"}
                    strokeWidth={step.isJump ? 2 : 3}
                    strokeDasharray={step.isJump ? "5,5" : "0"}
                    className={step.isJump ? "" : "drop-shadow-[0_0_8px_hsl(180,100%,50%)]"}
                  />
                );
              })}
            </AnimatePresence>
          </svg>

          {/* Head marker */}
          <motion.div
            animate={{
              left: `${(currentHead / (diskSizeNum - 1)) * 100}%`,
            }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
          >
            <div className="relative">
              <div className="w-6 h-6 bg-primary rounded-full shadow-[0_0_20px_hsl(180,100%,50%)] flex items-center justify-center">
                <div className="w-2 h-2 bg-background rounded-full" />
              </div>
              <motion.div
                className="absolute inset-0 bg-primary/30 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 justify-center text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-secondary" />
            <span className="text-muted-foreground">Pending Request</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-neon-green" />
            <span className="text-muted-foreground">Serviced</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-primary" />
            <span className="text-muted-foreground">Seek Path</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-destructive border-dashed border-t-2 border-destructive" />
            <span className="text-muted-foreground">Jump (No Read)</span>
          </div>
        </div>
      </motion.div>

      {/* Seek Operations Log */}
      <AnimatePresence>
        {seekSteps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6"
          >
            <h3 className="text-sm font-mono text-muted-foreground mb-4">
              // SEEK OPERATIONS LOG
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {seekSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-4 p-3 rounded-lg ${
                    step.isJump ? "bg-destructive/10 border border-destructive/30" : "bg-muted/30"
                  }`}
                >
                  <span className="font-mono text-muted-foreground w-8">
                    [{String(i + 1).padStart(2, "0")}]
                  </span>
                  <span className="font-mono text-foreground">
                    {step.from}
                  </span>
                  <span className={`font-mono ${step.isJump ? "text-destructive" : "text-primary"}`}>
                    {step.isJump ? "⟿" : "→"}
                  </span>
                  <span className="font-mono text-foreground">
                    {step.to}
                  </span>
                  <span className="font-mono text-muted-foreground ml-auto">
                    +{step.distance}
                  </span>
                  {step.isJump && (
                    <span className="text-xs font-mono text-destructive uppercase">
                      JUMP
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Total Seek */}
      <AnimatePresence>
        {totalSeek > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-6 text-center"
          >
            <p className="text-xs font-mono text-muted-foreground mb-2">
              TOTAL SEEK OPERATIONS
            </p>
            <p className="text-4xl font-mono font-bold text-primary neon-text">
              {totalSeek}
            </p>
            <p className="text-sm font-mono text-muted-foreground mt-2">
              cylinders traversed
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
