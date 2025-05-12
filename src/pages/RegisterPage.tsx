import {
  TextInput,
  PasswordInput,
  Button,
  Text,
  Paper,
  Title,
  Container,
} from "@mantine/core";
import { useState } from "react";
import { showNotification } from "@mantine/notifications";
import { authService } from "../services/api";

interface RegisterProps {
  switchToLogin: () => void;
}

const RegisterPage = ({ switchToLogin }: RegisterProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      showNotification({
        title: "Error",
        message: "Password Mismatch",
        color: "teal",
      });
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        name,
        email,
        password,
        password_confirmation: confirmPassword,
      });

      showNotification({
        title: "Success",
        message: "Registration successful! Please login with your credentials.",
        color: "teal",
      });

      switchToLogin();
    } catch (err) {
      showNotification({
        title: "Error",
        message:
          "Registration failed. Please check your information and try again.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" className="font-bold">
        Create an account
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Fill in your details to register
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <TextInput
            label="Email"
            placeholder="your@email.com"
            mt="md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <PasswordInput
            label="Password"
            placeholder="Password"
            mt="md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm password"
            mt="md"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button
            fullWidth
            mt="xl"
            type="submit"
            variant="light"
            loading={loading}
          >
            Register
          </Button>
        </form>
      </Paper>

      <Text ta="center" mt="md">
        Already have an account?{" "}
        <Text
          span
          style={{ cursor: "pointer" }}
          c="violet"
          onClick={switchToLogin}
        >
          Login
        </Text>
      </Text>
    </Container>
  );
};

export default RegisterPage;
