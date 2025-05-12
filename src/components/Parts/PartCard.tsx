import React from "react";
import { Card, Image, Text, Badge, Group, Title } from "@mantine/core";
import { motion } from "framer-motion";
import { CarPart } from "../../services/api";

interface PartCardProps {
  part: CarPart;
  index?: number;
  onDelete?: () => void;
}

const PartCard: React.FC<PartCardProps> = ({ part, index = 0 }) => {
  if (!part) {
    return null;
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: "easeInOut",
      }}
    >
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          <Image
            src={
              part.image ||
              "https://placehold.co/600x400?text=No+Image+Available"
            }
            height={160}
            alt={part.car_model}
          />
        </Card.Section>

        <Group mt="md" mb="xs">
          <Title order={5} style={{ fontWeight: 600 }}>
            {part.name}
          </Title>
        </Group>

        <Group mb="md" className="flex flex-row gap-2">
          <Badge variant="outline" size="lg" radius="sm">
            {part.car_model}
          </Badge>
          <Badge variant="light" size="lg" radius="sm">
            ${part.price.toLocaleString()}
          </Badge>
        </Group>

        <Text size="sm" lineClamp={2}>
          {part.description}
        </Text>
      </Card>
    </motion.div>
  );
};

export default PartCard;
