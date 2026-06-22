import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
  useClipboard,
} from "@chakra-ui/react";
import { CheckCircle, Copy } from "lucide-react";

export interface UserInfo {
  name: string;
  email: string;
  tempPassword: string;
  instruction: string;
}

interface Props {
  user: UserInfo;
  role?: string;
  onContinue?: () => void;
}

export const UserSuccessScreen = ({ user, role, onContinue }: Props) => {
  const credentials = `
        Name: ${user.name}
        Email: ${user.email}
        Temporary Password: ${user.tempPassword}
    `;

  const { onCopy, hasCopied } = useClipboard(credentials);

  return (
    <Flex justify="center" align="center" py={8}>
      <Box
        w="full"
        maxW="600px"
        bg="bgLayer2"
        border="1px solid"
        borderColor="borderStructural"
        borderRadius="2xl"
        p={8}>
        <Stack spacing={6}>
          <Flex direction="column" align="center" textAlign="center" gap={3}>
            <Box bg="rgba(16,185,129,0.15)" p={4} borderRadius="full">
              <CheckCircle size={40} color="#10B981" />
            </Box>

            <Heading size="md" color="textPrimary" textTransform="capitalize">
              {role} Created Successfully
            </Heading>

            <Text color="textSecondary">
              The {role} account has been created and login credentials
              generated.
            </Text>
          </Flex>

          <Divider borderColor="borderStructural" />

          <Stack spacing={4}>
            <InfoRow label="Full Name" value={user.name} />

            <InfoRow label="Email Address" value={user.email} />

            <Box>
              <Text fontSize="sm" color="textSecondary" mb={2}>
                Temporary Password
              </Text>

              <Flex
                align="center"
                justify="space-between"
                bg="bgLayer1"
                border="1px solid"
                borderColor="borderStructural"
                borderRadius="xl"
                p={4}>
                <Text fontFamily="mono" color="brand.300" fontWeight="600">
                  {user.tempPassword}
                </Text>

                <IconButton
                  aria-label="Copy password"
                  icon={<Copy size={16} />}
                  size="sm"
                  variant="ghost"
                  onClick={onCopy}
                />
              </Flex>

              {hasCopied && (
                <Text mt={2} fontSize="xs" color="statusSuccess">
                  Credentials copied successfully
                </Text>
              )}
            </Box>
          </Stack>

          <Alert
            status="info"
            borderRadius="xl"
            bg="rgba(6,182,212,0.08)"
            border="1px solid"
            borderColor="statusInfo">
            <AlertIcon />
            <Text fontSize="sm" color="textPrimary">
              {user.instruction}
            </Text>
          </Alert>

          <Button w="full" variant="gradient" onClick={onContinue}>
            Continue
          </Button>
        </Stack>
      </Box>
    </Flex>
  );
};

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow = ({ label, value }: InfoRowProps) => {
  return (
    <Box>
      <Text fontSize="sm" color="textSecondary" mb={1}>
        {label}
      </Text>

      <Text color="textPrimary" fontWeight="500">
        {value}
      </Text>
    </Box>
  );
};
