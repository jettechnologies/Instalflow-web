import { Box, Heading, HStack, Text, Badge } from "@chakra-ui/react";
import { ShieldCheck } from "lucide-react";

interface InviteHeroProps {
  referralCode?: string;
  title?: string;
}

export function InviteHero({
  referralCode,
  title = "Pay over time with Instalflow.",
}: InviteHeroProps) {
  return (
    <Box>
      <Badge
        bg="rgba(124,58,237,0.16)"
        color="brand.300"
        px={3}
        py={1}
        borderRadius="full"
        fontSize="10px"
        fontWeight={700}
        letterSpacing="0.08em">
        {referralCode ? `INVITED · ${referralCode}` : "DIRECT APPLICATION"}
      </Badge>
      <Heading size="xl" mt={4} letterSpacing="-0.02em">
        {title}
      </Heading>
      <Text fontSize="15px" color="textSecondary" mt={3}>
        Two quick steps. Your data is encrypted in transit and used only for
        credit underwriting.
      </Text>

      <HStack mt={6} spacing={2} color="textMuted" fontSize="12px">
        <ShieldCheck size={14} />
        <Text>SSL 256-bit · BVN verified via NIBSS · Soft credit check</Text>
      </HStack>
    </Box>
  );
}
