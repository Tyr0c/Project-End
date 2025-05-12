import { useEffect, useState } from "react";
import {
  Group,
  Paper,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
  Box,
  Skeleton,
} from "@mantine/core";
import {
  IconCar,
  IconUsers,
  IconComponents,
  IconClipboardCheck,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { carService, userService, partService } from "../../services/api";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [carCount, setCarCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [partCount, setPartCount] = useState(0);
  const [pendingCars, setPendingCars] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cars, users, parts] = await Promise.all([
          carService.getAllCars(),
          userService.getAllUsers(),
          partService.getAllParts(),
        ]);

        setCarCount(cars.length);
        setUserCount(users.length);
        setPartCount(parts.length);

        const notApprovedCars = cars.filter(
          (car) => car.status === "not approved"
        ).length;
        setPendingCars(notApprovedCars);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      title: "Cars",
      count: carCount,
      icon: <IconCar size={32} />,
      color: "blue",
    },
    {
      title: "Users",
      count: userCount,
      icon: <IconUsers size={32} />,
      color: "teal",
    },
    {
      title: "Car Parts",
      count: partCount,
      icon: <IconComponents size={32} />,
      color: "violet",
    },
    {
      title: "Pending Submissions",
      count: pendingCars,
      icon: <IconClipboardCheck size={32} />,
      color: "orange",
    },
  ];

  return (
    <Box>
      <Title
        order={2}
        mb="xl"
        style={{
          color: "var(--mantine-color-dark-1)",
          borderBottom: "2px solid var(--mantine-color-blue-5)",
          paddingBottom: "0.5rem",
          display: "inline-block",
        }}
      >
        Dashboard Overview
      </Title>

      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="lg">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Paper
              withBorder
              p="md"
              radius="md"
              style={{
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <Group justify="apart">
                <div>
                  <Text size="xs" c="dimmed">
                    {stat.title}
                  </Text>
                  {loading ? (
                    <Skeleton height={28} width={60} />
                  ) : (
                    <Text size="xl" fw={700}>
                      {stat.count}
                    </Text>
                  )}
                </div>
                <ThemeIcon
                  size="xl"
                  radius="md"
                  color={stat.color}
                  variant="light"
                >
                  {stat.icon}
                </ThemeIcon>
              </Group>
            </Paper>
          </motion.div>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;
