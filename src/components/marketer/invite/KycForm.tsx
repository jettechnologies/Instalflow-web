import { useState } from "react";
import { Formik, Form } from "formik";
import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { kycSchema, type KycFormValues } from "@utils/schema/invite";
import { UploadBankStatement } from "./UploadBankStatement";
import { MonthlyPaymentCard } from "./MonthlyPaymentCard";
import { InputField } from "@components/forms/input-field";
import { SelectField, type Option } from "@components/forms/select";
import { formatCurrency } from "@utils/misc";
import type { IdType } from "@utils/types/invite";
import type { Product } from "@utils/types/response-type";

interface KycFormProps {
  product: Product;
  defaultVariantId?: string;
  defaultInstallmentId?: string;
  isSubmitting: boolean;
  onSubmit: (values: KycFormValues, file: File | null) => void;
  onBack: () => void;
}

const ID_TYPE_OPTIONS: Option[] = [
  { label: "BVN", value: "BVN" },
  { label: "NIN", value: "NIN" },
  { label: "Passport", value: "PASSPORT" },
];

function variantLabel(v: Product["variants"][number]): string {
  const parts: string[] = [];
  if (v.size) parts.push(v.size);
  if (v.color?.length) parts.push(v.color.join("/"));
  return parts.length ? parts.join(" · ") : v.sku;
}

export function KycForm({
  product,
  defaultVariantId,
  defaultInstallmentId,
  isSubmitting,
  onSubmit,
  onBack,
}: KycFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  if (product.variants.length === 0 || product.installmentPlans.length === 0) {
    return (
      <VStack align="start" spacing={2} py={10}>
        <Text fontWeight={600}>This product isn't ready for applications</Text>
        <Text fontSize="13px" color="textSecondary">
          Add at least one variant and one active installment plan before
          sending an invite.
        </Text>
        <Button variant="ghostOutline" onClick={onBack} mt={2}>
          Back
        </Button>
      </VStack>
    );
  }

  const initialVariant =
    product.variants.find((v) => v.variantId === defaultVariantId) ??
    product.variants[0];
  const initialPlan =
    product.installmentPlans.find(
      (installment) => installment.planId === defaultInstallmentId
    ) ?? product.installmentPlans[0];

  const variantOptions: Option[] = product.variants.map((v) => ({
    label: `${variantLabel(v)} · ${formatCurrency(v.price)}`,
    value: v.variantId,
  }));

  const planOptions: Option[] = product.installmentPlans.map((p) => ({
    label: `${p.durationMonths} months · ${p.interestPercentage}% interest`,
    value: p.planId,
  }));

  return (
    <Formik<KycFormValues>
      initialValues={{
        variantId: initialVariant.variantId,
        installmentPlanId: initialPlan.planId,
        idType: "BVN" as IdType,
        idNumber: "",
      }}
      validationSchema={kycSchema}
      onSubmit={(values) => {
        if (!file) {
          setFileError("Upload a recent bank statement to continue");
          return;
        }
        setFileError(null);
        onSubmit(values, file);
      }}>
      {({ values }) => {
        const selectedVariant =
          product.variants.find((v) => v.variantId === values.variantId) ??
          initialVariant;
        const selectedPlan =
          product.installmentPlans.find(
            (p) => p.planId === values.installmentPlanId
          ) ?? initialPlan;

        return (
          <Form>
            <VStack align="stretch" spacing={4}>
              <SelectField
                name="variantId"
                label="Variant"
                options={variantOptions}
              />

              <SelectField
                name="installmentPlanId"
                label="Installment plan"
                options={planOptions}
              />

              <MonthlyPaymentCard
                price={selectedVariant.price}
                plan={selectedPlan}
                variant={selectedVariant}
              />

              <HStack spacing={4} align="flex-start">
                <SelectField
                  name="idType"
                  label="ID type"
                  options={ID_TYPE_OPTIONS}
                />

                <InputField
                  name="idNumber"
                  label="ID number"
                  placeholder="22112233445"
                />
              </HStack>

              <VStack align="stretch" spacing={1}>
                <UploadBankStatement
                  file={file}
                  onSelect={(f) => {
                    setFile(f);
                    setFileError(null);
                  }}
                  onRemove={() => setFile(null)}
                  isInvalid={Boolean(fileError)}
                />
                {fileError && (
                  <Text fontSize="12px" color="statusDanger">
                    {fileError}
                  </Text>
                )}
              </VStack>

              <HStack pt={2} spacing={3}>
                <Button variant="ghostOutline" onClick={onBack} type="button">
                  Back
                </Button>
                <Button type="submit" flex={1} isLoading={isSubmitting}>
                  Submit application
                </Button>
              </HStack>
            </VStack>
          </Form>
        );
      }}
    </Formik>
  );
}
