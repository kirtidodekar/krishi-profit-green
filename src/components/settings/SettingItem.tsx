import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  type: "toggle" | "link" | "input";
  value?: boolean | string;
  onChange?: (value: boolean | string) => void;
  onClick?: () => void;
  isSaving?: boolean;
  isSaved?: boolean;
  disabled?: boolean;
  rightContent?: React.ReactNode;
  iconBgColor?: string;
}

const SettingItem = ({
  icon,
  label,
  description,
  type,
  value,
  onChange,
  onClick,
  isSaving,
  isSaved,
  disabled,
  rightContent,
  iconBgColor = "bg-primary/10",
}: SettingItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center gap-4 p-4 rounded-2xl bg-card border border-border",
        "transition-all duration-200",
        disabled && "opacity-50",
        type === "link" && !disabled && "active:scale-[0.98] cursor-pointer"
      )}
      onClick={type === "link" && !disabled ? onClick : undefined}
    >
      {/* Icon Container */}
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
          iconBgColor
        )}
      >
        <span className="text-primary">{icon}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-foreground truncate">{label}</p>
          
          {/* Save Status Indicator */}
          <AnimatePresence mode="wait">
            {isSaving && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center"
              >
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              </motion.div>
            )}
            {isSaved && !isSaving && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1 text-success"
              >
                <Check className="w-4 h-4" />
                <span className="text-xs font-medium">Saved</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground truncate">{description}</p>
        )}
      </div>

      {/* Right Content */}
      {type === "toggle" && (
        <Switch
          checked={value as boolean}
          onCheckedChange={(checked) => onChange?.(checked)}
          disabled={disabled}
          className="shrink-0"
        />
      )}
      {rightContent}
    </motion.div>
  );
};

export default SettingItem;
