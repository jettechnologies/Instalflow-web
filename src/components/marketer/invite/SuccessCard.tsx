import { Box, Button, Container, Heading, Text, VStack } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

interface SuccessCardProps {
  referenceId: string;
}

export function SuccessCard({ referenceId }: SuccessCardProps) {
  return (
    <Box minH="100vh" bg="bgLayer1" py={20}>
      <Container maxW="md">
        <VStack
          spacing={6}
          bg="bgLayer2"
          border="1px solid"
          borderColor="borderStructural"
          p={10}
          borderRadius="2xl"
          textAlign="center">
          <Box
            w="64px"
            h="64px"
            borderRadius="full"
            bg="rgba(16,185,129,0.14)"
            display="flex"
            alignItems="center"
            justifyContent="center">
            <CheckCircle2 size={32} color="#10B981" />
          </Box>
          <Heading size="lg">Application received</Heading>
          <Text fontSize="14px" color="textSecondary">
            Your reference is{" "}
            <Text
              as="span"
              color="textPrimary"
              fontWeight={700}
              fontFamily="mono">
              {referenceId}
            </Text>
            . The marketer and our underwriting team will review within 24 hours.
          </Text>
          <Button as={Link} to="/login" w="100%">
            Sign in to track your application
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}
