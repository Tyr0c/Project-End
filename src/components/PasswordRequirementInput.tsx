import {
  PasswordInput,
  Progress,
  Text,
  Popover,
  Box,
  Group,
} from "@mantine/core";
import { IconX, IconCheck } from "@tabler/icons-react";
import { useState } from "react";

interface PasswordRequirementProps {
  meets: boolean;
  label: string;
}

function PasswordRequirement({ meets, label }: PasswordRequirementProps) {
  return (
    <Text
      c={meets ? "teal" : "red"}
      style={{ display: "flex", alignItems: "center" }}
      mt={7}
      size="sm"
    >
      {meets ? <IconCheck size={14} /> : <IconX size={14} />}
      <Box ml={10}>{label}</Box>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: "Includes number" },
  { re: /[a-z]/, label: "Includes lowercase letter" },
  { re: /[A-Z]/, label: "Includes uppercase letter" },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
];

function getStrength(password: string) {
  if (password.length === 0) {
    return 0;
  }

  let count = 0;
  if (password.length > 5) count++;
  requirements.forEach((requirement) => {
    if (requirement.re.test(password)) {
      count++;
    }
  });

  return (count / (requirements.length + 1)) * 100;
}

interface PasswordRequirementInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  styles?: any;
  showRequirements?: boolean;
  error?: string;
}

export function PasswordRequirementInput({
  value,
  onChange,
  label = "Password",
  placeholder = "Password",
  styles,
  showRequirements = true,
  error,
}: PasswordRequirementInputProps) {
  const [popoverOpened, setPopoverOpened] = useState(false);
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(value)}
    />
  ));

  const strength = getStrength(value);

  const PasswordInputComponent = (
    <PasswordInput
      styles={styles}
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.currentTarget.value)}
      error={error}
    />
  );

  if (!showRequirements) {
    return PasswordInputComponent;
  }

  return (
    <Popover
      opened={popoverOpened}
      position="bottom"
      width="target"
      transitionProps={{ transition: "pop" }}
    >
      <Popover.Target>
        <div
          onFocusCapture={() => setPopoverOpened(true)}
          onBlurCapture={() => setPopoverOpened(false)}
        >
          {PasswordInputComponent}
        </div>
      </Popover.Target>
      <Popover.Dropdown>
        <Group grow gap={5}>
          <Progress
            size="xs"
            color={strength > 0 ? "purple" : "gray"}
            value={100}
          />
          <Progress
            size="xs"
            color={strength >= 25 ? "purple" : "gray"}
            value={100}
          />
          <Progress
            size="xs"
            color={strength >= 50 ? "purple" : "gray"}
            value={100}
          />
          <Progress
            size="xs"
            color={strength >= 75 ? "purple" : "gray"}
            value={100}
          />
          <Progress
            size="xs"
            color={strength === 100 ? "purple" : "gray"}
            value={100}
          />
        </Group>
        <PasswordRequirement
          label="Includes at least 6 characters"
          meets={value.length > 5}
        />
        {checks}
      </Popover.Dropdown>
    </Popover>
  );
}
