import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { formatCurrency } from "@utils/misc";
import type { Product } from "@utils/types/response-type";
import { AlertTriangle, Link2 } from "lucide-react";
import { Badge, Box, Button, HStack, IconButton, Text } from "@chakra-ui/react";

export function ProductCard({
  product,
  onGetLink,
  onViewDetails,
}: {
  product: Product;
  onGetLink: () => void;
  onViewDetails: () => void;
}) {
  const totalStock = product.variants.reduce((s, v) => s + v.stockQuantity, 0);
  const low = totalStock <= 5;
  const primaryImage =
    product.images?.find((g) => g.isPrimary)?.imageUrl ??
    product.images[0]?.imageUrl;
  const firstPlan =
    product.installmentPlans.find((p) => p.active) ??
    product.installmentPlans[0];

  return (
    <Box
      bg="bgLayer2"
      border="1px solid"
      borderColor="borderStructural"
      borderRadius="2xl"
      overflow="hidden"
      transition="all .15s ease"
      _hover={{
        borderColor: "rgba(124,58,237,0.45)",
        transform: "translateY(-2px)",
      }}>
      <Box
        h="140px"
        bg={primaryImage ? "transparent" : "brand.900"}
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center">
        {primaryImage ? (
          <Box
            position="absolute"
            inset={0}
            bgImage={`url(${primaryImage})`}
            bgSize="cover"
            bgPosition="center"
          />
        ) : (
          <Text fontSize="56px" opacity={0.18} fontWeight={900} color="white">
            {product.name.charAt(0)}
          </Text>
        )}
        <Text
          fontSize="11px"
          fontFamily="mono"
          color="rgba(255,255,255,0.7)"
          position="absolute"
          top={3}
          left={3}>
          {product.variants[0]?.sku ?? product.slug}
        </Text>
        <Badge
          position="absolute"
          top={3}
          right={3}
          bg="rgba(15,23,42,0.5)"
          color="white"
          px={2}
          py={1}
          borderRadius="full"
          fontSize="10px"
          fontWeight={700}
          letterSpacing="0.04em">
          {(product.category?.name ?? "GENERAL").toUpperCase()}
        </Badge>
      </Box>
      <Box p={4}>
        <Text fontSize="14px" fontWeight={700} noOfLines={2} minH="40px">
          {product.name}
        </Text>
        <HStack mt={2} justify="space-between" align="end">
          <Box>
            <Text
              fontSize="10px"
              color="textMuted"
              fontWeight={600}
              letterSpacing="0.05em">
              PRICE
            </Text>
            <Text fontSize="18px" fontWeight={800} letterSpacing="-0.02em">
              {formatCurrency(product.price)}
            </Text>
          </Box>
          <Box textAlign="right">
            <Text
              fontSize="10px"
              color="textMuted"
              fontWeight={600}
              letterSpacing="0.05em">
              COMMISSION
            </Text>
            <Text fontSize="14px" fontWeight={700} color="#34D399">
              {product.commissionRate}%
            </Text>
          </Box>
        </HStack>
        <HStack
          mt={3}
          fontSize="11px"
          color="textMuted"
          justify="space-between">
          <Text>
            {firstPlan
              ? `${firstPlan.durationMonths} months · ${firstPlan.interestPercentage}% APR`
              : "Financing available"}
          </Text>
          <HStack spacing={1} color={low ? "#F59E0B" : "textMuted"}>
            {low ? <AlertTriangle size={11} /> : null}
            <Text>{totalStock} in stock</Text>
          </HStack>
        </HStack>
        <HStack mt={4} spacing={2}>
          <Button flex={1} leftIcon={<Link2 size={14} />} onClick={onGetLink}>
            Get link
          </Button>
          <IconButton
            aria-label="View details"
            variant="ghostOutline"
            onClick={onViewDetails}
            icon={<ArrowUpRightIcon size={14} />}
          />
        </HStack>
      </Box>
    </Box>
  );
}
