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
import { authService } from "../services/api";

interface LoginProps {
  switchToRegister: () => void;
}

const LoginPage = ({ switchToRegister }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.login({ email, password });

      window.location.reload();
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" className="font-bold">
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Enter your credentials to continue
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            placeholder="yourname@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Text c="red" size="sm" mt="sm">
              {error}
            </Text>
          )}
          <Button
            fullWidth
            mt="xl"
            type="submit"
            variant="light"
            loading={loading}
          >
            Sign in
          </Button>
        </form>
      </Paper>

      <Text ta="center" mt="md">
        Don't have an account?{" "}
        <Text
          span
          style={{ cursor: "pointer" }}
          c="violet"
          onClick={switchToRegister}
        >
          Register
        </Text>
      </Text>
    </Container>
  );
};

export default LoginPage;
