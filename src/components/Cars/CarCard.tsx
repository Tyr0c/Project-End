import React, { useState } from "react";
import { Card, Image, Text, Badge, Group } from "@mantine/core";
import { motion } from "framer-motion";
import { Car } from "../../services/api";
import CarDetailModal from "./CarDetailModal";

interface CarCardProps {
  car: Car;
  index?: number;
  onDelete?: () => void;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const [modalOpened, setModalOpened] = useState(false);

  return (
    <motion.div>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        className="h-full flex flex-col cursor-pointer transition-all hover:shadow-lg"
        onClick={() => setModalOpened(true)}
      >
        <Card.Section>
          <Image
            src={
              car.image ||
              "https://placehold.co/600x400?text=No+Image+Available"
            }
            height={160}
            alt={car.model}
          />
        </Card.Section>

        <Group mt="md" mb="xs" justify="space-between">
          <Text fw={500}>{car.model}</Text>
          <Badge variant="light" size="lg" radius="sm">
            {car.year}
          </Badge>
        </Group>
        <Group mt="auto" justify="space-between" align="center">
          <Text fw={700} size="lg" c="violet">
            ${car.price.toLocaleString()}
          </Text>
          <Badge variant="light" size="lg" radius="sm">
            {car.fuel_type || "N/A"}
          </Badge>
        </Group>
      </Card>

      <CarDetailModal
        car={car}
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
      />
    </motion.div>
  );
};

export default CarCard;
