import { type ChangeEvent } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Text,
} from "@chakra-ui/react";
import { FileText, Upload, X } from "lucide-react";

interface UploadBankStatementProps {
  file: File | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
  isInvalid?: boolean;
  errorMessage?: string;
}

const MAX_SIZE = 10 * 1024 * 1024;

export function UploadBankStatement({
  file,
  onSelect,
  onRemove,
  isInvalid,
  errorMessage,
}: UploadBankStatementProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    if (selected.type !== "application/pdf") {
      return;
    }
    if (selected.size > MAX_SIZE) {
      return;
    }
    onSelect(selected);
    event.target.value = "";
  };

  if (file) {
    return (
      <FormControl isInvalid={isInvalid}>
        <FormLabel>Bank statement (PDF, ≤10MB)</FormLabel>
        <HStack
          p={3}
          bg="bgLayer1"
          border="1px solid"
          borderColor="borderStructural"
          borderRadius="md">
          <FileText size={16} color="#A78BFA" />
          <Box flex={1} minW={0}>
            <Text fontSize="13px" noOfLines={1}>
              {file.name}
            </Text>
            <Text fontSize="11px" color="textMuted">
              {(file.size / 1024).toFixed(0)} KB
            </Text>
          </Box>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<X size={14} />}
            color="textSecondary"
            onClick={onRemove}
            aria-label="Remove uploaded file">
            Remove
          </Button>
        </HStack>
        {isInvalid && errorMessage ? (
          <Text fontSize="12px" color="statusDanger" mt={1}>
            {errorMessage}
          </Text>
        ) : null}
      </FormControl>
    );
  }

  return (
    <FormControl isInvalid={isInvalid}>
      <FormLabel>Bank statement (PDF, ≤10MB)</FormLabel>
      <Box
        as="label"
        htmlFor="bank-statement"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={2}
        py={6}
        px={4}
        bg="bgLayer1"
        border="1px dashed"
        borderColor="borderStructural"
        borderRadius="md"
        cursor="pointer"
        _hover={{ borderColor: "brand.500" }}>
        <Upload size={18} color="#A78BFA" />
        <Text fontSize="13px" color="textSecondary">
          Click to upload your last 6 months bank statement
        </Text>
        <Input
          id="bank-statement"
          type="file"
          accept="application/pdf,.pdf"
          display="none"
          onChange={handleChange}
        />
      </Box>
      {isInvalid && errorMessage ? (
        <Text fontSize="12px" color="statusDanger" mt={1}>
          {errorMessage}
        </Text>
      ) : null}
    </FormControl>
  );
}
