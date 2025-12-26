import { useState, useEffect } from "react";
import { Scene } from "@/types";

export function useTutorial(scenes: Scene[]) {
  const [index, setIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const scene = scenes[index];

  useEffect(() => {
    if (!scene?.text) return;

    let i = 0;
    setTypedText("");
    setIsTyping(true);

    const interval = setInterval(() => {
      if (i < scene.text!.length) {
        setTypedText((t) => t + scene.text![i++]);
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [index]);

  return {
    scene,
    typedText,
    isTyping,
    next: () => setIndex((i) => i + 1),
  };
}
