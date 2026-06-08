import type { BillingCycle, SubscriptionPlan } from "@utils/types";
import {
  Badge,
  Box,
  Flex,
  HStack,
  Text,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { CheckCircle, Crown, Lightning, Rocket } from "@phosphor-icons/react";

const CYCLE_ICONS: Record<BillingCycle, React.ReactNode> = {
  WEEKLY: <Lightning size={14} weight="fill" color="var(--status-warning)" />,
  MONTHLY: <Rocket size={14} weight="fill" color="var(--brand-primary)" />,
  YEARLY: <Crown size={14} weight="fill" color="var(--status-success)" />,
};

export const PlanCard = ({
  plan,
  selected,
  onSelect,
}: {
  plan: SubscriptionPlan;
  selected: boolean;
  onSelect: (id: string) => void;
}) => {
  const savings = plan.discountPrice
    ? Math.round(((plan.basePrice - plan.discountPrice) / plan.basePrice) * 100)
    : 0;

  return (
    <Box
      as="button"
      type="button"
      onClick={() => onSelect(plan.id)}
      w="full"
      textAlign="left"
      p={5}
      borderRadius="16px"
      border="2px solid"
      borderColor={
        selected ? "var(--brand-primary)" : "var(--border-structural)"
      }
      bg={selected ? "rgba(124, 58, 237, 0.08)" : "var(--bg-layer-2)"}
      position="relative"
      transition="all 0.2s"
      _hover={{
        borderColor: "var(--brand-primary)",
        bg: "rgba(124, 58, 237, 0.05)",
      }}
      cursor="pointer">
      {plan.isPopular && (
        <Badge
          position="absolute"
          top="-11px"
          left="50%"
          transform="translateX(-50%)"
          bg="var(--brand-gradient)"
          color="white"
          fontSize="9px"
          fontWeight="700"
          letterSpacing="0.1em"
          px={3}
          py={1}
          borderRadius="full"
          textTransform="uppercase">
          Most Popular
        </Badge>
      )}

      <HStack justify="space-between" mb={3}>
        <HStack spacing={2}>
          {CYCLE_ICONS[plan.billingCycle]}
          <Text fontSize="sm" fontWeight="700" color="var(--text-primary)">
            {plan.name}
          </Text>
        </HStack>
        {savings > 0 && (
          <Badge
            bg="rgba(16,185,129,0.12)"
            color="var(--status-success)"
            fontSize="9px"
            fontWeight="700"
            borderRadius="full"
            px={2}>
            {savings}% OFF
          </Badge>
        )}
      </HStack>

      <HStack align="baseline" spacing={1} mb={1}>
        {plan.discountPrice && (
          <Text
            fontSize="xs"
            color="var(--text-muted)"
            textDecoration="line-through">
            ₦{plan.basePrice.toLocaleString()}
          </Text>
        )}
        <Text
          fontSize="xl"
          fontWeight="800"
          color={selected ? "var(--brand-primary)" : "var(--text-primary)"}>
          ₦{(plan.discountPrice ?? plan.basePrice).toLocaleString()}
        </Text>
        <Text fontSize="xs" color="var(--text-muted)">
          /{plan.billingCycle.toLowerCase()}
        </Text>
      </HStack>

      <Text fontSize="xs" color="var(--text-secondary)" mb={3} lineHeight="1.5">
        {plan.description}
      </Text>

      <Divider borderColor="var(--border-structural)" mb={3} />

      <VStack align="stretch" spacing={1}>
        {plan.features.slice(0, 4).map((f) => (
          <HStack key={f} spacing={2}>
            <CheckCircle
              size={12}
              color="var(--status-success)"
              weight="fill"
            />
            <Text fontSize="11px" color="var(--text-secondary)">
              {f}
            </Text>
          </HStack>
        ))}
        {plan.features.length > 4 && (
          <Text fontSize="10px" color="var(--text-muted)">
            +{plan.features.length - 4} more features
          </Text>
        )}
      </VStack>

      {selected && (
        <Flex
          position="absolute"
          top={3}
          right={3}
          w="20px"
          h="20px"
          borderRadius="full"
          bg="var(--brand-primary)"
          align="center"
          justify="center">
          <CheckCircle size={12} color="#fff" weight="fill" />
        </Flex>
      )}
    </Box>
  );
};
