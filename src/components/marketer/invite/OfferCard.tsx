import { useMemo } from "react";
import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { monthlyPayment, formatCurrency } from "@utils/misc";
import type {
  InstallmentPlan,
  Product,
  Variant,
} from "@utils/types/response-type";
import { Stat } from "./Stat";

interface OfferCardProps {
  product: Product;
  variantId?: string;
  installmentPlanId?: string;
}

function variantLabel(v: Variant): string {
  const parts: string[] = [];
  if (v.size) parts.push(v.size);
  if (v.color?.length) parts.push(v.color.join("/"));
  return parts.length ? parts.join(" · ") : v.sku;
}

export function OfferCard({
  product,
  variantId,
  installmentPlanId,
}: OfferCardProps) {
  const activeInstallment: InstallmentPlan = useMemo(() => {
    if (!installmentPlanId) {
      return product.installmentPlans[0];
    }

    return (
      product.installmentPlans.find(
        (installment) => installment.planId === installmentPlanId
      ) ?? product.installmentPlans[0]
    );
  }, [product.installmentPlans, installmentPlanId]);

  const variant =
    product.variants.find((v) => v.variantId === variantId) ??
    product.variants[0];
  const plan: InstallmentPlan = activeInstallment;
  const price = variant?.price ?? product.price;
  const monthly = useMemo(
    () => monthlyPayment(price, plan.durationMonths, plan.interestPercentage),
    [price, plan]
  );

  return (
    <Box
      mt={8}
      bg="bgLayer2"
      border="1px solid"
      borderColor="borderStructural"
      p={6}
      borderRadius="2xl">
      <Text
        fontSize="11px"
        color="textMuted"
        fontWeight={600}
        letterSpacing="0.06em">
        YOUR OFFER
      </Text>
      <Heading size="md" mt={2}>
        {product.name}
      </Heading>
      <Text fontSize="12px" color="textSecondary" mt={1}>
        {variant ? variantLabel(variant) : "Standard"}
      </Text>
      <SimpleGrid columns={2} gap={3} mt={4}>
        <Stat label="Price" value={formatCurrency(price)} />
        <Stat label="Monthly" value={formatCurrency(monthly)} accent />
        <Stat label="Tenor" value={`${plan.durationMonths} months`} />
        <Stat label="Interest" value={`${plan.interestPercentage}%`} />
      </SimpleGrid>
    </Box>
  );
}
