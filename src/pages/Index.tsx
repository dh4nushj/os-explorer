import { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/Sidebar";
import { CPUScheduler } from "@/components/CPUScheduler";
import { DiskController } from "@/components/DiskController";
import { QuizView } from "@/components/QuizView";

type View = "cpu" | "disk" | "quiz";

const Index = () => {
  const [activeView, setActiveView] = useState<View>("cpu");

  const renderView = () => {
    switch (activeView) {
      case "cpu":
        return <CPUScheduler />;
      case "disk":
        return <DiskController />;
      case "quiz":
        return <QuizView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderView()}
          </motion.div>
        </div>
      </main>

      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default Index;
