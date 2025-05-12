import { Button, Title, Text, Group, Box } from "@mantine/core";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useViewportSize } from "../hooks/useViewportSize";
import LoginPage from "./LoginPage";
import StatBox from "../components/StatBox";
import AuthModal from "../components/AuthModal";
import { showNotification } from "@mantine/notifications";
import RegisterPage from "./RegisterPage";
import { carService, partService, authService } from "../services/api";

const LandingPage = () => {
  const [carCount, setCarCount] = useState<number>(0);
  const [brandCount, setBrandCount] = useState<number>(0);
  const [partCount, setPartCount] = useState<number>(0);
  const { isMobile } = useViewportSize();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"login" | "register">("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

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
    setIsLoggedIn(authService.isAuthenticated());
    authService.initAuth();
  }, []);

  useEffect(() => {
    const checkLoginStatus = () => {
      const isAuth = authService.isAuthenticated();
      if (isAuth) {
        setIsLoggedIn(true);
        setModalOpen(false);
      }
    };

    const interval = setInterval(checkLoginStatus, 1000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const carsData = await carService.getAllCars();
        setCarCount(carsData.length);

        const uniqueBrands = new Set();
        carsData.forEach((car) => {
          if (car.brand_label) {
            uniqueBrands.add(car.brand_label);
          }
        });
        setBrandCount(uniqueBrands.size);

        const partsData = await partService.getAllParts();
        setPartCount(partsData.length);
      } catch (err) {}
    };

    fetchData();
  }, []);

  return (
    <Box className="flex flex-col md:flex-row h-screen w-screen relative overflow-hidden">
      <motion.div
        className="absolute top-4 md:top-8 right-4 md:right-8 flex gap-2 md:gap-3 z-30"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
          delay: 0.3,
        }}
      >
        {isLoggedIn ? (
          <Button
            onClick={handleLogout}
            variant="light"
            size={isMobile ? "sm" : "md"}
            loading={logoutLoading}
          >
            {logoutLoading ? "Logging out" : "Logout"}
          </Button>
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
      </motion.div>

      <Box
        className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center items-start p-6 md:p-12 z-10 relative overflow-hidden"
        style={{
          backgroundColor: "var(--mantine-color-dark-9)",
          boxShadow: "50px 0px 60px 20px rgba(20, 20, 20, 0.8)",
        }}
      >
        <Box
          className="absolute inset-0 w-full h-full opacity-70 mix-blend-overlay"
          style={{
            backgroundImage: "url('/landingPage_left.png')",
            backgroundSize: "40%",
            backgroundPosition: "center",
            backgroundRepeat: "repeat",
          }}
        />

        <motion.div
          className="w-full md:w-[70%] relative z-10"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            delay: 0.2,
          }}
        >
          <Title
            order={isMobile ? 2 : 1}
            className="mb-4 md:mb-6 text-2xl md:text-4xl"
          >
            Welcome to Car Website
          </Title>

          <Text size={isMobile ? "sm" : "lg"} className="mb-4 md:mb-8">
            Discover a world of vehicles and parts at your fingertips. Join us
            in revolutionizing the way you explore, buy, and sell cars and
            components.
          </Text>

          <Group className="mt-4 md:mt-6">
            <Button
              component={Link}
              to="/mainpage"
              size={isMobile ? "sm" : "md"}
              variant="filled"
            >
              Browse Cars
            </Button>
          </Group>
        </motion.div>
      </Box>

      {!isMobile && (
        <motion.div
          className="absolute bottom-8 left-0 w-1/2 px-8 flex flex-row gap-4 z-30"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <StatBox
            label="Cars"
            count={carCount}
            description="Stored vehicles"
          />
          <StatBox
            label="Brands"
            count={brandCount}
            description="Different manufacturers"
            delay={0.3}
          />
          <StatBox
            label="Parts"
            count={partCount}
            description="Different parts"
            delay={0.6}
          />
        </motion.div>
      )}

      {isMobile && (
        <motion.div
          className="absolute bottom-4 left-0 w-full px-4 z-30 grid grid-cols-2 gap-3"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <StatBox
            label="Cars"
            count={carCount}
            description="Stored vehicles"
            compact
          />
          <StatBox
            label="Brands"
            count={brandCount}
            description="Different manufacturers"
            delay={0.3}
            compact
          />
          <StatBox
            label="Parts"
            count={partCount}
            description="Different parts"
            delay={0.6}
            compact
          />
        </motion.div>
      )}

      <Box
        className="hidden md:block absolute h-full bg-red-500"
        style={{
          width: "20%",
          left: "40%",
          zIndex: 15,
          background:
            "linear-gradient( to right, transparent 0%, transparent 35%, rgba(20,20,20, 0.55) 45%, rgba(20,20,20, 0.9) 50%,  rgba(20,20,20, 0.55) 55%, transparent 65%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      <Box
        className="w-full md:w-1/2 h-1/2 md:h-full bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/landingPage_right.png')",
        }}
      >
        <Box
          className="absolute inset-0 w-full h-full"
          style={{ backgroundColor: "rgba(20, 20, 20, 0.7)" }}
        />

        <AuthModal
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          type={modalType}
        >
          {modalType === "login" ? (
            <LoginPage switchToRegister={switchToRegister} />
          ) : (
            <>
              <RegisterPage switchToLogin={switchToLogin} />
            </>
          )}
        </AuthModal>
      </Box>

      {isMobile && (
        <Box
          className="absolute w-full h-[20px]"
          style={{
            top: "calc(50% - 10px)",
            zIndex: 15,
            background:
              "linear-gradient( to bottom, transparent 0%, rgba(20,20,20, 0.7) 50%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
      )}
    </Box>
  );
};

export default LandingPage;
