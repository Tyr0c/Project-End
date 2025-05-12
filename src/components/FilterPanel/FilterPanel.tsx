import { useState, useEffect } from "react";
import {
  Box,
  MultiSelect,
  RangeSlider,
  SegmentedControl,
  Group,
  Title,
  NumberInput,
  Paper,
  Button,
  Accordion,
  Flex,
} from "@mantine/core";
import { motion } from "framer-motion";
import { useCars } from "../../context/CarContext";
import { Car } from "../../services/api";
import {
  IconChevronDown,
  IconSortAscending,
  IconSortDescending,
  IconSearch,
} from "@tabler/icons-react";

interface FilterPanelProps {
  onFilter: (filteredCars: Car[]) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFilter }) => {
  const { cars } = useCars();
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>(
    []
  );
  const [selectedDoors, setSelectedDoors] = useState<string[]>([]);
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | "">("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [maxPrice, setMaxPrice] = useState(0);

  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [availableFuelTypes, setAvailableFuelTypes] = useState<string[]>([]);
  const [availableTransmissions, setAvailableTransmissions] = useState<
    string[]
  >([]);
  const [availableDoors, setAvailableDoors] = useState<string[]>([]);

  useEffect(() => {
    if (!cars.length) return;

    const years = [...new Set(cars.map((car) => car.year.toString()))].sort(
      (a, b) => parseInt(b) - parseInt(a)
    );
    const fuelTypes = [
      ...new Set(cars.map((car) => car.fuel_type || "Unknown")),
    ];
    const transmissions = [
      ...new Set(cars.map((car) => car.transmission || "Unknown")),
    ];
    const doors = [
      ...new Set(cars.map((car) => car.doors?.toString() || "Unknown")),
    ];
    const highest = Math.max(...cars.map((car) => car.price));

    setAvailableYears(years);
    setAvailableFuelTypes(fuelTypes);
    setAvailableTransmissions(transmissions);
    setAvailableDoors(doors);
    setMaxPrice(highest);
    setPriceRange([0, highest]);
  }, [cars]);

  useEffect(() => {
    applyFilters();
  }, [
    selectedYears,
    selectedFuelTypes,
    selectedTransmissions,
    selectedDoors,
    priceSort,
    priceRange,
  ]);

  const applyFilters = () => {
    let filteredCars = [...cars];

    if (selectedYears.length > 0) {
      filteredCars = filteredCars.filter((car) =>
        selectedYears.includes(car.year.toString())
      );
    }

    if (selectedFuelTypes.length > 0) {
      filteredCars = filteredCars.filter(
        (car) => car.fuel_type && selectedFuelTypes.includes(car.fuel_type)
      );
    }

    if (selectedTransmissions.length > 0) {
      filteredCars = filteredCars.filter(
        (car) =>
          car.transmission && selectedTransmissions.includes(car.transmission)
      );
    }

    if (selectedDoors.length > 0) {
      filteredCars = filteredCars.filter(
        (car) => car.doors && selectedDoors.includes(car.doors.toString())
      );
    }

    filteredCars = filteredCars.filter(
      (car) => car.price >= priceRange[0] && car.price <= priceRange[1]
    );

    if (priceSort === "asc") {
      filteredCars.sort((a, b) => a.price - b.price);
    } else if (priceSort === "desc") {
      filteredCars.sort((a, b) => b.price - a.price);
    }

    onFilter(filteredCars);
  };

  const resetFilters = () => {
    setSelectedYears([]);
    setSelectedFuelTypes([]);
    setSelectedTransmissions([]);
    setSelectedDoors([]);
    setPriceSort("");
    setPriceRange([0, maxPrice]);
  };

  return (
    <Paper p="md" mb="md" withBorder>
      <Title order={4} mb="md">
        Filter Cars
      </Title>

      <Box mb="md">
        <Flex gap="md" wrap="wrap">
          <Box style={{ flex: "1 1 150px", minWidth: "150px" }}>
            <MultiSelect
              label="Year"
              placeholder="Select years"
              data={availableYears.map((year) => ({
                value: year,
                label: year,
              }))}
              value={selectedYears}
              onChange={setSelectedYears}
              clearable
              searchable
              rightSection={<IconChevronDown size={16} />}
            />
          </Box>

          <Box style={{ flex: "1 1 150px", minWidth: "150px" }}>
            <MultiSelect
              label="Fuel Type"
              placeholder="Select fuel types"
              data={availableFuelTypes.map((type) => ({
                value: type,
                label: type,
              }))}
              value={selectedFuelTypes}
              onChange={setSelectedFuelTypes}
              clearable
              rightSection={<IconChevronDown size={16} />}
            />
          </Box>

          <Box style={{ flex: "1 1 150px", minWidth: "150px" }}>
            <MultiSelect
              label="Transmission"
              placeholder="Select transmission"
              data={availableTransmissions.map((trans) => ({
                value: trans,
                label: trans,
              }))}
              value={selectedTransmissions}
              onChange={setSelectedTransmissions}
              clearable
              rightSection={<IconChevronDown size={16} />}
            />
          </Box>

          <Box style={{ flex: "1 1 150px", minWidth: "150px" }}>
            <MultiSelect
              label="Doors"
              placeholder="Select door count"
              data={availableDoors.map((doors) => ({
                value: doors,
                label: `${doors} doors`,
              }))}
              value={selectedDoors}
              onChange={setSelectedDoors}
              clearable
              rightSection={<IconChevronDown size={16} />}
            />
          </Box>
        </Flex>
      </Box>

      <Accordion defaultValue="advanced">
        <Accordion.Item value="advanced">
          <Accordion.Control icon={<IconSearch size={18} />}>
            Advanced Search Options
          </Accordion.Control>
          <Accordion.Panel>
            <Box mb="md">
              <Group p="apart" mb={5}>
                <Title order={6}>Price Range</Title>
                <Group>
                  <NumberInput
                    value={priceRange[0]}
                    onChange={(val: number | string | null | undefined) => {
                      const newValue =
                        val === null || val === undefined ? 0 : Number(val);
                      setPriceRange([newValue, priceRange[1]]);
                    }}
                    size="xs"
                    step={500}
                    min={0}
                    max={priceRange[1]}
                    style={{ width: 100 }}
                  />
                  <span>to</span>
                  <NumberInput
                    value={priceRange[1]}
                    onChange={(val: number | string | null | undefined) => {
                      const newValue =
                        val === null || val === undefined
                          ? maxPrice
                          : Number(val);
                      setPriceRange([priceRange[0], newValue]);
                    }}
                    size="xs"
                    step={500}
                    min={priceRange[0]}
                    max={maxPrice}
                    style={{ width: 100 }}
                  />
                </Group>
              </Group>

              <RangeSlider
                value={priceRange}
                onChange={setPriceRange}
                min={0}
                max={maxPrice}
                step={500}
                minRange={500}
                labelAlwaysOn
                marks={[
                  { value: 0, label: "$0" },
                  {
                    value: maxPrice / 2,
                    label: `$${Math.round(maxPrice / 2).toLocaleString()}`,
                  },
                  {
                    value: maxPrice,
                    label: `$${Math.round(maxPrice).toLocaleString()}`,
                  },
                ]}
              />
            </Box>

            <Group p="apart" align="center">
              <Group>
                <Title order={6}>Price Sort</Title>
                <SegmentedControl
                  value={priceSort}
                  onChange={(value: string) =>
                    setPriceSort(value as "asc" | "desc" | "")
                  }
                  data={[
                    {
                      label: (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <IconSortAscending size={18} />
                          <span style={{ marginLeft: 5 }}>Low to High</span>
                        </motion.div>
                      ),
                      value: "asc",
                    },
                    {
                      label: (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <IconSortDescending size={18} />
                          <span style={{ marginLeft: 5 }}>High to Low</span>
                        </motion.div>
                      ),
                      value: "desc",
                    },
                  ]}
                />
              </Group>
            </Group>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <Group p="left" mt="md">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="light" onClick={resetFilters} size="sm">
            Reset Filters
          </Button>
        </motion.div>
      </Group>
    </Paper>
  );
};

export default FilterPanel;
