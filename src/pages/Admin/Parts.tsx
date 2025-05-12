import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Group,
  ActionIcon,
  TextInput,
  Modal,
  NumberInput,
  Textarea,
  Title,
  Paper,
  Text,
  LoadingOverlay,
} from "@mantine/core";
import {
  IconEdit,
  IconTrash,
  IconSearch,
  IconPlus,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { CarPart, partService } from "../../services/api";
import { showNotification } from "@mantine/notifications";

const PartsAdmin = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<CarPart | null>(null);
  const [parts, setParts] = useState<CarPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [partToDelete, setPartToDelete] = useState<string | null>(null);

  const [partFormData, setPartFormData] = useState<CarPart>({
    id: 0,
    name: "",
    car_model: "",
    price: 0,
    description: "",
  });

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

  const handleEdit = (part: CarPart) => {
    setSelectedPart(part);
    setPartFormData({
      id: part.id,
      name: part.name,
      car_model: part.car_model,
      price: part.price,
      description: part.description,
      image: part.image,
    });
    setModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedPart(null);
    setPartFormData({
      id: 0,
      name: "",
      car_model: "",
      price: 0,
      description: "",
    });
    setModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setPartToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!partToDelete) return;

    try {
      setLoading(true);
      await partService.deletePart(partToDelete);
      setParts(parts.filter((part) => part.id.toString() !== partToDelete));

      showNotification({
        title: "Success",
        message: "Part deleted successfully",
        color: "green",
      });
    } catch (err) {
      showNotification({
        title: "Error",
        message: "Failed to delete part",
        color: "red",
      });
    } finally {
      setLoading(false);
      setDeleteModalOpen(false);
      setPartToDelete(null);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (selectedPart) {
        await partService.updatePart(selectedPart.id.toString(), partFormData);
      } else {
        await partService.createPart(partFormData);
      }

      const refreshedData = await partService.getAllParts();
      setParts(refreshedData);

      showNotification({
        title: "Success",
        message: selectedPart
          ? "Part updated successfully"
          : "Part added successfully",
        color: "green",
      });
      setModalOpen(false);
    } catch (err) {
      showNotification({
        title: "Error",
        message: "Failed to save part",
        color: "red",
      });
    } finally {
      setSaving(false);
    }
  };

  const filteredParts = parts.filter((part) =>
    part.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ position: "relative" }}
    >
      <LoadingOverlay visible={loading} />
      <Title order={2} mb="md">
        Car Parts Management
      </Title>
      <Paper withBorder p="md" radius="md" mb="xl">
        <Group justify="space-between" mb="md">
          <TextInput
            placeholder="Search parts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "250px" }}
            leftSection={<IconSearch size={16} />}
          />
          <Button leftSection={<IconPlus size={16} />} onClick={handleAdd}>
            Add Part
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
                <Table.Th>Name</Table.Th>
                <Table.Th>Category</Table.Th>
                <Table.Th>Price</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredParts.length > 0 ? (
                filteredParts.map((part) => (
                  <Table.Tr key={part.id}>
                    <Table.Td>{part.id}</Table.Td>
                    <Table.Td>{part.name}</Table.Td>
                    <Table.Td>{part.car_model}</Table.Td>
                    <Table.Td>${part.price.toLocaleString()}</Table.Td>
                    <Table.Td>
                      <Group>
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => handleEdit(part)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="light"
                          color="red"
                          onClick={() => handleDeleteClick(part.id.toString())}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <Text ta="center">No parts found</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        )}
      </Paper>{" "}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedPart ? "Edit Part" : "Add New Part"}
        size="lg"
      >
        <div style={{ position: "relative" }}>
          <LoadingOverlay visible={saving} />

          <TextInput
            label="Name"
            placeholder="e.g., Brake Pad, Air Filter"
            required
            mb="md"
            value={partFormData.name}
            onChange={(e) =>
              setPartFormData({ ...partFormData, name: e.target.value })
            }
          />

          <TextInput
            label="Compatible Car Model"
            placeholder="e.g., Honda Civic, Toyota Camry"
            required
            mb="md"
            value={partFormData.car_model}
            onChange={(e) =>
              setPartFormData({ ...partFormData, car_model: e.target.value })
            }
          />

          <NumberInput
            label="Price"
            placeholder="Price"
            required
            min={0}
            mb="md"
            value={partFormData.price}
            onChange={(value: string | number) => {
              const numValue =
                typeof value === "string" ? parseInt(value) : value;
              setPartFormData({
                ...partFormData,
                price: isNaN(numValue) ? 0 : numValue,
              });
            }}
          />

          <Textarea
            label="Description"
            placeholder="Describe the part"
            minRows={3}
            mb="lg"
            value={partFormData.description}
            onChange={(e) =>
              setPartFormData({ ...partFormData, description: e.target.value })
            }
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
      </Modal>{" "}
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
          Are you sure you want to delete this part? This action cannot be
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
    </motion.div>
  );
};

export default PartsAdmin;
