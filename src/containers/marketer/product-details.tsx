import { Fragment, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Badge,
  Box,
  Button,
  Divider,
  HStack,
  Heading,
  IconButton,
  Image,
  SimpleGrid,
  Spinner,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import {
  CheckIcon,
  CopySimpleIcon,
  LinkSimpleIcon,
} from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@components/shared/AppShell";
import { getProductDetailsQueryOptions } from "@services/tanstack-queries/catalog";
import { GenerateLinkModal } from "@layouts/modal-layout/generate-link-modal";
import { ngn } from "@utils/misc";
import type { InstallmentPlan, Variant } from "@utils/types/response-type";
import {
  StatCard,
  STOCK_META,
  StockBadge,
  stockLevel,
  type StockLevel,
} from "@components/marketer/products";

function colorKeyOf(v: Variant): string {
  return v.color?.length ? v.color.join(" / ") : "One color";
}

function sizeKeyOf(v: Variant): string {
  return v.size || "One size";
}

export function MarketerProductDetails({ productId }: { productId: string }) {
  const { data: product, isLoading } = useQuery(
    getProductDetailsQueryOptions(productId)
  );
  const modal = useDisclosure();
  const [copied, setCopied] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);

  const selectedVariant = useMemo(
    () =>
      product?.variants.find((v) => v.variantId === selectedVariantId) ??
      product?.variants[0] ??
      null,
    [product, selectedVariantId]
  );

  const gallery = useMemo(() => {
    if (selectedVariant?.images?.length) return selectedVariant.images;
    return [];
  }, [selectedVariant, product]);

  useEffect(() => {
    const primary =
      gallery.find((g) => g.isPrimary)?.image.imageUrl ??
      gallery[0]?.image.imageUrl ??
      null;
    setActiveImageUrl(primary);
  }, [gallery]);

  const { sizes, colorGroups, matrix } = useMemo(() => {
    const sizeSet = new Set<string>();
    const colorSet = new Set<string>();
    const map = new Map<string, Map<string, Variant>>();
    for (const v of product?.variants ?? []) {
      const c = colorKeyOf(v);
      const s = sizeKeyOf(v);
      sizeSet.add(s);
      colorSet.add(c);
      if (!map.has(c)) map.set(c, new Map());
      map.get(c)!.set(s, v);
    }
    return {
      sizes: Array.from(sizeSet),
      colorGroups: Array.from(colorSet),
      matrix: map,
    };
  }, [product?.variants]);

  if (isLoading) {
    return (
      <FlexCenter>
        <Spinner color="brand.400" />
      </FlexCenter>
    );
  }

  if (!product) {
    return (
      <AppShell title="Product not found">
        <VStack align="start" spacing={1} py={10}>
          <Text fontWeight={600}>We couldn't find this product</Text>
          <Text color="textSecondary" fontSize="13px">
            It may have been removed, or the link is out of date.
          </Text>
        </VStack>
      </AppShell>
    );
  }

  const activePlans: InstallmentPlan[] = product.installmentPlans.filter(
    (p) => p.active
  );
  const totalStock = product.variants.reduce((s, v) => s + v.stockQuantity, 0);
  const hasRange =
    product.minPrice != null &&
    product.maxPrice != null &&
    product.minPrice !== product.maxPrice;
  const displayPrice = hasRange
    ? `${ngn(product.minPrice!)} – ${ngn(product.maxPrice!)}`
    : ngn(product.price);
  const selectedPrice = selectedVariant?.price ?? product.price;
  const commissionEarning = (selectedPrice * product.commissionRate) / 100;
  const overallStock = stockLevel(totalStock);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/p/${product.slug}`;
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <AppShell
      title={product.name}
      subtitle="Product details"
      actions={
        <HStack spacing="8px">
          <Tooltip
            label={copied ? "Copied" : "Copy product link"}
            closeOnClick={false}>
            <IconButton
              aria-label="Copy product link"
              icon={
                copied ? (
                  <CheckIcon size={14} weight="bold" />
                ) : (
                  <CopySimpleIcon size={14} />
                )
              }
              variant="outline"
              border="2px solid"
              borderColor="borderStructural"
              color={copied ? "brand.500" : "textSecondary"}
              _hover={{ color: "textSecondary" }}
              onClick={handleCopyLink}
            />
          </Tooltip>
          <Button
            leftIcon={<LinkSimpleIcon size={14} />}
            onClick={modal.onOpen}>
            Generate referral link
          </Button>
        </HStack>
      }>
      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
        <VStack align="stretch" spacing={6} gridColumn={{ lg: "span 2" }}>
          <Box
            bg="bgLayer2"
            border="1px solid"
            borderColor="borderStructural"
            borderRadius="2xl"
            overflow="hidden">
            <Box
              h={{ base: "260px", md: "380px" }}
              bg="bgLayer1"
              position="relative">
              {activeImageUrl ? (
                <Image
                  src={activeImageUrl}
                  alt={product.name}
                  w="full"
                  h="full"
                  objectFit="cover"
                />
              ) : (
                <FlexCenter>
                  <Text
                    fontSize="80px"
                    opacity={0.18}
                    fontWeight={900}
                    color="white">
                    {product.name.charAt(0)}
                  </Text>
                </FlexCenter>
              )}
              {selectedVariant && (
                <Badge
                  position="absolute"
                  top={3}
                  left={3}
                  bg="blackAlpha.700"
                  color="white"
                  borderRadius="full"
                  px={3}
                  py={1}
                  fontSize="10px">
                  {colorKeyOf(selectedVariant)} · {sizeKeyOf(selectedVariant)}
                </Badge>
              )}
            </Box>
            {gallery.length > 1 && (
              <HStack spacing={2} p={3} overflowX="auto">
                {gallery.map((img) => (
                  <Box
                    key={img.imageId}
                    boxSize="56px"
                    flexShrink={0}
                    borderRadius="md"
                    overflow="hidden"
                    cursor="pointer"
                    border="2px solid"
                    borderColor={
                      img.image.imageUrl === activeImageUrl
                        ? "brand.500"
                        : "transparent"
                    }
                    onClick={() => setActiveImageUrl(img.image.imageUrl)}>
                    <Image
                      src={img.image.imageUrl}
                      alt={img.image.altText ?? product.name}
                      w="full"
                      h="full"
                      objectFit="cover"
                    />
                  </Box>
                ))}
              </HStack>
            )}
          </Box>

          <Box
            bg="bgLayer2"
            border="1px solid"
            borderColor="borderStructural"
            borderRadius="2xl"
            p={5}>
            <Heading size="sm" mb={2}>
              Description
            </Heading>
            <Text fontSize="13px" color="textSecondary" lineHeight="1.6">
              {product.description ??
                "No description provided for this product."}
            </Text>
          </Box>

          <Box
            bg="bgLayer2"
            border="1px solid"
            borderColor="borderStructural"
            borderRadius="2xl"
            p={5}>
            <HStack justify="space-between" mb={4}>
              <Heading size="sm">Variants</Heading>
              <HStack spacing={3} fontSize="10px" color="textMuted">
                {(["healthy", "low", "out"] as StockLevel[]).map((lvl) => (
                  <HStack key={lvl} spacing={1}>
                    <Box
                      boxSize="6px"
                      borderRadius="full"
                      bg={STOCK_META[lvl].dot}
                    />
                    <Text>{STOCK_META[lvl].label}</Text>
                  </HStack>
                ))}
              </HStack>
            </HStack>

            {product.variants.length === 0 ? (
              <Text fontSize="13px" color="textMuted">
                No variants configured for this product yet.
              </Text>
            ) : (
              <Box overflowX="auto">
                <Box
                  display="grid"
                  gridTemplateColumns={`140px repeat(${sizes.length}, minmax(64px, 1fr))`}
                  columnGap={2}
                  rowGap={2}
                  minW={`${140 + sizes.length * 70}px`}>
                  <Box />
                  {sizes.map((s) => (
                    <Text
                      key={s}
                      fontSize="10px"
                      fontWeight={700}
                      color="textMuted"
                      textAlign="center"
                      textTransform="uppercase"
                      alignSelf="end"
                      pb={1}>
                      {s}
                    </Text>
                  ))}

                  {colorGroups.map((c) => (
                    <Fragment key={c}>
                      <Text
                        key={`${c}-label`}
                        fontSize="12px"
                        fontWeight={600}
                        color="textSecondary"
                        alignSelf="center"
                        noOfLines={1}>
                        {c}
                      </Text>
                      {sizes.map((s) => {
                        const v = matrix.get(c)?.get(s);
                        if (!v) {
                          return (
                            <Box
                              key={`${c}-${s}`}
                              h="52px"
                              borderRadius="md"
                              bg="bgLayer1"
                              opacity={0.35}
                            />
                          );
                        }
                        const lvl = stockLevel(v.stockQuantity);
                        const isSelected =
                          v.variantId === selectedVariant?.variantId;
                        return (
                          <Tooltip
                            key={v.variantId}
                            label={`${v.sku} · ${v.stockQuantity} in stock`}>
                            <Box
                              as="button"
                              onClick={() => setSelectedVariantId(v.variantId)}
                              h="52px"
                              borderRadius="md"
                              border="1.5px solid"
                              borderColor={
                                isSelected ? "brand.500" : "borderStructural"
                              }
                              bg="bgLayer1"
                              display="flex"
                              flexDir="column"
                              alignItems="center"
                              justifyContent="center"
                              gap={1}
                              transition="all 0.12s ease">
                              <Box
                                boxSize="6px"
                                borderRadius="full"
                                bg={STOCK_META[lvl].dot}
                              />
                              <Text fontSize="10px" fontWeight={600}>
                                {v.stockQuantity}
                              </Text>
                            </Box>
                          </Tooltip>
                        );
                      })}
                    </Fragment>
                  ))}
                </Box>
              </Box>
            )}

            {selectedVariant && (
              <>
                <Divider my={4} borderColor="borderStructural" />
                <HStack justify="space-between" flexWrap="wrap" gap={3}>
                  <Box>
                    <Text fontSize="13px" fontWeight={600}>
                      {colorKeyOf(selectedVariant)} ·{" "}
                      {sizeKeyOf(selectedVariant)}
                    </Text>
                    <Text fontSize="11px" color="textMuted">
                      SKU {selectedVariant.sku} · {ngn(selectedVariant.price)}
                    </Text>
                  </Box>
                  <HStack spacing={2}>
                    {!selectedVariant.isActive && (
                      <Badge colorScheme="gray" fontSize="10px">
                        Inactive
                      </Badge>
                    )}
                    <StockBadge qty={selectedVariant.stockQuantity} />
                  </HStack>
                </HStack>
              </>
            )}
          </Box>
        </VStack>

        <VStack align="stretch" spacing={6}>
          <SimpleGrid columns={2} spacing={3}>
            <StatCard label="Price" value={displayPrice} />
            <StatCard
              label="You earn"
              value={ngn(commissionEarning)}
              hint={`${product.commissionRate}% commission`}
            />
            <StatCard
              label="Total stock"
              value={String(totalStock)}
              accent={STOCK_META[overallStock].color}
            />
            <StatCard
              label="Financing"
              value={activePlans.length ? `${activePlans.length} plans` : "—"}
            />
          </SimpleGrid>

          <Box
            bg="bgLayer2"
            border="1px solid"
            borderColor="borderStructural"
            borderRadius="2xl"
            p={5}>
            <Heading size="sm" mb={4}>
              Installment plans
            </Heading>
            {product.installmentPlans.length === 0 ? (
              <Text fontSize="13px" color="textMuted">
                No installment plans set up for this product.
              </Text>
            ) : (
              <VStack align="stretch" spacing={3}>
                {product.installmentPlans.map((pl) => {
                  const totalOwed =
                    selectedPrice +
                    (selectedPrice * pl.interestPercentage) / 100;
                  const monthly = totalOwed / pl.durationMonths;
                  return (
                    <HStack
                      key={pl.planId}
                      justify="space-between"
                      px={3}
                      py={3}
                      bg="bgLayer1"
                      border="1px solid"
                      borderColor="borderStructural"
                      borderRadius="md"
                      opacity={pl.active ? 1 : 0.55}>
                      <Box>
                        <Text fontSize="13px" fontWeight={600}>
                          {pl.durationMonths} months
                        </Text>
                        <Text fontSize="11px" color="textMuted">
                          {pl.interestPercentage}% interest · ~{ngn(monthly)}/mo
                        </Text>
                      </Box>
                      <Badge
                        colorScheme={pl.active ? "green" : "gray"}
                        borderRadius="full"
                        fontSize="10px">
                        {pl.active ? "Active" : "Inactive"}
                      </Badge>
                    </HStack>
                  );
                })}
              </VStack>
            )}
          </Box>
        </VStack>
      </SimpleGrid>

      <GenerateLinkModal
        product={product}
        isOpen={modal.isOpen}
        onClose={modal.onClose}
      />
    </AppShell>
  );
}

// ---------------------------------------------------------------------------
// small pieces
// ---------------------------------------------------------------------------

function FlexCenter({ children }: { children: ReactNode }) {
  return (
    <HStack justify="center" py={20}>
      {children}
    </HStack>
  );
}

// import { useMemo, useState, type ReactNode } from "react";
// import { Link } from "@tanstack/react-router";
// import {
//   Badge,
//   Box,
//   Button,
//   HStack,
//   Heading,
//   IconButton,
//   Image,
//   SimpleGrid,
//   Spinner,
//   Stat,
//   StatLabel,
//   StatNumber,
//   Text,
//   VStack,
//   useDisclosure,
// } from "@chakra-ui/react";
// import {
//   ArrowLeftIcon,
//   LinkSimpleIcon,
//   WarningIcon,
// } from "@phosphor-icons/react";
// import { useQuery } from "@tanstack/react-query";
// import { AppShell } from "@components/shared/AppShell";
// import { getProductDetailsQueryOptions } from "@services/tanstack-queries/catalog";
// import { GenerateLinkModal } from "@layouts/modal-layout/generate-link-modal";
// import { ngn } from "@utils/misc";
// import type { InstallmentPlan, Variant } from "@utils/types/response-type";

// function variantLabel(v: Variant): string {
//   const parts: string[] = [];
//   if (v.size) parts.push(v.size);
//   if (v.color?.length) parts.push(v.color.join("/"));
//   return parts.length ? parts.join(" · ") : v.sku;
// }

// const STATUS_COLORS: Record<string, string> = {
//   PUBLISHED: "green",
//   DRAFT: "yellow",
//   SOLD_OUT: "red",
//   ARCHIVED: "gray",
// };

// export function MarketerProductDetails({ productId }: { productId: string }) {
//   const { data: product, isLoading } = useQuery(
//     getProductDetailsQueryOptions(productId)
//   );
//   const modal = useDisclosure();
//   const [activeImage, setActiveImage] = useState<string | null>(null);

//   const gallery = useMemo(() => product?.images ?? [], [product]);
//   const heroImage =
//     activeImage ??
//     gallery.find((g) => g.isPrimary)?.imageUrl ??
//     gallery[0]?.imageUrl ??
//     null;

//   if (isLoading) {
//     return (
//       <FlexCenter>
//         <Spinner color="brand.400" />
//       </FlexCenter>
//     );
//   }

//   if (!product) {
//     return (
//       <AppShell title="Product not found">
//         <Text color="textSecondary">This product could not be located.</Text>
//       </AppShell>
//     );
//   }

//   const activePlans: InstallmentPlan[] = product.installmentPlans.filter(
//     (p) => p.active
//   );
//   const totalStock = product.variants.reduce((s, v) => s + v.stockQuantity, 0);

//   return (
//     <AppShell
//       title={product.name}
//       subtitle={product.category?.name ?? "Product details"}>
//       <HStack justify="space-between" flexWrap="wrap" gap={3}>
//         <HStack spacing={3}>
//           <IconButton
//             aria-label="Back to catalog"
//             icon={<ArrowLeftIcon size={16} />}
//             as={Link}
//             to="/marketer/products"
//             variant="ghost"
//           />
//           <Badge colorScheme={STATUS_COLORS[product.status] ?? "gray"}>
//             {product.status}
//           </Badge>
//         </HStack>
//         <Button leftIcon={<LinkSimpleIcon size={14} />} onClick={modal.onOpen}>
//           Generate referral link
//         </Button>
//       </HStack>

//       <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
//         <VStack align="stretch" spacing={6} gridColumn={{ lg: "span 2" }}>
//           <Box
//             bg="bgLayer2"
//             border="1px solid"
//             borderColor="borderStructural"
//             borderRadius="2xl"
//             overflow="hidden">
//             <Box
//               h={{ base: "220px", md: "320px" }}
//               bg="bgLayer1"
//               position="relative">
//               {heroImage ? (
//                 <Image
//                   src={heroImage}
//                   alt={product.name}
//                   w="full"
//                   h="full"
//                   objectFit="cover"
//                 />
//               ) : (
//                 <FlexCenter>
//                   <Text
//                     fontSize="80px"
//                     opacity={0.18}
//                     fontWeight={900}
//                     color="white">
//                     {product.name.charAt(0)}
//                   </Text>
//                 </FlexCenter>
//               )}
//             </Box>
//             {gallery.length > 1 && (
//               <HStack spacing={2} p={3} overflowX="auto">
//                 {gallery.map((img) => (
//                   <Box
//                     key={img.imageId}
//                     boxSize="56px"
//                     borderRadius="md"
//                     overflow="hidden"
//                     cursor="pointer"
//                     border="2px solid"
//                     borderColor={
//                       img.imageUrl === heroImage ? "brand.500" : "transparent"
//                     }
//                     onClick={() => setActiveImage(img.imageUrl)}>
//                     <Image
//                       src={img.imageUrl}
//                       alt={img.altText ?? product.name}
//                       w="full"
//                       h="full"
//                       objectFit="cover"
//                     />
//                   </Box>
//                 ))}
//               </HStack>
//             )}
//           </Box>

//           <Box
//             bg="bgLayer2"
//             border="1px solid"
//             borderColor="borderStructural"
//             borderRadius="2xl"
//             p={5}>
//             <Heading size="sm" mb={2}>
//               Description
//             </Heading>
//             <Text fontSize="13px" color="textSecondary" lineHeight="1.6">
//               {product.description ??
//                 "No description provided for this product."}
//             </Text>
//           </Box>

//           <Box
//             bg="bgLayer2"
//             border="1px solid"
//             borderColor="borderStructural"
//             borderRadius="2xl"
//             p={5}>
//             <Heading size="sm" mb={4}>
//               Variants
//             </Heading>
//             <VStack align="stretch" spacing={2}>
//               {product.variants.map((v) => {
//                 const low = v.stockQuantity <= 5;
//                 return (
//                   <HStack
//                     key={v.variantId}
//                     justify="space-between"
//                     px={3}
//                     py={3}
//                     bg="bgLayer1"
//                     border="1px solid"
//                     borderColor="borderStructural"
//                     borderRadius="md">
//                     <Box>
//                       <Text fontSize="13px" fontWeight={600}>
//                         {variantLabel(v)}
//                       </Text>
//                       <Text fontSize="11px" color="textMuted">
//                         {v.sku} · {ngn(v.price)}
//                       </Text>
//                     </Box>
//                     <HStack spacing={1.5} color={low ? "#F59E0B" : "textMuted"}>
//                       {low ? <WarningIcon size={12} /> : null}
//                       <Text fontSize="11px" fontWeight={600}>
//                         {v.stockQuantity} in stock
//                       </Text>
//                     </HStack>
//                   </HStack>
//                 );
//               })}
//             </VStack>
//           </Box>
//         </VStack>

//         <VStack align="stretch" spacing={6}>
//           <SimpleGrid columns={2} spacing={3}>
//             <StatCard label="Price" value={ngn(product.price)} />
//             <StatCard label="Commission" value={`${product.commissionRate}%`} />
//             <StatCard label="Total stock" value={String(totalStock)} />
//             <StatCard
//               label="Financing"
//               value={activePlans.length ? `${activePlans.length} plans` : "—"}
//             />
//           </SimpleGrid>

//           <Box
//             bg="bgLayer2"
//             border="1px solid"
//             borderColor="borderStructural"
//             borderRadius="2xl"
//             p={5}>
//             <Heading size="sm" mb={4}>
//               Installment plans
//             </Heading>
//             <VStack align="stretch" spacing={3}>
//               {product.installmentPlans.map((pl) => (
//                 <HStack
//                   key={pl.planId}
//                   justify="space-between"
//                   px={3}
//                   py={3}
//                   bg="bgLayer1"
//                   border="1px solid"
//                   borderColor="borderStructural"
//                   borderRadius="md"
//                   opacity={pl.active ? 1 : 0.55}>
//                   <Box>
//                     <Text fontSize="13px" fontWeight={600}>
//                       {pl.durationMonths} months
//                     </Text>
//                     <Text fontSize="11px" color="textMuted">
//                       {pl.interestPercentage}% interest
//                     </Text>
//                   </Box>
//                   <Badge
//                     colorScheme={pl.active ? "green" : "gray"}
//                     borderRadius="full"
//                     fontSize="10px">
//                     {pl.active ? "Active" : "Inactive"}
//                   </Badge>
//                 </HStack>
//               ))}
//             </VStack>
//           </Box>

//           <Button
//             size="lg"
//             leftIcon={<LinkSimpleIcon size={16} />}
//             onClick={modal.onOpen}>
//             Generate referral link
//           </Button>
//         </VStack>
//       </SimpleGrid>

//       <GenerateLinkModal
//         product={product}
//         isOpen={modal.isOpen}
//         onClose={modal.onClose}
//       />
//     </AppShell>
//   );
// }

// function StatCard({ label, value }: { label: string; value: string }) {
//   return (
//     <Stat
//       bg="bgLayer2"
//       border="1px solid"
//       borderColor="borderStructural"
//       borderRadius="2xl"
//       px={4}
//       py={3}>
//       <StatLabel fontSize="11px" color="textMuted" fontWeight={600}>
//         {label.toUpperCase()}
//       </StatLabel>
//       <StatNumber fontSize="18px" letterSpacing="-0.02em">
//         {value}
//       </StatNumber>
//     </Stat>
//   );
// }

// function FlexCenter({ children }: { children: ReactNode }) {
//   return (
//     <HStack justify="center" py={20}>
//       {children}
//     </HStack>
//   );
// }
