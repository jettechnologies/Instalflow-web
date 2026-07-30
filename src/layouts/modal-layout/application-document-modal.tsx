import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { ExternalLink } from "lucide-react";
import { ModalLayout } from "@layouts/modal-layout/modal";
import { useQuery } from "@tanstack/react-query";
import { getKycSignedDocumentUrlQueryOptions } from "@services/tanstack-queries/kyc";

interface ApplicationDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
}

export const ApplicationDocumentModal = ({
  isOpen,
  onClose,
  applicationId,
}: ApplicationDocumentModalProps) => {
  const { data: signedUrl, isLoading } = useQuery({
    ...getKycSignedDocumentUrlQueryOptions(applicationId),
    select: (data) => data.signedUrl || "",
  });

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="Bank statement"
      subTitle="Secure document viewer"
      autoClose={false}>
      <VStack align="stretch" spacing={4}>
        {isLoading ? (
          <Center width="100%" height="300px">
            <Spinner size="md" />
          </Center>
        ) : (
          signedUrl && (
            <Box
              border="1px solid"
              borderColor="borderStructural"
              borderRadius="md"
              overflow="hidden"
              bg="bgLayer1">
              <iframe
                src={signedUrl}
                width="100%"
                height="600px"
                title="Bank statement document"
                style={{ border: "none" }}
              />
            </Box>
          )
        )}
        <HStack spacing={3} pt={2}>
          <Button
            variant="ghostOutline"
            size="sm"
            as="a"
            href={signedUrl ?? undefined}
            target="_blank"
            rel="noopener noreferrer"
            isDisabled={!signedUrl}
            leftIcon={<ExternalLink size={14} />}>
            Open in new tab
          </Button>
          <Text fontSize="11px" color="textMuted">
            Link expires in 15 minutes
          </Text>
        </HStack>
      </VStack>
    </ModalLayout>
  );
};
