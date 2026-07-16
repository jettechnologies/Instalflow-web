import { type ReactNode } from "react";
import {
  Box,
  Container,
  Flex,
  HStack,
  Text,
} from "@chakra-ui/react";
import { LightningIcon } from "@phosphor-icons/react";

interface InviteLayoutProps {
  children: ReactNode;
  maxWidth?: string;
}

export function InviteLayout({
  children,
  maxWidth = "6xl",
}: InviteLayoutProps) {
  return (
    <Box minH="100vh" bg="bgLayer1">
      <Container
        maxW={maxWidth}
        py={{ base: 8, md: 10 }}
        px={{ base: 4, md: 8 }}>
        {children}
      </Container>
    </Box>
  );
}

interface InviteHeaderProps {
  children: ReactNode;
}

export function InviteHeader({ children }: InviteHeaderProps) {
  return (
    <Flex
      as="header"
      align="center"
      h="64px"
      px={8}
      borderBottom="1px solid"
      borderColor="borderStructural"
      position="sticky"
      top={0}
      bg="bgLayer1"
      zIndex={10}>
      {children}
    </Flex>
  );
}

export function InviteLogo() {
  return (
    <HStack mb={0} spacing={2}>
      <Flex
        w="36px"
        h="36px"
        borderRadius="10px"
        background="var(--brand-gradient)"
        align="center"
        justify="center">
        <LightningIcon size={18} color="#fff" weight="fill" />
      </Flex>
      <Text
        fontWeight="800"
        fontSize="lg"
        color="var(--text-primary)"
        letterSpacing="-0.02em">
        InstalFlow
      </Text>
    </HStack>
  );
}
