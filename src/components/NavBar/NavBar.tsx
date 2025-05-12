import {
  Badge,
  Button,
  Modal,
  TextInput,
  Select,
  NumberInput,
  Textarea,
  Group,
  LoadingOverlay,
} from "@mantine/core";
import { useViewportSize } from "../../hooks/useViewportSize";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "../AuthModal";
import LoginPage from "../../pages/LoginPage";
import RegisterPage from "../../pages/RegisterPage";
import { showNotification } from "@mantine/notifications";
import { authService, brandService, carService } from "../../services/api";
import { IconPlus, IconSend, IconLogout } from "@tabler/icons-react";
import { motion } from "framer-motion";

interface NavbarProps {
  sidebarButton?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ sidebarButton }) => {
  const { isMobile, isTablet } = useViewportSize();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"login" | "register">("login");
  const [isAdmin, setIsAdmin] = useState(false);
  const [carSubmitModalOpen, setCarSubmitModalOpen] = useState(false);
  const [carFormData, setCarFormData] = useState({
    model: "",
    brand_id: "",
    year: new Date().getFullYear(),
    price: 0,
    transmission: "",
    fuel_type: "",
    doors: 4,
    description: "",
    color: "",
    power: 0,
    total_weight: 0,
    trunk_capacity: 0,
    status: "not approved" as const,
  });
  const [brandOptions, setBrandOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [submitting, setSubmitting] = useState(false);

  const showIconsOnly = isMobile || isTablet;

  useEffect(() => {
    setIsLoggedIn(authService.isAuthenticated());
    setIsAdmin(authService.isAdmin());
    authService.initAuth();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandsData = await brandService.getAllBrands();
        const options = brandsData.map((brand) => ({
          value: brand.id.toString(),
          label: brand.name || brand.label,
        }));
        setBrandOptions(options);
      } catch (error) {}
    };

    fetchBrands();
  }, []);

  const openLoginModal = () => {
    setModalType("login");
    setModalOpen(true);
  };

  const openRegisterModal = () => {
    setModalType("register");
    setModalOpen(true);
  };

  const switchToLogin = () => {
    setModalType("login");
  };

  const switchToRegister = () => {
    setModalType("register");
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await authService.logout();
      setIsLoggedIn(false);

      showNotification({
        title: "Success",
        message: "Successfully logged out",
        color: "teal",
      });
    } catch (err) {
      showNotification({
        title: "Error",
        message: "Failed to log out",
        color: "red",
      });
    } finally {
      setLogoutLoading(false);
    }
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      const isAuth = authService.isAuthenticated();
      const adminStatus = authService.isAdmin();

      setIsLoggedIn(isAuth);
      setIsAdmin(adminStatus);

      if (isAuth) {
        setModalOpen(false);
      }
    };

    checkLoginStatus();

    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(checkLoginStatus, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleCarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      showNotification({
        title: "Authentication Required",
        message: "Please log in to submit a car",
        color: "red",
      });
      setCarSubmitModalOpen(false);
      openLoginModal();
      return;
    }

    try {
      setSubmitting(true);

      if (
        !carFormData.model ||
        !carFormData.brand_id ||
        !carFormData.year ||
        !carFormData.price
      ) {
        showNotification({
          title: "Missing Information",
          message: "Please fill out all required fields",
          color: "orange",
        });
        return;
      }

      const selectedBrand = brandOptions.find(
        (b) => b.value === carFormData.brand_id
      );
      const brand_label = selectedBrand?.label || "";

      const carSubmission = {
        ...carFormData,
        brand_id: parseInt(carFormData.brand_id),
        brand_label,
        status: "not approved" as const,
      };

      await carService.createCar(carSubmission);

      showNotification({
        title: "Car Submission Received",
        message: "Thank you for your submission. We'll review it shortly.",
        color: "teal",
      });

      setCarFormData({
        model: "",
        brand_id: "",
        year: new Date().getFullYear(),
        price: 0,
        transmission: "",
        fuel_type: "",
        doors: 4,
        description: "",
        color: "",
        power: 0,
        total_weight: 0,
        trunk_capacity: 0,
        status: "not approved" as const,
      });

      setCarSubmitModalOpen(false);
    } catch (error) {
      showNotification({
        title: "Submission Failed",
        message: "There was an error submitting your car. Please try again.",
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const goToAdminPanel = () => {
    if (!isLoggedIn) {
      showNotification({
        title: "Access Denied",
        message: "You must be logged in to access the admin panel",
        color: "red",
      });
      openLoginModal();
      return;
    }

    if (!isAdmin) {
      showNotification({
        title: "Access Denied",
        message: "You need administrator privileges to access this area",
        color: "red",
      });
      return;
    }

    navigate("/admin");
  };

  return (
    <div
      className="w-full h-[5rem] flex justify-between"
      style={{
        backgroundColor: "var(--mantine-color-dark-6)",
        borderBottom: "1px solid var(--mantine-color-dark-4)",
      }}
    >
      <div className="flex items-center pl-4">
        {sidebarButton}

        {isAdmin ? (
          <h1
            className="text-xl font-bold cursor-pointer hover:opacity-80 transition-opacity"
            onClick={goToAdminPanel}
          >
            <Badge variant="light" size="xl" radius="md">
              Car Website
            </Badge>
          </h1>
        ) : (
          <h1 className="text-xl font-bold">
            <Badge variant="light" size="xl" radius="md">
              Car Website
            </Badge>
          </h1>
        )}
      </div>
      <div className="flex items-center pr-4 gap-2">
        {isLoggedIn ? (
          <>
            <Button
              onClick={() => setCarSubmitModalOpen(true)}
              variant="light"
              size={showIconsOnly ? "sm" : "md"}
            >
              {showIconsOnly ? (
                <IconPlus size={16} />
              ) : (
                <>
                  <IconPlus size={16} /> Add Car
                </>
              )}
            </Button>

            <Button
              onClick={handleLogout}
              variant="light"
              color="violet"
              size={showIconsOnly ? "sm" : "md"}
              loading={logoutLoading}
            >
              {showIconsOnly ? (
                <IconLogout size={16} />
              ) : (
                <>
                  {logoutLoading ? (
                    "Logging out"
                  ) : (
                    <>
                      <IconLogout size={16} />
                    </>
                  )}
                </>
              )}
              {showIconsOnly ? "" : logoutLoading ? "Logging out" : "Logout"}
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={openLoginModal}
              variant="transparent"
              size={isMobile ? "sm" : "md"}
            >
              Login
            </Button>
            <Button
              onClick={openRegisterModal}
              variant="outline"
              size={isMobile ? "sm" : "md"}
            >
              Register
            </Button>
          </>
        )}
      </div>

      <AuthModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
      >
        {modalType === "login" ? (
          <LoginPage switchToRegister={switchToRegister} />
        ) : (
          <RegisterPage switchToLogin={switchToLogin} />
        )}
      </AuthModal>

      <Modal
        opened={carSubmitModalOpen}
        onClose={() => setCarSubmitModalOpen(false)}
        title="Submit a Car"
        centered
        size="lg"
        styles={{
          title: { fontWeight: 700 },
          body: { fontWeight: 500 },
        }}
      >
        <form onSubmit={handleCarSubmit}>
          <div style={{ position: "relative" }}>
            <LoadingOverlay visible={submitting} />

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
              required
              mb="md"
              data={brandOptions}
              value={carFormData.brand_id}
              onChange={(val) =>
                setCarFormData({ ...carFormData, brand_id: val || "" })
              }
              searchable
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
                value={carFormData.transmission}
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
                value={carFormData.fuel_type}
                onChange={(val) =>
                  setCarFormData({ ...carFormData, fuel_type: val || "" })
                }
              />

              <NumberInput
                label="Doors"
                placeholder="Number of doors"
                min={1}
                max={10}
                value={carFormData.doors}
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
              mb="md"
              value={carFormData.color}
              onChange={(e) =>
                setCarFormData({ ...carFormData, color: e.target.value })
              }
            />

            <Group grow mb="md">
              <NumberInput
                label="Power (HP)"
                placeholder="Engine power"
                min={0}
                value={carFormData.power}
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
                placeholder="Vehicle weight"
                min={0}
                value={carFormData.total_weight}
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
                placeholder="Trunk capacity"
                min={0}
                value={carFormData.trunk_capacity}
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
              value={carFormData.description}
              onChange={(e) =>
                setCarFormData({ ...carFormData, description: e.target.value })
              }
            />

            <Group justify="right">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="light"
                  type="submit"
                  leftSection={<IconSend size={16} />}
                  loading={submitting}
                >
                  {submitting ? "Submitting..." : "Submit for Approval"}
                </Button>
              </motion.div>
            </Group>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Navbar;
