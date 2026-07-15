import { useState } from "react";
import {
  Box,
  Button,
  HStack,
  IconButton,
  RadioGroup,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Check, Copy, Link2, MessageCircle, Send } from "lucide-react";
import { useGenerateReferralLink } from "@services/tanstack-mutations/mutations";
import { useToastContext } from "@hooks/context";
import { ngn, monthlyPayment } from "@utils/misc";
import type {
  InstallmentPlan,
  Product,
  Variant,
} from "@utils/types/response-type";
import {
  variantLabel,
  VariantRow,
} from "@components/marketer/products/variant-row";
import { ModalLayout } from "@layouts/modal-layout/modal";
import { OptionalSelectField } from "@components/forms/select";

interface GenerateLinkModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export function GenerateLinkModal({
  product,
  isOpen,
  onClose,
  onCreated,
}: GenerateLinkModalProps) {
  const { openToast } = useToastContext();
  const mutation = useGenerateReferralLink();

  const [variantId, setVariantId] = useState<string>("");
  const [planId, setPlanId] = useState<string>("");
  const [generated, setGenerated] = useState<{
    url: string;
    code: string;
  } | null>(null);

  if (!product) return null;

  const reset = () => {
    setVariantId("");
    setPlanId("");
    setGenerated(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const activePlans: InstallmentPlan[] =
    product.installmentPlans.filter((p) => p.active) ?? [];

  const selected: Variant =
    product.variants.find((v) => v.variantId === variantId) ??
    product.variants[0]!;
  const effectivePrice = selected?.price ?? product.price;

  const selectedPlan: InstallmentPlan | undefined =
    activePlans.find((p) => p.planId === planId) ?? activePlans[0];
  const tenor =
    selectedPlan?.durationMonths ??
    product.installmentPlans[0]?.durationMonths ??
    0;
  const rate =
    selectedPlan?.interestPercentage ??
    product.installmentPlans[0]?.interestPercentage ??
    0;

  const mpay = monthlyPayment(effectivePrice, tenor, rate);
  const expectedCommission = Math.round(
    (effectivePrice * product.commissionRate) / 100
  );

  const handleGenerate = async () => {
    try {
      const response = await mutation.mutateAsync({
        productSlug: product.slug,
        variantId: selected?.variantId,
        planId: selectedPlan?.planId,
      });

      const link = response.data;

      setGenerated({ url: link.referralLink, code: link.referralCode });
      onCreated?.();
      try {
        await navigator.clipboard.writeText(link.referralLink);
        openToast("Link copied to clipboard", "success");
      } catch {
        openToast("Link generated", "success");
      }
    } catch {
      /* error surfaced by mutation meta */
    }
  };

  const share = (channel: "whatsapp" | "sms") => {
    if (!generated) return;
    const text = encodeURIComponent(
      `Finance ${product.name} (${selected ? variantLabel(selected) : ""}) on Instalflow — ${ngn(
        mpay
      )}/mo for ${tenor} months. ${generated.url}`
    );
    const href =
      channel === "whatsapp"
        ? `https://wa.me/?text=${text}`
        : `sms:?body=${text}`;
    window.open(href, "_blank");
  };

  const copyUrl = async () => {
    if (!generated) return;
    try {
      await navigator.clipboard.writeText(generated.url);
      openToast("Copied", "success");
    } catch {
      openToast("Copy failed", "error");
    }
  };

  const footer = generated ? (
    <HStack w="full" justify="flex-end" spacing={3}>
      <Button variant="ghostOutline" type="button" onClick={reset}>
        Generate another
      </Button>
      <Button onClick={handleClose} width="200px">
        Done
      </Button>
    </HStack>
  ) : (
    <HStack w="full" justify="flex-end" spacing={3}>
      <Button variant="ghostOutline" type="button" onClick={handleClose}>
        Cancel
      </Button>
      <Button
        isLoading={mutation.isPending}
        leftIcon={<Link2 size={14} />}
        onClick={handleGenerate}>
        Generate &amp; copy link
      </Button>
    </HStack>
  );

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      title={product.name}
      subTitle="Generate a referral link for this product"
      modalFooter={footer}>
      {generated ? (
        <VStack align="stretch" spacing={4}>
          <HStack
            p={3}
            bg="rgba(16,185,129,0.08)"
            border="1px solid"
            borderColor="rgba(16,185,129,0.25)"
            borderRadius="md"
            spacing={2}>
            <Check size={16} color="#10B981" />
            <Text fontSize="13px" color="#34D399" fontWeight={600}>
              Link ready — copied to clipboard
            </Text>
          </HStack>

          <Box>
            <Text
              fontSize="11px"
              color="textMuted"
              fontWeight={600}
              letterSpacing="0.05em"
              mb={1.5}>
              REFERRAL URL
            </Text>
            <HStack
              px={3}
              py={2.5}
              bg="bgLayer1"
              border="1px solid"
              borderColor="borderStructural"
              borderRadius="md"
              spacing={3}>
              <Text
                flex={1}
                fontFamily="mono"
                fontSize="12px"
                color="textSecondary"
                noOfLines={1}>
                {generated.url}
              </Text>
              <IconButton
                aria-label="Copy"
                size="sm"
                variant="ghost"
                color="textSecondary"
                _hover={{ color: "textPrimary" }}
                icon={<Copy size={14} />}
                onClick={copyUrl}
              />
            </HStack>
          </Box>

          <HStack spacing={3}>
            <Button
              flex={1}
              variant="ghostOutline"
              leftIcon={<MessageCircle size={14} />}
              onClick={() => share("whatsapp")}>
              WhatsApp
            </Button>
            <Button
              flex={1}
              variant="ghostOutline"
              leftIcon={<Send size={14} />}
              onClick={() => share("sms")}>
              SMS
            </Button>
          </HStack>
        </VStack>
      ) : (
        <VStack align="stretch" spacing={5}>
          <Box>
            <Text
              fontSize="11px"
              color="textMuted"
              fontWeight={600}
              letterSpacing="0.05em"
              mb={2}>
              SELECT A VARIANT
            </Text>
            <RadioGroup
              value={selected?.variantId ?? ""}
              onChange={(id) => setVariantId(id)}>
              <VStack align="stretch" spacing={2}>
                {product.variants.map((v) => (
                  <VariantRow
                    key={v.variantId}
                    variant={v}
                    basePrice={product.price}
                  />
                ))}
              </VStack>
            </RadioGroup>
          </Box>

          <Box>
            <Text
              fontSize="11px"
              color="textMuted"
              fontWeight={600}
              letterSpacing="0.05em"
              mb={2}>
              SELECT AN INSTALLMENT PLAN
            </Text>
            <OptionalSelectField
              options={activePlans.map((plan) => ({
                value: plan.planId,
                label: `${plan.durationMonths} months · ${plan.interestPercentage}% interest`,
              }))}
              onChange={(option: any) => {
                setPlanId(option?.value);
              }}
              width="100%"
              height="44px"
            />
          </Box>

          <Box
            p={4}
            bg="bgLayer1"
            border="1px solid"
            borderColor="borderStructural"
            borderRadius="md">
            <Text
              fontSize="11px"
              color="textMuted"
              fontWeight={600}
              letterSpacing="0.05em"
              mb={2}>
              INSTALLMENT PREVIEW ({tenor} months @ {rate}%)
            </Text>
            <SimpleGrid columns={3} spacing={3}>
              <Box>
                <Text fontSize="11px" color="textMuted">
                  Total financed
                </Text>
                <Text fontSize="14px" fontWeight={700}>
                  {ngn(effectivePrice * (1 + rate / 100))}
                </Text>
              </Box>
              <Box>
                <Text fontSize="11px" color="textMuted">
                  Monthly
                </Text>
                <Text fontSize="14px" fontWeight={700} color="#A78BFA">
                  {ngn(mpay)}
                </Text>
              </Box>
              <Box>
                <Text fontSize="11px" color="textMuted">
                  Your commission
                </Text>
                <Text fontSize="14px" fontWeight={700} color="#34D399">
                  {ngn(expectedCommission)}
                </Text>
              </Box>
            </SimpleGrid>
          </Box>
        </VStack>
      )}
    </ModalLayout>
  );
}
