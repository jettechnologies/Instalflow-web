import { useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ArrowLeft, Check, ExternalLink, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@components/shared/AppShell";
import { getKycApplicationByIdQueryOptions } from "@services/tanstack-queries/kyc";
import type { KycStatus } from "@utils/types/response-type";
import { ApplicationApproveModal } from "@layouts/modal-layout/application-approve-modal";
import { ApplicationDocumentModal } from "@layouts/modal-layout/application-document-modal";
import { formatCurrency } from "@utils/misc";
import { Link } from "@tanstack/react-router";

const STATUS_LABEL: Record<KycStatus, string> = {
  PENDING: "Pending",
  APPROVAL_PROCESSING: "Approval Processing",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

const tone: Record<KycStatus, { bg: string; fg: string }> = {
  PENDING: { bg: "rgba(245,158,11,0.14)", fg: "#F59E0B" },
  APPROVAL_PROCESSING: { bg: "rgba(245,158,11,0.14)", fg: "#F59E0B" },
  APPROVED: { bg: "rgba(16,185,129,0.16)", fg: "#10B981" },
  REJECTED: { bg: "rgba(239,68,68,0.14)", fg: "#EF4444" },
};

interface MarketerApplicationDetailsProps {
  applicationId: string;
}

export function MarketerApplicationDetails({
  applicationId,
}: MarketerApplicationDetailsProps) {
  const { data: application, isLoading } = useQuery({
    ...getKycApplicationByIdQueryOptions(applicationId),
  });

  const [approveModal, setApproveModal] = useState(false);
  const [documentModal, setDocumentModal] = useState(false);

  const app = application;
  const status = app?.status as KycStatus | undefined;
  const t = status ? tone[status] : tone.PENDING;

  const name = app?.onboardingSession.name || app?.user.name;
  const email = app?.onboardingSession.email || app?.user.email;

  const backLink = "/marketer/applications";

  if (isLoading) {
    return (
      <AppShell title="Application details">
        <Flex justify="center" py={20}>
          <Spinner color="brand.400" />
        </Flex>
      </AppShell>
    );
  }

  if (!app) {
    return (
      <AppShell title="Application not found">
        <VStack align="start" spacing={1} py={10}>
          <Text fontWeight={600}>We couldn't find this application</Text>
          <Text color="textSecondary" fontSize="13px">
            It may have been removed, or the link is out of date.
          </Text>
          <Button
            as={Link}
            to={backLink}
            mt={4}
            leftIcon={<ArrowLeft size={16} />}
            variant="ghostOutline">
            Back to applications
          </Button>
        </VStack>
      </AppShell>
    );
  }

  const price = Number(app.financingContract?.totalFinanced || 0);
  const commissionRate = Number(app.product.commissionRate);
  const commission = Math.round((price * commissionRate) / 100);

  return (
    <AppShell
      title={name || "Application details"}
      subtitle={`Application ${app.kycApplicationId}`}>
      <VStack align="stretch" spacing={6}>
        <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={4}>
          <Box
            bg="bgLayer2"
            border="1px solid"
            borderColor="borderStructural"
            borderRadius="2xl"
            p={5}>
            <Text
              fontSize="11px"
              color="textMuted"
              fontWeight={600}
              letterSpacing="0.06em">
              STATUS
            </Text>
            <Badge
              bg={t.bg}
              color={t.fg}
              px={2.5}
              py={1}
              borderRadius="full"
              fontSize="10px"
              fontWeight={700}
              letterSpacing="0.05em"
              mt={2}>
              {STATUS_LABEL[status || "PENDING"].toUpperCase()}
            </Badge>
          </Box>
          <Box
            bg="bgLayer2"
            border="1px solid"
            borderColor="borderStructural"
            borderRadius="2xl"
            p={5}>
            <Text
              fontSize="11px"
              color="textMuted"
              fontWeight={600}
              letterSpacing="0.06em">
              YOUR SIGNATURE
            </Text>
            <Text
              fontSize="24px"
              fontWeight={800}
              mt={2}
              letterSpacing="-0.02em">
              {app.marketerApproved ? "Signed" : "Pending"}
            </Text>
          </Box>
          <Box
            bg="bgLayer2"
            border="1px solid"
            borderColor="borderStructural"
            borderRadius="2xl"
            p={5}>
            <Text
              fontSize="11px"
              color="textMuted"
              fontWeight={600}
              letterSpacing="0.06em">
              ADMIN SIGNATURE
            </Text>
            <Text
              fontSize="24px"
              fontWeight={800}
              mt={2}
              letterSpacing="-0.02em">
              {app.adminApproved ? "Signed" : "Pending"}
            </Text>
          </Box>
          <Box
            bg="bgLayer2"
            border="1px solid"
            borderColor="borderStructural"
            borderRadius="2xl"
            p={5}>
            <Text
              fontSize="11px"
              color="textMuted"
              fontWeight={600}
              letterSpacing="0.06em">
              COMMISSION (EST.)
            </Text>
            <Text
              fontSize="24px"
              fontWeight={800}
              mt={2}
              letterSpacing="-0.02em">
              {status === "REJECTED" ? "—" : formatCurrency(commission)}
            </Text>
          </Box>
        </SimpleGrid>

        <Box
          bg="bgLayer2"
          border="1px solid"
          borderColor="borderStructural"
          borderRadius="2xl"
          p={5}>
          <Heading size="sm" mb={4}>
            Customer information
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} fontSize="13px">
            <Box>
              <Text
                fontSize="10px"
                color="textMuted"
                fontWeight={600}
                letterSpacing="0.06em">
                NAME
              </Text>
              <Text fontSize="13px" mt={1}>
                {name}
              </Text>
            </Box>
            <Box>
              <Text
                fontSize="10px"
                color="textMuted"
                fontWeight={600}
                letterSpacing="0.06em">
                EMAIL
              </Text>
              <Text fontSize="13px" mt={1}>
                {email}
              </Text>
            </Box>
            <Box>
              <Text
                fontSize="10px"
                color="textMuted"
                fontWeight={600}
                letterSpacing="0.06em">
                PRODUCT
              </Text>
              <Text fontSize="13px" mt={1}>
                {app.product?.name}
              </Text>
            </Box>
            <Box>
              <Text
                fontSize="10px"
                color="textMuted"
                fontWeight={600}
                letterSpacing="0.06em">
                FINANCED
              </Text>
              <Text fontSize="13px" mt={1}>
                {formatCurrency(price)}
              </Text>
            </Box>
          </SimpleGrid>
        </Box>

        {app.kycDocumentAssets?.length > 0 && (
          <Box
            bg="bgLayer2"
            border="1px solid"
            borderColor="borderStructural"
            borderRadius="2xl"
            p={5}>
            <Heading size="sm" mb={4}>
              Documents
            </Heading>
            <HStack
              p={3}
              border="1px solid"
              borderColor="borderStructural"
              borderRadius="md"
              spacing={3}
              bg="bgLayer1">
              <FileText size={18} color="#A78BFA" />
              <Box flex={1} minW={0}>
                <Text fontSize="13px" fontWeight={600} noOfLines={1}>
                  Bank statement
                </Text>
                <Text fontSize="11px" color="textMuted">
                  {app.kycDocumentAssets[0].mimeType} ·{" "}
                  {Math.round(app.kycDocumentAssets[0].fileSize / 1024)} KB
                </Text>
              </Box>
              <Button
                size="sm"
                leftIcon={<ExternalLink size={14} />}
                onClick={() => setDocumentModal(true)}>
                Open signed URL
              </Button>
            </HStack>
          </Box>
        )}

        {status === "PENDING" && !app.marketerApproved && (
          <HStack spacing={3} pt={2}>
            <Button
              onClick={() => setApproveModal(true)}
              leftIcon={<Check size={16} />}>
              Sign approval
            </Button>
          </HStack>
        )}
      </VStack>

      {approveModal && (
        <ApplicationApproveModal
          isOpen={approveModal}
          onClose={() => setApproveModal(false)}
          applicationId={app.kycApplicationId}
          applicationName={name || "this application"}
        />
      )}

      {documentModal && (
        <ApplicationDocumentModal
          isOpen={documentModal}
          onClose={() => setDocumentModal(false)}
          applicationId={app.kycApplicationId}
        />
      )}
    </AppShell>
  );
}
