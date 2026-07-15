import type { Variant } from "@utils/types/response-type";
import { AlertTriangle } from "lucide-react";
import { Box, HStack, Radio, Text } from "@chakra-ui/react";
import { formatCurrency } from "@utils/misc";

export function variantLabel(v: Variant): string {
  const parts: string[] = [];
  if (v.size) parts.push(v.size);
  if (v.color?.length) parts.push(v.color.join("/"));
  return parts.length ? parts.join(" · ") : v.sku;
}

export function VariantRow({
  variant,
  basePrice,
}: {
  variant: Variant;
  basePrice: number;
}) {
  const low = variant.stockQuantity <= 5;
  const price = variant.price ?? basePrice;
  return (
    <Box
      px={3.5}
      py={3}
      border="1px solid"
      borderColor="borderStructural"
      borderRadius="md"
      _hover={{ borderColor: "rgba(124,58,237,0.4)" }}>
      <Radio value={variant.variantId} colorScheme="purple" w="full">
        <HStack w="full" justify="space-between" pl={1}>
          <Box>
            <Text fontSize="13px" fontWeight={600}>
              {variantLabel(variant)}
            </Text>
            <Text fontSize="11px" color="textMuted">
              {formatCurrency(price)}
            </Text>
          </Box>
          <HStack spacing={1.5} color={low ? "#F59E0B" : "textMuted"}>
            {low ? <AlertTriangle size={11} /> : null}
            <Text fontSize="11px" fontWeight={600}>
              Stock: {variant.stockQuantity}
            </Text>
          </HStack>
        </HStack>
      </Radio>
    </Box>
  );
}
