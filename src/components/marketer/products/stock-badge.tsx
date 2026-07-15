import { PackageIcon, ProhibitIcon, WarningIcon } from "@phosphor-icons/react";
import { HStack, Text } from "@chakra-ui/react";

export type StockLevel = "out" | "low" | "healthy";

export function stockLevel(qty: number): StockLevel {
  if (qty <= 0) return "out";
  if (qty <= 5) return "low";
  return "healthy";
}

export const STOCK_META: Record<
  StockLevel,
  { color: string; dot: string; label: string }
> = {
  out: { color: "#EF4444", dot: "#EF4444", label: "Out of stock" },
  low: { color: "#F59E0B", dot: "#F59E0B", label: "Low stock" },
  healthy: { color: "#22C55E", dot: "#22C55E", label: "In stock" },
};

export function StockBadge({ qty }: { qty: number }) {
  const lvl = stockLevel(qty);
  const meta = STOCK_META[lvl];
  const Icon =
    lvl === "out" ? ProhibitIcon : lvl === "low" ? WarningIcon : PackageIcon;
  return (
    <HStack
      spacing={1.5}
      px={2.5}
      py={1}
      borderRadius="full"
      bg={`${meta.color}1A`}
      color={meta.color}>
      <Icon size={12} weight="bold" />
      <Text fontSize="11px" fontWeight={600}>
        {lvl === "out" ? "Out of stock" : `${qty} in stock`}
      </Text>
    </HStack>
  );
}
