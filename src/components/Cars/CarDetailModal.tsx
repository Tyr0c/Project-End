import {
  Modal,
  Image,
  Text,
  Badge,
  Group,
  SimpleGrid,
  Title,
  Paper,
  Divider,
} from "@mantine/core";
import { Car } from "../../services/api";
import {
  IconGasStation,
  IconGauge,
  IconManualGearbox,
  IconCalendar,
  IconDoorEnter,
  IconWeight,
  IconTruckLoading,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

interface CarDetailModalProps {
  car: Car | null;
  opened: boolean;
  onClose: () => void;
}

const CarDetailModal: React.FC<CarDetailModalProps> = ({
  car,
  opened,
  onClose,
}) => {
  if (!car) return null;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="lg"
      padding="lg"
      title={
        <Title order={3} fw={700}>
          {car.model}
        </Title>
      }
      centered
      transitionProps={{
        transition: "slide-up",
        duration: 300,
      }}
    >
      <div className="relative">
        <div className="mb-4">
          <Image
            src={
              car.image ||
              "https://placehold.co/800x400?text=No+Image+Available"
            }
            height={300}
            fit="cover"
            radius="md"
            className="mb-4"
          />
          <Badge
            color="violet"
            size="lg"
            radius="sm"
            className="absolute top-2 right-2"
          >
            ${car.price?.toLocaleString()}
          </Badge>
        </div>

        <SimpleGrid cols={2} spacing="md" mb="md">
          <motion.div
            custom={1}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <Paper p="md" withBorder radius="md">
              <Group wrap="nowrap">
                <IconCalendar size={20} color="var(--mantine-color-violet-6)" />
                <div>
                  <Text size="xs" color="dimmed" fw={500}>
                    Year
                  </Text>
                  <Text fw={600}>{car.year}</Text>
                </div>
              </Group>
            </Paper>
          </motion.div>

          <motion.div
            custom={2}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <Paper p="md" withBorder radius="md">
              <Group wrap="nowrap">
                <IconGasStation
                  size={20}
                  color="var(--mantine-color-violet-6)"
                />
                <div>
                  <Text size="xs" color="dimmed" fw={500}>
                    Fuel Type
                  </Text>
                  <Text fw={600}>{car.fuel_type || "N/A"}</Text>
                </div>
              </Group>
            </Paper>
          </motion.div>

          <motion.div
            custom={3}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <Paper p="md" withBorder radius="md">
              <Group wrap="nowrap">
                <IconManualGearbox
                  size={20}
                  color="var(--mantine-color-violet-6)"
                />
                <div>
                  <Text size="xs" color="dimmed" fw={500}>
                    Transmission
                  </Text>
                  <Text fw={600}>{car.transmission || "N/A"}</Text>
                </div>
              </Group>
            </Paper>
          </motion.div>

          <motion.div
            custom={4}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <Paper p="md" withBorder radius="md">
              <Group wrap="nowrap">
                <IconDoorEnter
                  size={20}
                  color="var(--mantine-color-violet-6)"
                />
                <div>
                  <Text size="xs" color="dimmed" fw={500}>
                    Doors
                  </Text>
                  <Text fw={600}>{car.doors || "N/A"}</Text>
                </div>
              </Group>
            </Paper>
          </motion.div>
        </SimpleGrid>

        <Divider my="md" />

        <Title order={4} mb="sm" fw={700}>
          Additional Information
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          {car.power && (
            <Group wrap="nowrap">
              <IconGauge size={18} />
              <Text fw={600}>Power: {car.power} HP</Text>
            </Group>
          )}

          {car.total_weight && (
            <Group wrap="nowrap">
              <IconWeight size={18} />
              <Text fw={600}>Weight: {car.total_weight} kg</Text>
            </Group>
          )}

          {car.trunk_capacity && (
            <Group wrap="nowrap">
              <IconTruckLoading size={18} />
              <Text fw={600}>Trunk: {car.trunk_capacity} L</Text>
            </Group>
          )}

          {car.color && (
            <Group wrap="nowrap">
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  backgroundColor: car.color.toLowerCase(),
                  border: "1px solid #ccc",
                }}
              ></div>
              <Text fw={600}>Color: {car.color}</Text>
            </Group>
          )}
        </SimpleGrid>

        {car.description && (
          <>
            <Divider my="md" />
            <Title order={4} mb="sm" fw={700}>
              Description
            </Title>
            <Text fw={500}>{car.description}</Text>
          </>
        )}
      </div>
    </Modal>
  );
};

export default CarDetailModal;
