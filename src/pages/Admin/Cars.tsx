import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Group,
  ActionIcon,
  TextInput,
  Modal,
  NumberInput,
  Select,
  Textarea,
  Title,
  Paper,
  Text,
  LoadingOverlay,
  Badge,
} from "@mantine/core";
import {
  IconEdit,
  IconTrash,
  IconSearch,
  IconPlus,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { Car, carService, Brand, brandService } from "../../services/api";
import { motion } from "framer-motion";
import { showNotification } from "@mantine/notifications";

const CarsAdmin = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<number | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandSelectData, setBrandSelectData] = useState<
    { value: string; label: string }[]
  >([]);

  const [carFormData, setCarFormData] = useState<{
    id: number;
    brand_id: number;
    model: string;
    year: number;
    price: number;
    fuel_type: string | undefined;
    transmission: string | undefined;
    doors: number | undefined;
    description: string | undefined;
    brand_label: string | undefined;
    color: string;
    total_weight: number;
    trunk_capacity: number;
    power: number;
    status?: "not approved" | "approved";
  }>({
    id: 0,
    brand_id: 1,
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    fuel_type: "",
    transmission: "",
    doors: 4,
    description: "",
    brand_label: "",
    color: "",
    total_weight: 0,
    trunk_capacity: 0,
    power: 0,
    status: "not approved",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [carsData, brandsData] = await Promise.all([
          carService.getAllCars(),
          brandService.getAllBrands(),
        ]);

        setCars(carsData);
        setBrands(brandsData);

        const selectOptions = brandsData.map((brand) => ({
          value: brand.id.toString(),
          label: brand.label || brand.name || "Unknown Brand",
        }));
        setBrandSelectData(selectOptions);

        setError(null);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (car: Car) => {
    setSelectedCar(car);
    setCarFormData({
      id: car.id,
      brand_id: car.brand_id,
      model: car.model,
      year: car.year,
      price: car.price,
      fuel_type: car.fuel_type || "",
      transmission: car.transmission || "",
      doors: car.doors || 4,
      description: car.description || "",
      brand_label: car.brand_label || "",
      color: car.color || "",
      total_weight: car.total_weight || 0,
      trunk_capacity: car.trunk_capacity || 0,
      power: car.power || 0,
      status: car.status || "not approved",
    });
    setModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setCarToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (carToDelete === null) return;

    try {
      setLoading(true);
      await carService.deleteCar(carToDelete);
      setCars(cars.filter((car) => car.id !== carToDelete));
      showNotification({
        title: "Success",
        message: "Car deleted successfully",
        color: "green",
      });
    } catch (err: any) {
      showNotification({
        title: "Error",
        message: `Failed to delete car: ${err.response?.status || ""} ${
          err.response?.statusText || err.message
        }`,
        color: "red",
      });
    } finally {
      setLoading(false);
      setDeleteModalOpen(false);
      setCarToDelete(null);
    }
  };

  const handleAdd = () => {
    setSelectedCar(null);
    setCarFormData({
      id: 0,
      brand_id: 1,
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      fuel_type: "",
      transmission: "",
      doors: 4,
      description: "",
      brand_label: "",
      color: "",
      total_weight: 0,
      trunk_capacity: 0,
      power: 0,
      status: "not approved",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (selectedCar) {
        await carService.updateCar(selectedCar.id, carFormData);
      } else {
        await carService.createCar(carFormData);
      }

      const refreshedData = await carService.getAllCars();
      setCars(refreshedData);

      showNotification({
        title: "Success",
        message: selectedCar
          ? "Car updated successfully"
          : "Car added successfully",
        color: "green",
      });
      setModalOpen(false);
    } catch (err) {
      showNotification({
        title: "Error",
        message: "Failed to save car",
        color: "red",
      });
    } finally {
      setSaving(false);
    }
  };

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (car.brand_label &&
        typeof car.brand_label === "string" &&
        car.brand_label.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter ? car.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ position: "relative" }}
    >
      <LoadingOverlay visible={loading} />

      <Title order={2} mb="md">
        Cars Management
      </Title>

      <Paper withBorder p="md" radius="md" mb="xl">
        <Group justify="space-between" mb="md">
          <Group>
            <TextInput
              placeholder="Search cars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "250px" }}
              leftSection={<IconSearch size={16} />}
            />
            <Select
              placeholder="Filter by status"
              clearable
              value={statusFilter}
              onChange={setStatusFilter}
              data={[
                { value: "approved", label: "Approved" },
                { value: "not approved", label: "Not Approved" },
              ]}
              style={{ width: "180px" }}
            />
          </Group>
          <Button leftSection={<IconPlus size={16} />} onClick={handleAdd}>
            Add Car
          </Button>
        </Group>

        {error ? (
          <Text color="red" fw={500} ta="center" py="xl">
            {error}
          </Text>
        ) : (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Brand</Table.Th>
                <Table.Th>Model</Table.Th>
                <Table.Th>Year</Table.Th>
                <Table.Th>Price</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredCars.length > 0 ? (
                filteredCars.map((car) => (
                  <Table.Tr key={car.id}>
                    <Table.Td>{car.id}</Table.Td>
                    <Table.Td>{car.brand_label || "Unknown"}</Table.Td>
                    <Table.Td>{car.model}</Table.Td>
                    <Table.Td>{car.year}</Table.Td>
                    <Table.Td>${car.price?.toLocaleString()}</Table.Td>
                    <Table.Td>
                      <Badge
                        color={car.status === "approved" ? "green" : "orange"}
                        variant="light"
                        radius="sm"
                      >
                        {car.status || "not approved"}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group>
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => handleEdit(car)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="light"
                          color="red"
                          onClick={() => handleDeleteClick(car.id)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <Text ta="center">No cars found</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        )}
      </Paper>

      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={
          <Group align="center">
            <IconAlertTriangle size={24} color="red" />
            <Text>Confirm Deletion</Text>
          </Group>
        }
        size="md"
        centered
      >
        <Text mb="xl">
          Are you sure you want to delete this car? This action cannot be
          undone.
        </Text>
        <Group justify="right">
          <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedCar ? "Edit Car" : "Add New Car"}
        size="lg"
      >
        <div style={{ position: "relative" }}>
          <LoadingOverlay visible={saving} />

          <TextInput
            label="Model"
            placeholder="e.g., Civic, Corolla, Model 3"
            required
            mb="md"
            value={carFormData.model}
            onChange={(e) =>
              setCarFormData({ ...carFormData, model: e.target.value })
            }
          />

          <Select
            label="Brand"
            placeholder="Select a brand"
            data={brandSelectData}
            value={carFormData.brand_id.toString()}
            onChange={(val) => {
              if (val) {
                const selectedBrand = brands.find(
                  (b) => b.id.toString() === val
                );
                setCarFormData({
                  ...carFormData,
                  brand_id: parseInt(val),
                  brand_label:
                    selectedBrand?.label || selectedBrand?.name || "",
                });
              }
            }}
            searchable
            required
            mb="md"
          />

          <Group grow mb="md">
            <NumberInput
              label="Year"
              placeholder="Year"
              required
              min={1900}
              max={new Date().getFullYear() + 1}
              value={carFormData.year}
              onChange={(value: string | number) => {
                const numValue =
                  typeof value === "string" ? parseInt(value) : value;
                setCarFormData({
                  ...carFormData,
                  year: isNaN(numValue) ? new Date().getFullYear() : numValue,
                });
              }}
            />

            <NumberInput
              label="Price"
              placeholder="Price"
              required
              min={0}
              value={carFormData.price}
              onChange={(value: string | number) => {
                const numValue =
                  typeof value === "string" ? parseInt(value) : value;
                setCarFormData({
                  ...carFormData,
                  price: isNaN(numValue) ? 0 : numValue,
                });
              }}
            />
          </Group>

          <Group grow mb="md">
            <Select
              label="Transmission"
              placeholder="Select transmission"
              data={[
                { value: "manual", label: "Manual" },
                { value: "automatic", label: "Automatic" },
              ]}
              value={carFormData.transmission || ""}
              onChange={(val) =>
                setCarFormData({ ...carFormData, transmission: val || "" })
              }
            />

            <Select
              label="Fuel Type"
              placeholder="Select fuel type"
              data={[
                { value: "gasoline", label: "Gasoline" },
                { value: "diesel", label: "Diesel" },
                { value: "electric", label: "Electric" },
                { value: "hybrid", label: "Hybrid" },
              ]}
              value={carFormData.fuel_type || ""}
              onChange={(val) =>
                setCarFormData({ ...carFormData, fuel_type: val || "" })
              }
            />

            <NumberInput
              label="Doors"
              placeholder="Number of doors"
              min={1}
              max={10}
              value={carFormData.doors || 4}
              onChange={(value: string | number) => {
                const numValue =
                  typeof value === "string" ? parseInt(value) : value;
                setCarFormData({
                  ...carFormData,
                  doors: isNaN(numValue) ? 4 : numValue,
                });
              }}
            />
          </Group>

          <TextInput
            label="Color"
            placeholder="e.g., Red, Blue, Black"
            required
            mb="md"
            value={carFormData.color || ""}
            onChange={(e) =>
              setCarFormData({ ...carFormData, color: e.target.value })
            }
          />

          <Group grow mb="md">
            <NumberInput
              label="Power (HP)"
              placeholder="Power"
              required
              min={0}
              value={carFormData.power || 0}
              onChange={(value: string | number) => {
                const numValue =
                  typeof value === "string" ? parseInt(value) : value;
                setCarFormData({
                  ...carFormData,
                  power: isNaN(numValue) ? 0 : numValue,
                });
              }}
            />

            <NumberInput
              label="Total Weight (kg)"
              placeholder="Total Weight"
              required
              min={0}
              value={carFormData.total_weight || 0}
              onChange={(value: string | number) => {
                const numValue =
                  typeof value === "string" ? parseInt(value) : value;
                setCarFormData({
                  ...carFormData,
                  total_weight: isNaN(numValue) ? 0 : numValue,
                });
              }}
            />

            <NumberInput
              label="Trunk Capacity (L)"
              placeholder="Trunk Capacity"
              required
              min={0}
              value={carFormData.trunk_capacity || 0}
              onChange={(value: string | number) => {
                const numValue =
                  typeof value === "string" ? parseInt(value) : value;
                setCarFormData({
                  ...carFormData,
                  trunk_capacity: isNaN(numValue) ? 0 : numValue,
                });
              }}
            />
          </Group>

          <Textarea
            label="Description"
            placeholder="Describe the car"
            minRows={3}
            mb="lg"
            value={carFormData.description || ""}
            onChange={(e) =>
              setCarFormData({ ...carFormData, description: e.target.value })
            }
          />

          <Select
            label="Status"
            placeholder="Select status"
            data={[
              { value: "approved", label: "Approved" },
              { value: "not approved", label: "Not Approved" },
            ]}
            value={carFormData.status || "not approved"}
            onChange={(val) =>
              setCarFormData({
                ...carFormData,
                status: (val as "approved" | "not approved") || "not approved",
              })
            }
            mb="md"
          />

          <Group justify="right">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving}>
              Save
            </Button>
          </Group>
        </div>
      </Modal>
    </motion.div>
  );
};

export default CarsAdmin;
