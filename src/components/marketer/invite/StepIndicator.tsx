import { HStack, Box } from "@chakra-ui/react";

interface StepIndicatorProps {
  current: number;
  total: number;
}

export function StepIndicator({ current, total }: StepIndicatorProps) {
  return (
    <HStack spacing={2}>
      {Array.from({ length: total }).map((_, index) => {
        const step = index + 1;
        const isActive = step === current;
        const isComplete = step < current;
        return (
          <Box
            key={step}
            h="8px"
            w="8px"
            borderRadius="full"
            bg={
              isActive || isComplete
                ? "brand.500"
                : "borderStructural"
            }
            transition="background-color 0.2s ease"
          />
        );
      })}
    </HStack>
  );
}
