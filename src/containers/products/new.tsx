import { useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { Box, Button, Heading, HStack, VStack } from "@chakra-ui/react";
import {
  getCategoriesQueryOptions,
  getProductDetailsQueryOptions,
  getProductGalleryQueryOptions,
} from "@services/tanstack-queries/catalog";

import { WizardStepper } from "@components/products/wizard-stepper";
import { Step1ProductInfo } from "@components/products/step1-product-info";
import { Step2Gallery } from "@components/products/step2-gallery";
import { Step3Variants } from "@components/products/step3-variants";
import { Step4MediaBinding } from "@components/products/step4-media-binding";
import { Step5Review } from "@components/products/step5-review";
import { MoveLeft } from "lucide-react";
import type { FileRouteTypes } from "src/routeTree.gen";

const WIZARD_STEPS = [
  { num: 1, label: "Product Info" },
  { num: 2, label: "Photo Gallery" },
  { num: 3, label: "Variations" },
  { num: 4, label: "Variant Media" },
  { num: 5, label: "Review & Publish" },
];

interface NewProductContainerProps {
  step: string;
  productId?: string;
}

export function NewProductContainer({
  step,
  productId,
}: NewProductContainerProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const buildUrl = (index: number) => {
    const segments = pathSegments.slice(0, index + 1);
    return `/${segments.join("/")}`;
  };

  const backLink = pathSegments.length > 1 ? buildUrl(1) : null;
  const currentStep = parseInt(step) || 1;

  const { data: categories = [] } = useQuery({
    ...getCategoriesQueryOptions(),
  });
  const { data: product } = useQuery({
    ...getProductDetailsQueryOptions(productId ?? ""),
    enabled: !!productId,
  });
  const { data: gallery = [], isLoading: isLoadingGallery } = useQuery({
    ...getProductGalleryQueryOptions(productId ?? ""),
    enabled: !!productId,
  });

  const goToStep = (targetStep: number, pId = productId) => {
    navigate({
      to: "/company/products/new",
      search: { step: String(targetStep), productId: pId },
    });
  };

  const hasUnmappedVariants = product?.variants?.some(
    (v) => !v.images || v.images.length === 0
  );

  return (
    <VStack align="stretch" spacing={6} pb={12}>
      <HStack spacing="6px">
        <Button
          variant="link"
          onClick={() =>
            navigate({
              to: backLink as FileRouteTypes["to"],
            })
          }>
          <MoveLeft size={18} color="var(--text-secondary)" />
        </Button>
        <Heading size="lg">Create New Product</Heading>
      </HStack>

      <WizardStepper currentStep={currentStep} steps={WIZARD_STEPS} />

      <Box
        bg="bgLayer2"
        border="1px solid"
        borderColor="borderStructural"
        borderRadius="2xl"
        p={6}>
        {currentStep === 1 && (
          <Step1ProductInfo
            categories={categories}
            product={product}
            onComplete={(id) => goToStep(2, id)}
          />
        )}

        {currentStep === 2 && productId && (
          <Step2Gallery
            productId={productId}
            gallery={gallery}
            onNext={() => goToStep(3)}
            onBack={() => goToStep(1)}
          />
        )}

        {currentStep === 3 && productId && (
          <Step3Variants
            productId={productId}
            gallery={gallery}
            product={product}
            onNext={() => {
              if (gallery.length > 0 && hasUnmappedVariants) {
                goToStep(4);
              } else {
                goToStep(5);
              }
            }}
            onBack={() => goToStep(2)}
          />
        )}

        {currentStep === 4 && productId && (
          <Step4MediaBinding
            loading={isLoadingGallery}
            gallery={gallery}
            product={product}
            onNext={() => goToStep(5)}
            onBack={() => goToStep(3)}
          />
        )}

        {currentStep === 5 && productId && (
          <Step5Review
            productId={productId}
            product={product}
            gallery={gallery}
            onBack={() =>
              goToStep(gallery.length > 0 && hasUnmappedVariants ? 4 : 3)
            }
          />
        )}
      </Box>
    </VStack>
  );
}
