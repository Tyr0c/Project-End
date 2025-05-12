import { useCars } from "../context/CarContext";
import CarCard from "../components/Cars/CarCard";
import {
  Grid,
  Text,
  Skeleton,
  Group,
  Card,
  Center,
  ActionIcon,
} from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import FilterPanel from "../components/FilterPanel/FilterPanel";
import { Car, CarPart, partService } from "../services/api";
import { IconFilter, IconX } from "@tabler/icons-react";
import PartCard from "../components/Parts/PartCard";

interface HomePageProps {
  handleSectionChange?: (section: string, brandFilter: string | null) => void;
  initialSection?: string;
  initialBrandFilter?: string | null;
}

const CarSkeleton = ({ index }: { index: number }) => (
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
        <Skeleton height={160} width="100%" />
      </Card.Section>
      <Group mt="md" mb="xs" justify="space-between">
        <Skeleton height={20} width="60%" />
        <Skeleton height={20} width="25%" radius="xl" />
      </Group>
      <Skeleton height={15} width="40%" mt={8} />
      <Skeleton height={36} width="100%" mt="md" />
    </Card>
  </motion.div>
);

const PartSkeleton = ({ index }: { index: number }) => (
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
        <Skeleton height={160} width="100%" />
      </Card.Section>
      <Group mt="md" mb="xs" justify="space-between">
        <Skeleton height={20} width="60%" />
        <Skeleton height={20} width="25%" radius="xl" />
      </Group>
      <Skeleton height={15} width="40%" mt={8} />
      <Skeleton height={20} width="30%" mt={8} />
      <Skeleton height={36} width="100%" mt="md" />
    </Card>
  </motion.div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const HomePage = ({ initialSection, initialBrandFilter }: HomePageProps) => {
  const {
    cars,
    loading: carsLoading,
    error: carsError,
    selectedBrandId,
    brands,
  } = useCars();
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"cars" | "parts">("cars");
  const [selectedPartBrand, setSelectedPartBrand] = useState<string | null>(
    initialBrandFilter || null
  );

  const [parts, setParts] = useState<CarPart[]>([]);
  const [filteredParts, setFilteredParts] = useState<CarPart[]>([]);
  const [partsLoading, setPartsLoading] = useState(true);
  const [partsError, setPartsError] = useState<string | null>(null);

  const loading = activeSection === "cars" ? carsLoading : partsLoading;
  const error = activeSection === "cars" ? carsError : partsError;
  const handleSectionChange = useCallback(
    (section: string, brandFilter: string | null = null) => {
      if (section === "parts") {
        setActiveSection("parts");
        setSelectedPartBrand(brandFilter);
        if (parts.length === 0) {
          loadParts();
        }
      } else {
        setActiveSection("cars");
      }
      setFiltersOpen(false);
    },
    [parts.length]
  );
  const loadParts = async () => {
    try {
      setPartsLoading(true);
      const data = await partService.getAllParts();
      setParts(data);
      setFilteredParts(data);
      setPartsError(null);
    } catch (err) {
      setPartsError("Failed to load parts. Please try again later.");
    } finally {
      setPartsLoading(false);
    }
  };
  useEffect(() => {
    if (activeSection === "parts" && parts.length === 0) {
      loadParts();
    }
  }, [activeSection, parts.length]);

  useEffect(() => {
    if (initialSection) {
      handleSectionChange(initialSection, initialBrandFilter || null);
    }
  }, [initialSection, initialBrandFilter, handleSectionChange]);
  useEffect(() => {
    const loadApprovedCars = async () => {
      try {
        if (cars && cars.length > 0) {
          const approvedCars = cars.filter((car) => car.status === "approved");
          setFilteredCars(approvedCars);
        }
      } catch (err) {}
    };

    if (activeSection === "cars") {
      loadApprovedCars();
    }
  }, [cars, activeSection]);
  const handleFilterApplied = (newFilteredCars: Car[]) => {
    const approvedFilteredCars = newFilteredCars.filter(
      (car) => car.status === "approved"
    );
    setFilteredCars(approvedFilteredCars);
  };

  const toggleFilters = () => {
    setFiltersOpen((prev) => !prev);
  };
  const getTitle = () => {
    if (activeSection === "parts") {
      return "All Car Parts";
    } else {
      const selectedBrandName = selectedBrandId
        ? brands.find((b) => String(b.id) === selectedBrandId)?.label
        : null;
      return selectedBrandName ? `${selectedBrandName} Cars` : "All Cars";
    }
  };

  const title = getTitle();
  const renderCarSkeletons = () => {
    return (
      <Grid>
        {[...Array(8)].map((_, index) => (
          <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3 }} key={index}>
            <CarSkeleton index={index} />
          </Grid.Col>
        ))}
      </Grid>
    );
  };

  const renderPartSkeletons = () => {
    return (
      <Grid>
        {[...Array(8)].map((_, index) => (
          <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3 }} key={index}>
            <PartSkeleton index={index} />
          </Grid.Col>
        ))}
      </Grid>
    );
  };
  const renderContent = () => {
    if (activeSection === "cars") {
      return (
        <>
          <div className="flex flex-row justify-between items-center mb-6">
            <motion.h1
              className="text-2xl font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {title}
            </motion.h1>

            <ActionIcon
              variant="light"
              color="violet"
              size={45}
              className="shadow-md"
              onClick={toggleFilters}
            >
              {filtersOpen ? <IconX size={24} /> : <IconFilter size={24} />}
            </ActionIcon>
          </div>

          <div style={{ position: "relative", overflow: "hidden" }}>
            <AnimatePresence mode="wait">
              {filtersOpen && !loading && !error && (
                <motion.div
                  key="filter-panel"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                    transition: {
                      height: {
                        duration: 0.4,
                        ease: [0.04, 0.62, 0.23, 0.98],
                      },
                      opacity: { duration: 0.3, delay: 0.1 },
                    },
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    transition: {
                      height: { duration: 0.3 },
                      opacity: { duration: 0.2 },
                    },
                  }}
                  style={{ overflow: "hidden", marginBottom: "1.5rem" }}
                >
                  <div className="filter-panel-content">
                    <FilterPanel onFilter={handleFilterApplied} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {carsLoading ? (
            renderCarSkeletons()
          ) : carsError ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Text color="red" size="lg" className="mb-4">
                {carsError}
              </Text>
            </motion.div>
          ) : filteredCars.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-[80%]"
            >
              <Center className="w-full">
                <Text size="lg" className="text-center">
                  No cars found. Please try a different selection.
                </Text>
              </Center>
            </motion.div>
          ) : (
            <motion.div
              key={selectedBrandId || "all"}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Grid>
                {filteredCars.map((car, index) => (
                  <Grid.Col
                    span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                    key={car.id}
                  >
                    <CarCard car={car} index={index} />
                  </Grid.Col>
                ))}
              </Grid>
            </motion.div>
          )}
        </>
      );
    } else {
      return (
        <>
          <div className="flex flex-row justify-between items-center mb-6">
            <motion.h1
              className="text-2xl font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {title}
            </motion.h1>
          </div>

          {partsLoading ? (
            renderPartSkeletons()
          ) : partsError ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Text color="red" size="lg" className="mb-4">
                {partsError}
              </Text>
            </motion.div>
          ) : filteredParts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-[80%]"
            >
              <Center className="w-full">
                <Text size="lg" className="text-center">
                  {selectedPartBrand
                    ? `No parts compatible with ${selectedPartBrand} found.`
                    : "No parts available."}
                </Text>
              </Center>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Grid>
                {filteredParts.map((part, index) => (
                  <Grid.Col
                    span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                    key={part.id || index}
                  >
                    <PartCard part={part} index={index} />
                  </Grid.Col>
                ))}
              </Grid>
            </motion.div>
          )}
        </>
      );
    }
  };

  return <div className="p-6 h-full">{renderContent()}</div>;
};

export default HomePage;
