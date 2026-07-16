import { Box, Text } from "@chakra-ui/react";
import { formatCurrency } from "@utils/misc";

interface StatProps {
  label: string;
  value: string;
  accent?: boolean;
}

export function Stat({ label, value, accent }: StatProps) {
  return (
    <Box>
      <Text
        fontSize="10px"
        color="textMuted"
        fontWeight={600}
        letterSpacing="0.06em">
        {label.toUpperCase()}
      </Text>
      <Text
        fontSize="15px"
        fontWeight={700}
        mt={1}
        color={accent ? "brand.300" : "textPrimary"}>
        {value}
      </Text>
    </Box>
  );
}

export { formatCurrency };
