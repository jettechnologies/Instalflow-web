import { useQuery } from "@tanstack/react-query";
import type { BillingCycle } from "@utils/types";
import { useState, useEffect } from "react";
import {
  VStack,
  HStack,
  Box,
  Button,
  Spinner,
  Flex,
  GridItem,
  Grid,
  Text,
  Badge,
} from "@chakra-ui/react";
import { getSubscriptionPlansOptions } from "@services/tanstack-queries";
import { PlanCard } from "./plan-card";
import { useInitializeSubscriptionOnboarding } from "@services/tanstack-mutations";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";

const CYCLE_TABS: { label: string; value: BillingCycle }[] = [
  { label: "Weekly", value: "WEEKLY" },
  { label: "Monthly", value: "MONTHLY" },
  { label: "Yearly", value: "YEARLY" },
];

interface Step2Props {
  intentId: string;
  onBack: () => void;
}

export const Step2Plans = ({ intentId, onBack }: Step2Props) => {
  const [cycle, setCycle] = useState<BillingCycle>("MONTHLY");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const { data: allPlans, isLoading } = useQuery({
    ...getSubscriptionPlansOptions(),
    select: (data) => data,
  });

  const visiblePlans = allPlans?.filter((p) => p.billingCycle === cycle) || [];

  useEffect(() => {
    setSelectedPlanId(visiblePlans?.[0]?.id ?? null);
  }, [cycle, allPlans]);

  const { mutateAsync: checkoutMutation, isPending: checkoutLoading } =
    useInitializeSubscriptionOnboarding();

  return (
    <VStack spacing={6} align="stretch" w="full">
      {/* Billing cycle toggle */}
      <Box
        bg="var(--bg-layer-2)"
        borderRadius="12px"
        p={1}
        border="1px solid var(--border-structural)"
        display="inline-flex"
        alignSelf="center">
        <HStack spacing={0}>
          {CYCLE_TABS.map((tab) => (
            <Button
              key={tab.value}
              size="sm"
              h="34px"
              px={5}
              borderRadius="10px"
              fontSize="xs"
              fontWeight={cycle === tab.value ? "700" : "500"}
              bg={cycle === tab.value ? "var(--brand-primary)" : "transparent"}
              color={cycle === tab.value ? "white" : "var(--text-secondary)"}
              _hover={{
                bg:
                  cycle === tab.value
                    ? "var(--brand-primary)"
                    : "rgba(255,255,255,0.04)",
              }}
              onClick={() => setCycle(tab.value)}
              transition="all 0.2s">
              {tab.label}
              {tab.value === "YEARLY" && (
                <Badge
                  ml={1}
                  bg="rgba(16,185,129,0.2)"
                  color="var(--status-success)"
                  fontSize="8px"
                  borderRadius="full"
                  px={1}>
                  Save
                </Badge>
              )}
            </Button>
          ))}
        </HStack>
      </Box>

      {/* Plan grid */}
      {isLoading ? (
        <Flex justify="center" py={10}>
          <Spinner color="var(--brand-primary)" />
        </Flex>
      ) : visiblePlans.length === 0 ? (
        <Text color="var(--text-muted)" textAlign="center" py={8} fontSize="sm">
          No plans available for this billing cycle.
        </Text>
      ) : (
        <Grid
          templateColumns={{
            base: "1fr",
            md: `repeat(${Math.min(visiblePlans.length, 3)}, 1fr)`,
          }}
          gap={4}>
          {visiblePlans.map((plan) => (
            <GridItem key={plan.id}>
              <PlanCard
                plan={plan}
                selected={selectedPlanId === plan.id}
                onSelect={setSelectedPlanId}
              />
            </GridItem>
          ))}
        </Grid>
      )}

      {/* Actions */}
      <HStack spacing={3} mt={2}>
        <Button
          variant="ghost"
          h="50px"
          borderRadius="12px"
          color="var(--text-secondary)"
          border="1px solid var(--border-structural)"
          _hover={{ bg: "var(--bg-layer-2)", color: "var(--text-primary)" }}
          onClick={onBack}
          leftIcon={<ArrowLeftIcon size={16} />}
          flex={1}>
          Back
        </Button>
        <Button
          h="50px"
          borderRadius="12px"
          background="var(--brand-gradient)"
          color="white"
          fontSize="sm"
          fontWeight="700"
          _hover={{ opacity: 0.9 }}
          _active={{ opacity: 0.85 }}
          onClick={() =>
            checkoutMutation({ intentId, planId: selectedPlanId! })
          }
          isLoading={checkoutLoading}
          isDisabled={!selectedPlanId}
          rightIcon={<ArrowRightIcon size={18} />}
          flex={3}>
          Proceed to Payment
        </Button>
      </HStack>
    </VStack>
  );
};
