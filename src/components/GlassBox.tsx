import { Box, BoxProps } from "@mantine/core";
import { ReactNode } from "react";

interface GlassBoxProps extends BoxProps {
  children: ReactNode;
  className?: string;
}

const GlassBox = ({ children, className = "", ...props }: GlassBoxProps) => {
  return (
    <Box
      className={`rounded-md ${className}`}
      style={{
        backgroundColor: "var(--mantine-color-dark-9)",
        backdropFilter: "blur(8px)",
        border: "1px solid var(--mantine-color-dark-8)",
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default GlassBox;
