import { Flex, HStack, Box, Heading, Text, VStack } from "@chakra-ui/react";
import { formatCurrency } from "@utils/misc";
import { Shield } from "lucide-react";

export function ProductGroupHeader({
  productName,
  productImage,
  totalFinanced,
  contractStatus,
  installmentCount,
  paidCount,
}: {
  productName: string;
  productImage: string | null;
  totalFinanced: string;
  contractStatus: string;
  installmentCount: number;
  paidCount: number;
}) {
  const progressPct =
    installmentCount > 0 ? Math.round((paidCount / installmentCount) * 100) : 0;

  return (
    <Flex
      px={5}
      py={4}
      borderBottom="1px solid"
      borderColor="borderStructural"
      align="center"
      gap={4}
      direction={{ base: "column", md: "row" }}>
      <HStack spacing={4} align="center">
        <Box
          w="56px"
          h="56px"
          borderRadius="lg"
          overflow="hidden"
          bg="bgLayer1"
          border="1px solid"
          borderColor="borderStructural"
          flexShrink={0}>
          {productImage ? (
            <img
              src={productImage}
              alt={productName}
              className="w-full h-full object-cover"
            />
          ) : (
            <Flex
              w="full"
              h="full"
              align="center"
              justify="center"
              color="textMuted">
              <Shield size={20} />
            </Flex>
          )}
        </Box>
        <Box minW={0}>
          <Heading size="sm" color="textPrimary" noOfLines={1}>
            {productName}
          </Heading>
          <Text fontSize="12px" color="textMuted">
            Total financed · {formatCurrency(Number(totalFinanced))} ·{" "}
            {contractStatus}
          </Text>
        </Box>
      </HStack>
      <Box flex={1} />
      <VStack align="flex-end" spacing={1}>
        <Text fontSize="12px" color="textMuted">
          {paidCount}/{installmentCount} installments paid
        </Text>
        <Box
          w="120px"
          h="6px"
          bg="bgLayer1"
          borderRadius="full"
          overflow="hidden">
          <Box
            w={`${progressPct}%`}
            h="full"
            bgGradient="linear-gradient(90deg, #1E3A8A 0%, #7C3AED 100%)"
          />
        </Box>
      </VStack>
    </Flex>
  );
}
