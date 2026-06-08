import { Box, Flex, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { LightningIcon } from "@phosphor-icons/react";
import { StepIndicator } from "@components/auth/company-onboarding";

interface LeftPanelProps {
  step: 0 | 1;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  showSteps?: boolean;
}

export const LeftPanel = ({
  step,
  title,
  subtitle,
  children,
  showSteps = false,
}: LeftPanelProps) => (
  <Flex
    direction="column"
    align="center"
    justify="center"
    h="full"
    px={{ base: 6, md: 12 }}
    py={10}
    overflowY="auto">
    <Box w="full" maxW="480px">
      <HStack mb={8} spacing={2}>
        <Flex
          w="36px"
          h="36px"
          borderRadius="10px"
          background="var(--brand-gradient)"
          align="center"
          justify="center">
          <LightningIcon size={18} color="#fff" weight="fill" />
        </Flex>
        <Text
          fontWeight="800"
          fontSize="lg"
          color="var(--text-primary)"
          letterSpacing="-0.02em">
          InstalFlow
        </Text>
      </HStack>

      {showSteps && <StepIndicator current={step} />}

      <VStack align="stretch" spacing={1} mb={6}>
        <Heading
          size="lg"
          color="var(--text-primary)"
          fontWeight="800"
          letterSpacing="-0.02em">
          {title}
        </Heading>
        <Text fontSize="sm" color="var(--text-secondary)">
          {subtitle}
        </Text>
      </VStack>

      {children}
    </Box>
  </Flex>
);
