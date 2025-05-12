import { useState, useEffect } from "react";
import {
  Table,
  Group,
  ActionIcon,
  TextInput,
  Title,
  Paper,
  Text,
  Badge,
  Modal,
  Stack,
  LoadingOverlay,
} from "@mantine/core";
import {
  IconThumbUp,
  IconThumbDown,
  IconSearch,
  IconEye,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { Car, carService } from "../../services/api";
import { showNotification } from "@mantine/notifications";

interface Submission {
  id: number;
  car: Car;
  date: string;
  status: "pending" | "approved" | "rejected";
}

const SubmissionsAdmin = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const cars = await carService.getAllCars();
        const notApprovedCars = cars.filter(
          (car) => car.status === "not approved"
        );

        const submissionsData = notApprovedCars.map((car) => ({
          id: car.id,
          car: car,
          date: new Date().toISOString().split("T")[0],
          status: "pending" as const,
        }));

        setSubmissions(submissionsData);
        setError(null);
      } catch (err) {
        setError("Failed to load submissions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleView = (submission: Submission) => {
    setSelectedSubmission(submission);
    setDetailsModalOpen(true);
  };

  const handleApprove = async (submissionId: number) => {
    try {
      const submission = submissions.find((sub) => sub.id === submissionId);
      if (!submission) return;

      await carService.updateCar(submission.car.id, {
        ...submission.car,
        status: "approved",
      });

      setSubmissions(submissions.filter((sub) => sub.id !== submissionId));

      if (selectedSubmission?.id === submissionId) {
        setDetailsModalOpen(false);
      }

      showNotification({
        title: "Success",
        message: "Car has been approved",
        color: "green",
      });
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Failed to approve car",
        color: "red",
      });
    }
  };

  const handleReject = async (submissionId: number) => {
    try {
      const submission = submissions.find((sub) => sub.id === submissionId);
      if (!submission) return;

      await carService.deleteCar(submission.car.id);

      setSubmissions(submissions.filter((sub) => sub.id !== submissionId));

      if (selectedSubmission?.id === submissionId) {
        setDetailsModalOpen(false);
      }

      showNotification({
        title: "Success",
        message: "Car has been rejected and deleted",
        color: "blue",
      });
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Failed to reject car",
        color: "red",
      });
    }
  };

  const filteredSubmissions = submissions.filter((submission) => {
    const modelMatch = submission.car.model
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const brandMatch = (
      submission.car.brand_label?.toLowerCase() || ""
    ).includes(searchQuery.toLowerCase());
    return modelMatch || brandMatch;
  });

  const renderSubmissionTable = (submissions: Submission[]) => (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>ID</Table.Th>
          <Table.Th>Brand</Table.Th>
          <Table.Th>Model</Table.Th>
          <Table.Th>Year</Table.Th>
          <Table.Th>Date</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {submissions.length > 0 ? (
          submissions.map((sub) => (
            <Table.Tr key={sub.id}>
              <Table.Td>{sub.id}</Table.Td>
              <Table.Td>{sub.car.brand_label || "Unknown"}</Table.Td>
              <Table.Td>{sub.car.model}</Table.Td>
              <Table.Td>{sub.car.year}</Table.Td>
              <Table.Td>{sub.date}</Table.Td>
              <Table.Td>
                <Badge color="yellow" variant="light" radius="sm">
                  pending
                </Badge>
              </Table.Td>
              <Table.Td>
                <Group>
                  <ActionIcon
                    variant="light"
                    color="blue"
                    onClick={() => handleView(sub)}
                  >
                    <IconEye size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="light"
                    color="green"
                    onClick={() => handleApprove(sub.id)}
                  >
                    <IconThumbUp size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => handleReject(sub.id)}
                  >
                    <IconThumbDown size={16} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))
        ) : (
          <Table.Tr>
            <Table.Td colSpan={7}>
              <Text ta="center">No submissions found</Text>
            </Table.Td>
          </Table.Tr>
        )}
      </Table.Tbody>
    </Table>
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
        Pending Submissions
      </Title>

      <TextInput
        placeholder="Search by brand or model..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        mb="lg"
        leftSection={<IconSearch size={16} />}
      />

      {error ? (
        <Paper withBorder p="md" radius="md" mb="xl">
          <Text color="red" ta="center">
            {error}
          </Text>
        </Paper>
      ) : (
        <Paper withBorder p="md" radius="md" mb="xl">
          {renderSubmissionTable(filteredSubmissions)}
        </Paper>
      )}

      <Modal
        opened={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title="Submission Details"
        size="lg"
      >
        {selectedSubmission && (
          <Stack>
            <Group justify="apart">
              <Text fw={700}>Submission ID:</Text>
              <Text>{selectedSubmission.id}</Text>
            </Group>
            <Group justify="apart">
              <Text fw={700}>Date:</Text>
              <Text>{selectedSubmission.date}</Text>
            </Group>
            <Group justify="apart">
              <Text fw={700}>Status:</Text>
              <Badge color="yellow" variant="light" radius="sm">
                pending
              </Badge>
            </Group>

            <Text fw={700} mt="md">
              Car Details:
            </Text>
            <Paper withBorder p="md">
              <Group justify="apart">
                <Text fw={700}>Brand:</Text>
                <Text>{selectedSubmission.car.brand_label}</Text>
              </Group>
              <Group justify="apart">
                <Text fw={700}>Model:</Text>
                <Text>{selectedSubmission.car.model}</Text>
              </Group>
              <Group justify="apart">
                <Text fw={700}>Year:</Text>
                <Text>{selectedSubmission.car.year}</Text>
              </Group>
              <Group justify="apart">
                <Text fw={700}>Price:</Text>
                <Text>${selectedSubmission.car.price.toLocaleString()}</Text>
              </Group>
              <Group justify="apart">
                <Text fw={700}>Fuel Type:</Text>
                <Text>{selectedSubmission.car.fuel_type}</Text>
              </Group>
              <Group justify="apart">
                <Text fw={700}>Transmission:</Text>
                <Text>{selectedSubmission.car.transmission}</Text>
              </Group>
              <Group justify="apart">
                <Text fw={700}>Doors:</Text>
                <Text>{selectedSubmission.car.doors}</Text>
              </Group>
              <Text fw={700} mt="md">
                Description:
              </Text>
              <Text>{selectedSubmission.car.description}</Text>
            </Paper>
          </Stack>
        )}
      </Modal>
    </motion.div>
  );
};

export default SubmissionsAdmin;
