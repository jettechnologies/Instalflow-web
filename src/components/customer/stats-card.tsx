import { Box, Text } from "@chakra-ui/react";

interface StatsCardProps {
  label: string;
  value: string;
}

export const StatsCard = ({ label, value }: StatsCardProps) => {
  return (
    <Box
      bg="bgLayer2"
      border="1px solid"
      borderColor="borderStructural"
      borderRadius="2xl"
      p={6}>
      <Text
        fontSize="11px"
        color="textMuted"
        fontWeight={600}
        letterSpacing="0.06em"
        textTransform="uppercase">
        {label.toUpperCase()}
      </Text>
      <Text
        fontSize="26px"
        fontWeight={800}
        mt={2}
        letterSpacing="-0.02em"
        color="textPrimary">
        {value}
      </Text>
    </Box>
  );
};
