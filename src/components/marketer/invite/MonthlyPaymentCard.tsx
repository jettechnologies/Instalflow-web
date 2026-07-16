import { useMemo } from "react";
import { Box, SimpleGrid } from "@chakra-ui/react";
import { monthlyPayment, formatCurrency } from "@utils/misc";
import type { InstallmentPlan, Variant } from "@utils/types/response-type";
import { Stat } from "./Stat";

interface MonthlyPaymentCardProps {
  price: number;
  plan: InstallmentPlan;
  variant?: Variant;
}

export function MonthlyPaymentCard({
  price,
  plan,
  variant,
}: MonthlyPaymentCardProps) {
  const effectivePrice = variant?.price ?? price;
  const monthly = useMemo(
    () =>
      monthlyPayment(
        effectivePrice,
        plan.durationMonths,
        plan.interestPercentage
      ),
    [effectivePrice, plan]
  );

  return (
    <Box
      p={3}
      bg="bgLayer1"
      border="1px solid"
      borderColor="borderStructural"
      borderRadius="md">
      <SimpleGrid columns={2} spacing={3}>
        <Stat label="Monthly" value={formatCurrency(monthly)} accent />
        <Stat label="Tenor" value={`${plan.durationMonths} months`} />
        <Stat label="Interest" value={`${plan.interestPercentage}%`} />
        <Stat label="Total" value={formatCurrency(effectivePrice)} />
      </SimpleGrid>
    </Box>
  );
}
