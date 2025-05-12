import {
  AppShell,
  Group,
  Button,
  Title,
  NavLink,
  ScrollArea,
} from "@mantine/core";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  IconDashboard,
  IconCar,
  IconUsers,
  IconComponents,
  IconClipboardCheck,
  IconLogout,
  IconHome,
} from "@tabler/icons-react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", icon: <IconDashboard size={20} />, path: "/admin" },
    { label: "Cars", icon: <IconCar size={20} />, path: "/admin/cars" },
    { label: "Users", icon: <IconUsers size={20} />, path: "/admin/users" },
    {
      label: "Car Parts",
      icon: <IconComponents size={20} />,
      path: "/admin/parts",
    },
    {
      label: "Submissions",
      icon: <IconClipboardCheck size={20} />,
      path: "/admin/submissions",
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppShell
      padding="md"
      navbar={{
        width: 260,
        breakpoint: "sm",
      }}
      header={{ height: 60 }}
    >
      <AppShell.Header>
        <Group justify="space-between" h="100%" px="md">
          <Title order={3}>Admin Dashboard</Title>
          <Group>
            <Button
              variant="outline"
              size="sm"
              leftSection={<IconHome size={16} />}
              onClick={() => navigate("/")}
            >
              Back to Site
            </Button>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <ScrollArea scrollbarSize={6}>
          <div style={{ paddingBottom: "1rem" }}>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                label={item.label}
                leftSection={item.icon}
                active={isActive(item.path)}
                onClick={() => navigate(item.path)}
                variant="filled"
                style={{ marginBottom: 8 }}
              />
            ))}
          </div>
        </ScrollArea>
        <div>
          <Button
            fullWidth
            variant="light"
            color="red"
            leftSection={<IconLogout size={16} />}
            onClick={() => navigate("/")}
          >
            Exit Admin
          </Button>
        </div>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default AdminLayout;
