import { useEffect, useState } from "react";
import { animate } from "framer-motion";
import { Title } from "@mantine/core";
import { formatNumber } from "../utils/formatNumber";
import { useViewportSize } from "../hooks/useViewportSize";

interface CountAnimationProps {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
}

const CountAnimation = ({
  from = 0,
  to,
  duration = 1.5,
  delay = 0,
}: CountAnimationProps) => {
  const [count, setCount] = useState(from);
  const { isMobile } = useViewportSize();
  useEffect(() => {
    const timeout = setTimeout(() => {
      const controls = animate(from, to, {
        duration,
        delay,
        onUpdate: (value) => {
          setCount(Math.round(value));
        },
        ease: "easeInOut",
      });

      return () => controls.stop();
    }, 100);

    return () => clearTimeout(timeout);
  }, [from, to, duration, delay]);

  return (
    <Title order={isMobile ? 3 : 2} className="text-4xl mb-1 text-white">
      {formatNumber(count)}
    </Title>
  );
};

export default CountAnimation;
