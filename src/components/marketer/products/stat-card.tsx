import { Stat, StatLabel, StatNumber, Text } from "@chakra-ui/react";

export function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: string;
}) {
  return (
    <Stat
      bg="bgLayer2"
      border="1px solid"
      borderColor="borderStructural"
      borderRadius="2xl"
      px={4}
      py={3}>
      <StatLabel fontSize="11px" color="textMuted" fontWeight={600}>
        {label.toUpperCase()}
      </StatLabel>
      <StatNumber fontSize="18px" letterSpacing="-0.02em" color={accent}>
        {value}
      </StatNumber>
      {hint && (
        <Text fontSize="10px" color="textMuted" mt={0.5}>
          {hint}
        </Text>
      )}
    </Stat>
  );
}
