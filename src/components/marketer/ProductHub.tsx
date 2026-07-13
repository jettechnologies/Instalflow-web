import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Box,
  SimpleGrid,
  Heading,
  Text,
  Button,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  RadioGroup,
  Radio,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { apiService } from "@services/api-service";
import { getMarketerCatalogQueryOptions } from "@services/queries/catalog";
import type { SystemProductDef } from "@utils/types/response-type";

export default function ProductHub() {
  const [currentPage] = useState<number>(1);
  const [focusedProduct, setFocusedProduct] = useState<SystemProductDef | null>(
    null
  );
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const triggerNotification = useToast();

  const { data: globalCatalogList, isLoading: catalogLoading } = useQuery(
    getMarketerCatalogQueryOptions(currentPage)
  );

  const resolveAffiliateLink = useMutation({
    mutationFn: async () => {
      const payload = {
        productSlug: focusedProduct?.slug || "",
        variantId: selectedVariantId,
      };
      const response = await apiService.post<{ referralLink: string }>(
        "/kyc/referral-link",
        payload
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.referralLink) {
        navigator.clipboard.writeText(data.referralLink);
        triggerNotification({
          title: "Attribution Matrix Bound",
          description:
            "Target affiliate route string committed to system clipboard allocation frames.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
      }
    },
    meta: {
      errorMessage:
        "Asset resolution engine failed to generate targeted reference attribution pathways.",
    },
  });

  const launchLinkConfigurator = (product: SystemProductDef) => {
    setFocusedProduct(product);
    setSelectedVariantId(product.id || "");
    onOpen();
  };

  if (catalogLoading)
    return (
      <Text color="var(--text-muted)" p={6} fontSize="sm">
        Querying active operational marketplace arrays...
      </Text>
    );

  return (
    <Box p={6} bg="var(--bg-layer-1)" minH="70vh">
      <Heading size="md" mb={1} color="var(--text-primary)">
        Partner Asset Discovery Studio
      </Heading>
      <Text fontSize="xs" color="var(--text-secondary)" mb={6}>
        Select marketplace products to provision downstream tracking paths.
      </Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {globalCatalogList?.map((item) => (
          <Box
            key={item.id}
            p={5}
            bg="var(--bg-layer-2)"
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="var(--border-structural)"
            display="flex"
            flexDirection="column"
            justifyContent="space-between">
            <Box>
              <Image
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=60"
                alt={item.name}
                borderRadius="xl"
                mb={4}
                objectFit="cover"
                w="full"
                h="160px"
              />
              <Heading
                size="xs"
                color="var(--text-primary)"
                mb={2}
                noOfLines={2}
                minH="32px">
                {item.name}
              </Heading>
              <Text
                fontSize="sm"
                color="var(--brand-primary)"
                fontWeight="700"
                mb={2}>
                Baseline Valuation: ₦{item.basePrice.toLocaleString()}
              </Text>
              <Text fontSize="11px" color="var(--text-secondary)">
                Affiliate Secondary Capture Percentage: {item.commissionRate}%
              </Text>
            </Box>
            <Button
              mt={5}
              size="sm"
              h="36px"
              borderRadius="xl"
              bgGradient="var(--brand-gradient)"
              color="var(--text-primary)"
              _hover={{ opacity: 0.9 }}
              onClick={() => launchLinkConfigurator(item)}>
              Configure Allocation Tracking
            </Button>
          </Box>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent
          bg="var(--bg-layer-2)"
          borderColor="var(--border-structural)"
          borderWidth="1px"
          borderRadius="2xl">
          <ModalHeader
            color="var(--text-primary)"
            fontSize="sm"
            borderBottomWidth="1px"
            borderColor="var(--border-structural)">
            Select System Variation Parameters
          </ModalHeader>
          <ModalCloseButton color="var(--text-secondary)" />
          <ModalBody py={6}>
            <Text fontSize="xs" color="var(--text-secondary)" mb={4}>
              Choose a variation matrix mapping context parameters to track
              attribution properly:
            </Text>
            <RadioGroup
              onChange={setSelectedVariantId}
              value={selectedVariantId}>
              <VStack align="stretch" spacing={3}>
                <Radio
                  value="8c9f294b-8e85-4797-bdf5-6d0a3ecaa25c"
                  colorScheme="purple">
                  <Text fontSize="xs" color="var(--text-primary)">
                    Enterprise Allocation Tier - Matte Gray 512GB
                  </Text>
                </Radio>
                <Radio
                  value="9c9f294b-8e85-4797-bdf5-6d0a3ecaa25d"
                  colorScheme="purple">
                  <Text fontSize="xs" color="var(--text-primary)">
                    Standard Deployment Tier - Ceramic White 256GB
                  </Text>
                </Radio>
              </VStack>
            </RadioGroup>
            <Button
              mt={6}
              w="full"
              h="40px"
              borderRadius="xl"
              bgGradient="var(--brand-gradient)"
              color="var(--text-primary)"
              _hover={{ opacity: 0.9 }}
              isLoading={resolveAffiliateLink.isPending}
              onClick={() => resolveAffiliateLink.mutate()}>
              Commit Asset Routing Link
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
