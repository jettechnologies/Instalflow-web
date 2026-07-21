import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Box, Button, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { ExternalLink } from "lucide-react";
import { useToastContext } from "@hooks/context";
import { ModalLayout } from "@layouts/modal-layout/modal";
import { getSignedDocumentUrl } from "@services/queries/kyc";

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
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const { openToast } = useToastContext();

  const { mutate, isPending } = useMutation({
    mutationFn: () => getSignedDocumentUrl(applicationId),
    onSuccess: (data) => {
      setSignedUrl(data.signedUrl);
    },
    onError: (e: Error) => openToast(e.message, "error"),
  });

  useEffect(() => {
    if (isOpen && !signedUrl) {
      mutate();
    }
  }, [isOpen, signedUrl, mutate]);

  useEffect(() => {
    if (!isOpen) {
      setSignedUrl(null);
    }
  }, [isOpen]);

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="Bank statement"
      subTitle="Secure document viewer"
      autoClose={false}>
      <VStack align="stretch" spacing={4}>
        {signedUrl ? (
          <Box
            border="1px solid"
            borderColor="borderStructural"
            borderRadius="md"
            overflow="hidden"
            bg="bgLayer1">
            <iframe
              src={signedUrl}
              width="100%"
              height="500px"
              title="Bank statement document"
              style={{ border: "none" }}
            />
          </Box>
        ) : (
          <Flex justify="center" py={8}>
            <Button
              onClick={() => mutate()}
              isLoading={isPending}
              leftIcon={<ExternalLink size={16} />}>
              Load document
            </Button>
          </Flex>
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
