import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { PlusIcon } from "@phosphor-icons/react";
import { useToggleInstallmentPlanStatus } from "@services/tanstack-mutations/catalog";
import type { Product } from "@utils/types/response-type";

interface ProductPlansSidebarProps {
  product: Product;
  onAddPlan: () => void;
}

export function ProductPlansSidebar({
  product,
  onAddPlan,
}: ProductPlansSidebarProps) {
  const togglePlanMutation = useToggleInstallmentPlanStatus(
    product.productId,
    ""
  );

  const hasVariants = (product.variants?.length ?? 0) > 0;
  const basePrice = hasVariants
    ? (product.variants?.[0]?.price ?? product.price)
    : product.price;

  return (
    <Box
      bg="bgLayer2"
      border="1px solid"
      borderColor="borderStructural"
      borderRadius="2xl"
      p={5}>
      <Flex justify="space-between" align="center" mb={3}>
        <Heading size="xs">Installment Options</Heading>
        <IconButton
          aria-label="Add installment plan"
          icon={<PlusIcon size={14} />}
          size="xs"
          onClick={onAddPlan}
        />
      </Flex>

      <VStack align="stretch" spacing={3}>
        {product.installmentPlans?.map((plan) => {
          const totalCost =
            basePrice + basePrice * (plan.interestPercentage / 100);
          const monthly = totalCost / plan.durationMonths;

          return (
            <Box
              key={plan.planId}
              bg="bgLayer1"
              p={3}
              borderRadius="xl"
              border="1px solid"
              borderColor="borderStructural">
              <Flex justify="space-between" align="center" mb={2}>
                <Text fontSize="xs" fontWeight="bold">
                  {plan.durationMonths} Months Plan
                </Text>
                <Button
                  size="xs"
                  colorScheme={plan.active ? "green" : "gray"}
                  onClick={async () => {
                    try {
                      await togglePlanMutation.mutateAsync(!plan.active);
                    } catch (_) {}
                  }}
                  isLoading={togglePlanMutation.isPending}>
                  {plan.active ? "Active" : "Disabled"}
                </Button>
              </Flex>
              <SimpleGrid
                columns={2}
                spacing={2}
                borderTop="1px solid"
                borderColor="borderStructural"
                pt={2}>
                <Box>
                  <Text fontSize="9px" color="textMuted">
                    INTEREST RATE
                  </Text>
                  <Text fontSize="xs" fontWeight="bold">
                    {plan.interestPercentage}%
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="9px" color="textMuted">
                    EST. COST / MO
                  </Text>
                  <Text fontSize="xs" fontWeight="bold" color="brand.500">
                    ₦{Math.round(monthly).toLocaleString()}
                  </Text>
                </Box>
              </SimpleGrid>
            </Box>
          );
        })}

        {!product.installmentPlans?.length && (
          <Text fontSize="xs" color="textMuted" textAlign="center" py={4}>
            No financing plans configured.
          </Text>
        )}
      </VStack>
    </Box>
  );
}
