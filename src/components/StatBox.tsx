import { Box, Text, Badge } from "@mantine/core";
import CountAnimation from "./CountAnimation";

interface StatBoxProps {
  label: string;
  count: number;
  description: string;
  delay?: number;
  className?: string;
  compact?: boolean;
}

const StatBox = ({
  label,
  count,
  description,
  delay = 0,
  className = "",
  compact = false,
}: StatBoxProps) => {
  return (
    <Box
      className={`${compact ? "p-2" : "p-4"} rounded-md ${
        compact ? "flex flex-col items-center text-center" : "flex-1"
      } ${className}`}
      style={{
        backgroundColor: "var(--mantine-color-dark-9)",
        backdropFilter: "blur(8px)",
        border: "1px solid var(--mantine-color-dark-8)",
      }}
    >
      <Text size={compact ? "xs" : "sm"} c="violet" fw={500} className="mb-1">
        <Badge variant="light" size={compact ? "md" : "lg"} radius="sm">
          {label}
        </Badge>
      </Text>
      <CountAnimation from={0} to={count} delay={delay} />
      <Text
        size={compact ? "xs" : "md"}
        fw={600}
        className={compact ? "leading-tight" : ""}
      >
        {compact ? (
          <>
            {description.split(" ")[0]}
            <br />
            {description.split(" ").slice(1).join(" ")}
          </>
        ) : (
          description
        )}
      </Text>
    </Box>
  );
};

export default StatBox;
