import React, { useState, useEffect } from "react";
import { SimpleGrid, Title, Text } from "@mantine/core";
import { motion } from "framer-motion";
import { CarPart, partService } from "../../services/api";
import PartCard from "./PartCard";

const PartsList: React.FC = () => {
  const [parts, setParts] = useState<CarPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParts = async () => {
      try {
        setLoading(true);
        const data = await partService.getAllParts();
        setParts(data);
        setError(null);
      } catch (err) {
        setError("Failed to load parts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchParts();
  }, []);

  if (loading) {
    return <Text>Loading parts...</Text>;
  }

  if (error) {
    return <Text color="red">{error}</Text>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Title order={2} mb="md">
        Car Parts
      </Title>

      {parts.length === 0 ? (
        <Text fz="lg" ta="center" py="xl">
          No parts available
        </Text>
      ) : (
        <SimpleGrid cols={3} spacing="lg">
          {parts.map((part) => (
            <PartCard key={part.id} part={part} />
          ))}
        </SimpleGrid>
      )}
    </motion.div>
  );
};

export default PartsList;
