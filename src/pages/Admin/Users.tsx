import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Group,
  ActionIcon,
  TextInput,
  Title,
  Paper,
  Text,
  Badge,
  Modal,
  Select,
  LoadingOverlay,
} from "@mantine/core";
import { IconEdit, IconTrash, IconSearch } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { User, userService } from "../../services/api";
import { showNotification } from "@mantine/notifications";

interface AdminUser extends User {
  isAdmin: boolean;
  role: string;
}

const UsersAdmin = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await userService.getAllUsers();
        const formattedUsers = data.map((user) => ({
          ...user,
          isAdmin: user.isAdmin || false,
          role: user.role || (user.isAdmin ? "Admin" : "User"),
        }));
        setUsers(formattedUsers as AdminUser[]);
        setError(null);
      } catch (err) {
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user: AdminUser) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setUserToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete === null) return;

    try {
      setLoading(true);
      await userService.deleteUser(userToDelete);
      setUsers(users.filter((user) => user.id !== userToDelete));
      showNotification({
        title: "Success",
        message: "User deleted successfully",
        color: "green",
      });
    } catch (err) {
      showNotification({
        title: "Error",
        message: "Failed to delete user",
        color: "red",
      });
    } finally {
      setLoading(false);
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleSave = async () => {
    if (!selectedUser) return;

    try {
      setSaving(true);

      const userData = {
        name: selectedUser.name,
        role: selectedUser.role,
        isAdmin: selectedUser.role?.toLowerCase() === "admin",
      };

      const updatedUser = await userService.updateUser(
        selectedUser.id,
        userData
      );

      setUsers(
        users.map((user) => {
          if (user.id === selectedUser.id) {
            return {
              ...user,
              ...updatedUser,
              name: selectedUser.name,
              email: user.email,
              role: selectedUser.role,
              isAdmin: selectedUser.role?.toLowerCase() === "admin",
            };
          }
          return user;
        })
      );

      showNotification({
        title: "Success",
        message: "User updated successfully",
        color: "green",
      });

      setModalOpen(false);
    } catch (err) {
      showNotification({
        title: "Error",
        message: "Failed to update user",
        color: "red",
      });
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesName =
      user.name &&
      typeof user.name === "string" &&
      user.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesEmail =
      user.email &&
      typeof user.email === "string" &&
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      user.role &&
      typeof user.role === "string" &&
      user.role.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesName || matchesEmail || matchesRole;
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
        Users Management
      </Title>

      <Paper withBorder p="md" radius="md" mb="xl">
        <TextInput
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          mb="md"
          leftSection={<IconSearch size={16} />}
        />

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
                <Table.Th>Email</Table.Th>
                <Table.Th>Role</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <Table.Tr key={user.id}>
                    <Table.Td>{user.id}</Table.Td>
                    <Table.Td>{user.name}</Table.Td>
                    <Table.Td>{user.email}</Table.Td>
                    <Table.Td>
                      <Badge
                        color={user.role === "admin" ? "violet" : "blue"}
                        variant="light"
                        radius="sm"
                      >
                        {user.role}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group>
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => handleEdit(user)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="light"
                          color="red"
                          onClick={() => handleDeleteClick(user.id)}
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
                    <Text ta="center">No users found</Text>
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
        title="Confirm Deletion"
        size="sm"
      >
        <Text mb="lg">
          Are you sure you want to delete this user? This action cannot be
          undone.
        </Text>
        <Group justify="right">
          <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDeleteConfirm}>
            Delete User
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit User"
      >
        <div style={{ position: "relative" }}>
          <LoadingOverlay visible={saving} />

          {selectedUser && (
            <>
              <TextInput
                label="Name"
                value={selectedUser.name}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, name: e.target.value })
                }
                mb="md"
              />
              <TextInput
                label="Email"
                value={selectedUser.email}
                readOnly
                mb="md"
                description="Email cannot be changed"
                style={{ color: "var(--mantine-color-gray-6)" }}
              />
              <Group justify="apart" mb="xl">
                <Text>Role</Text>
                <Select
                  label="Select Role"
                  placeholder="Select role"
                  value={selectedUser.role}
                  data={[
                    { value: "admin", label: "Admin" },
                    { value: "user", label: "User" },
                  ]}
                  onChange={(value) => {
                    if (value) {
                      setSelectedUser({
                        ...selectedUser,
                        role: value,
                        isAdmin: value.toLowerCase() === "admin",
                      });
                    }
                  }}
                  style={{ width: "180px" }}
                />
              </Group>
              <Group justify="right">
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} loading={saving}>
                  Save Changes
                </Button>
              </Group>
            </>
          )}
        </div>
      </Modal>
    </motion.div>
  );
};

export default UsersAdmin;
