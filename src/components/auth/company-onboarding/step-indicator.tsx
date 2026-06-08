import { CheckCircleIcon, UserIcon, RocketIcon } from "@phosphor-icons/react";
import { Box, HStack, Text, VStack, Flex } from "@chakra-ui/react";
import { Fragment } from "react/jsx-runtime";

const STEPS = [
  { label: "Identity", icon: UserIcon },
  { label: "Plan", icon: RocketIcon },
];

export const StepIndicator = ({ current }: { current: 0 | 1 }) => (
  <HStack spacing={0} mb={8} w="full" maxW="320px" mx="auto">
    {STEPS.map((step, i) => {
      const StepIcon = step.icon;
      const done = i < current;
      const active = i === current;
      return (
        <Fragment key={step.label}>
          <VStack spacing={1} flex={1} align="center">
            <Flex
              w="36px"
              h="36px"
              borderRadius="full"
              align="center"
              justify="center"
              bg={
                done
                  ? "var(--status-success)"
                  : active
                    ? "var(--brand-primary)"
                    : "var(--bg-layer-2)"
              }
              border="2px solid"
              borderColor={
                done
                  ? "var(--status-success)"
                  : active
                    ? "var(--brand-primary)"
                    : "var(--border-structural)"
              }
              transition="all 0.3s">
              {done ? (
                <CheckCircleIcon size={18} color="#fff" weight="fill" />
              ) : (
                <StepIcon
                  size={16}
                  color={active ? "#fff" : "var(--text-muted)"}
                  weight={active ? "fill" : "regular"}
                />
              )}
            </Flex>
            <Text
              fontSize="10px"
              fontWeight={active ? "700" : "400"}
              color={active ? "var(--text-primary)" : "var(--text-muted)"}
              letterSpacing="0.08em"
              textTransform="uppercase">
              {step.label}
            </Text>
          </VStack>
          {i < STEPS.length - 1 && (
            <Box
              flex={2}
              h="2px"
              mb="18px"
              bg={done ? "var(--status-success)" : "var(--border-structural)"}
              transition="background 0.4s"
            />
          )}
        </Fragment>
      );
    })}
  </HStack>
);
