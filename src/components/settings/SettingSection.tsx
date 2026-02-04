import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
  isCollapsed?: boolean;
  className?: string;
}

const SettingSection = ({
  title,
  children,
  isCollapsed = false,
  className,
}: SettingSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("space-y-3", className)}
    >
      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider px-1">
        {title}
      </h3>
      
      <AnimatePresence mode="sync">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: 1, 
              height: "auto",
              transition: {
                height: { duration: 0.3, ease: "easeOut" },
                opacity: { duration: 0.2, delay: 0.1 }
              }
            }}
            exit={{ 
              opacity: 0, 
              height: 0,
              transition: {
                height: { duration: 0.3, ease: "easeIn" },
                opacity: { duration: 0.15 }
              }
            }}
            className="space-y-2 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SettingSection;
