// ─────────────────────────────────────────────────────────────────────────────
// WizardStepper — progress HUD shown across all 5 creation steps
// ─────────────────────────────────────────────────────────────────────────────
import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import { CheckIcon } from "@phosphor-icons/react";

export interface WizardStep {
  num: number;
  label: string;
}

interface WizardStepperProps {
  currentStep: number;
  steps: WizardStep[];
}

export function WizardStepper({ currentStep, steps }: WizardStepperProps) {
  return (
    <HStack
      bg="bgLayer2"
      border="1px solid"
      borderColor="borderStructural"
      borderRadius="2xl"
      p={5}
      justify="space-between"
      spacing={4}
    >
      {steps.map((s, i) => (
        <HStack key={s.num} flex={1} justify="center" spacing={3}>
          <Flex
            w="32px"
            h="32px"
            borderRadius="full"
            align="center"
            justify="center"
            fontSize="sm"
            fontWeight="bold"
            bg={
              currentStep === s.num
                ? "brand.500"
                : currentStep > s.num
                  ? "statusSuccess"
                  : "bgLayer1"
            }
            color="textPrimary"
            border="1px solid"
            borderColor={currentStep >= s.num ? "transparent" : "borderStructural"}
            transition="all 0.2s ease"
          >
            {currentStep > s.num ? <CheckIcon size={16} /> : s.num}
          </Flex>
          <Text
            fontSize="xs"
            fontWeight="600"
            color={currentStep === s.num ? "textPrimary" : "textSecondary"}
            display={{ base: "none", md: "block" }}
          >
            {s.label}
          </Text>
          {i < steps.length - 1 && (
            <Box
              h="1px"
              bg={currentStep > s.num ? "statusSuccess" : "borderStructural"}
              flex={1}
              mx={2}
              display={{ base: "none", lg: "block" }}
              transition="background 0.3s ease"
            />
          )}
        </HStack>
      ))}
    </HStack>
  );
}
