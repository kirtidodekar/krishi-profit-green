import { useCallback } from "react";

type HapticPattern = "light" | "medium" | "heavy" | "success" | "warning" | "error";

const patterns: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 25,
  heavy: 50,
  success: [10, 50, 10],
  warning: [25, 50, 25],
  error: [50, 100, 50],
};

export const useHapticFeedback = () => {
  const vibrate = useCallback((pattern: HapticPattern = "light") => {
    if ("vibrate" in navigator) {
      try {
        navigator.vibrate(patterns[pattern]);
      } catch (e) {
        // Vibration not supported or blocked
        console.log("Haptic feedback not available");
      }
    }
  }, []);

  const vibrateOnToggle = useCallback((isOn: boolean) => {
    vibrate(isOn ? "success" : "light");
  }, [vibrate]);

  return { vibrate, vibrateOnToggle };
};
