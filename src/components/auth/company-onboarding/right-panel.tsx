import type { OnboardingView } from "@utils/types";
import { Box, Flex, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import {
  CheckCircleIcon,
  LockKeyOpenIcon,
  PaperPlaneTiltIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react";

type RightPanelView = OnboardingView | "forgot-password" | "reset-password";

const PANEL_COPY: Record<RightPanelView, { headline: string; sub: string }> = {
  "onboarding-step1": {
    headline: "One workspace, every tool",
    sub: "Register your company once — your accounts, logs, and client contracts flow securely through a single cryptographic pipeline.",
  },
  "onboarding-step2": {
    headline: "Pick a plan, grow at will",
    sub: "Every tier unlocks isolated workspace provisioning. Scale up or down at any billing cycle with zero downtime.",
  },
  login: {
    headline: "Welcome back",
    sub: "Your accounts, reconciliations, and client contracts are waiting in a fully audited, zero-knowledge environment.",
  },
  "forgot-password": {
    headline: "Secure account recovery",
    sub: "Reset tokens are time-limited and single-use. Your session history and audit logs remain intact throughout the recovery process.",
  },
  "reset-password": {
    headline: "One-time secure reset",
    sub: "On success, all active sessions are revoked automatically so your workspace stays protected from the moment your new password is set.",
  },
};

const PANEL_BADGES: Record<RightPanelView, string[]> = {
  "onboarding-step1": ["256-bit SSL", "NDPR Compliant", "99.9% SLA"],
  "onboarding-step2": ["256-bit SSL", "NDPR Compliant", "99.9% SLA"],
  login: ["256-bit SSL", "NDPR Compliant", "99.9% SLA"],
  "forgot-password": [
    "Token expires in 15 min",
    "Single-use link",
    "No account exposure",
  ],
  "reset-password": ["Single-use token", "All sessions revoked", "256-bit SSL"],
};

const IllustrationInner = ({ view }: { view: RightPanelView }) => {
  if (view === "forgot-password") {
    return (
      <VStack spacing={4} position="relative">
        <Flex
          w="72px"
          h="72px"
          borderRadius="20px"
          bg="rgba(124,58,237,0.1)"
          border="1px solid rgba(124,58,237,0.2)"
          align="center"
          justify="center">
          <LockKeyOpenIcon
            size={32}
            color="var(--brand-primary)"
            weight="duotone"
          />
        </Flex>
        <Flex
          w="48px"
          h="34px"
          borderRadius="8px"
          bg="var(--border-structural)"
          align="center"
          justify="center"
          opacity={0.6}>
          <PaperPlaneTiltIcon
            size={18}
            color="var(--text-muted)"
            weight="duotone"
          />
        </Flex>
        <Box
          w="80px"
          h="6px"
          borderRadius="full"
          bg="var(--border-structural)"
        />
      </VStack>
    );
  }

  if (view === "reset-password") {
    return (
      <VStack spacing={4} position="relative">
        <Flex
          w="72px"
          h="72px"
          borderRadius="20px"
          bg="rgba(16,185,129,0.1)"
          border="1px solid rgba(16,185,129,0.2)"
          align="center"
          justify="center">
          <ShieldCheckIcon
            size={32}
            color="var(--status-success)"
            weight="duotone"
          />
        </Flex>
        {/* Stacked key slots */}
        {[72, 52].map((w, i) => (
          <Box
            key={i}
            w={`${w}px`}
            h="8px"
            borderRadius="full"
            bg={i === 0 ? "rgba(16,185,129,0.3)" : "var(--border-structural)"}
          />
        ))}
      </VStack>
    );
  }

  return (
    <VStack spacing={4} position="relative">
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          w={`${140 - i * 16}px`}
          h="10px"
          borderRadius="full"
          bg={
            i === 0
              ? "var(--brand-gradient)"
              : i === 1
                ? "var(--border-structural)"
                : "rgba(255,255,255,0.04)"
          }
          transform={`translateY(${i * -6}px)`}
        />
      ))}
      <HStack spacing={3} mt={2}>
        {[
          { color: "var(--status-success)", w: "36px" },
          { color: "var(--status-warning)", w: "24px" },
          { color: "var(--status-info)", w: "48px" },
        ].map((b, i) => (
          <Box
            key={i}
            h="6px"
            w={b.w}
            bg={b.color}
            borderRadius="full"
            opacity={0.7}
          />
        ))}
      </HStack>
    </VStack>
  );
};

const PING_COLOR: Record<RightPanelView, string> = {
  "onboarding-step1": "var(--status-success)",
  "onboarding-step2": "var(--status-success)",
  login: "var(--status-success)",
  "forgot-password": "var(--status-warning)",
  "reset-password": "var(--status-success)",
};

export const RightPanel = ({ view }: { view: RightPanelView }) => {
  const { headline, sub } = PANEL_COPY[view];
  const badges = PANEL_BADGES[view];
  const pingColor = PING_COLOR[view];

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      h="full"
      px={{ base: 6, md: 12 }}
      py={12}
      position="relative"
      overflow="hidden">
      <Box
        position="absolute"
        top="-80px"
        right="-80px"
        w="360px"
        h="360px"
        borderRadius="full"
        bg="radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-60px"
        left="-60px"
        w="280px"
        h="280px"
        borderRadius="full"
        bg="radial-gradient(circle, rgba(30,58,138,0.22) 0%, transparent 70%)"
        pointerEvents="none"
      />

      <VStack
        spacing={8}
        maxW="360px"
        textAlign="center"
        position="relative"
        zIndex={1}>
        <Box
          w="220px"
          h="220px"
          borderRadius="32px"
          bg="var(--bg-layer-2)"
          border="1px solid var(--border-structural)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
          boxShadow="0 24px 60px rgba(0,0,0,0.4)">
          <Box
            position="absolute"
            inset={0}
            borderRadius="30px"
            opacity={0.04}
            backgroundImage="repeating-linear-gradient(0deg, var(--text-primary) 0px, transparent 1px, transparent 28px), repeating-linear-gradient(90deg, var(--text-primary) 0px, transparent 1px, transparent 28px)"
          />

          <IllustrationInner view={view} />

          <Box
            position="absolute"
            top={4}
            right={4}
            w="10px"
            h="10px"
            borderRadius="full"
            bg={pingColor}>
            <Box
              position="absolute"
              inset="-4px"
              borderRadius="full"
              border={`2px solid ${pingColor}`}
              opacity={0.4}
            />
          </Box>
        </Box>

        <VStack spacing={2}>
          <Text
            fontSize="xs"
            fontWeight="700"
            letterSpacing="0.15em"
            textTransform="uppercase"
            color="var(--brand-primary)">
            InstalFlow
          </Text>
          <Heading
            size="md"
            color="var(--text-primary)"
            fontWeight="800"
            lineHeight="1.3">
            {headline}
          </Heading>
          <Text fontSize="sm" color="var(--text-secondary)" lineHeight="1.7">
            {sub}
          </Text>
        </VStack>

        <HStack spacing={4} flexWrap="wrap" justify="center">
          {badges.map((b) => (
            <HStack
              key={b}
              spacing={1}
              bg="var(--bg-layer-2)"
              px={3}
              py={1}
              borderRadius="full"
              border="1px solid var(--border-structural)">
              <CheckCircleIcon
                size={11}
                color="var(--status-success)"
                weight="fill"
              />
              <Text fontSize="10px" color="var(--text-muted)" fontWeight="600">
                {b}
              </Text>
            </HStack>
          ))}
        </HStack>
      </VStack>
    </Flex>
  );
};

// import type { OnboardingView } from "@utils/types";
// import { Box, Flex, Heading, HStack, Text, VStack } from "@chakra-ui/react";
// import { CheckCircleIcon } from "@phosphor-icons/react";

// const PANEL_COPY: Record<OnboardingView, { headline: string; sub: string }> = {
//   "onboarding-step1": {
//     headline: "One workspace, every tool",
//     sub: "Register your company once — your accounts, logs, and client contracts flow securely through a single cryptographic pipeline.",
//   },
//   "onboarding-step2": {
//     headline: "Pick a plan, grow at will",
//     sub: "Every tier unlocks isolated workspace provisioning. Scale up or down at any billing cycle with zero downtime.",
//   },
//   login: {
//     headline: "Welcome back",
//     sub: "Your accounts, reconciliations, and client contracts are waiting in a fully audited, zero-knowledge environment.",
//   },
// };

// export const RightPanel = ({ view }: { view: OnboardingView }) => {
//   const { headline, sub } = PANEL_COPY[view];

//   return (
//     <Flex
//       direction="column"
//       align="center"
//       justify="center"
//       h="full"
//       px={{ base: 6, md: 12 }}
//       py={12}
//       position="relative"
//       overflow="hidden">
//       <Box
//         position="absolute"
//         top="-80px"
//         right="-80px"
//         w="360px"
//         h="360px"
//         borderRadius="full"
//         bg="radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)"
//         pointerEvents="none"
//       />
//       <Box
//         position="absolute"
//         bottom="-60px"
//         left="-60px"
//         w="280px"
//         h="280px"
//         borderRadius="full"
//         bg="radial-gradient(circle, rgba(30,58,138,0.22) 0%, transparent 70%)"
//         pointerEvents="none"
//       />

//       <VStack
//         spacing={8}
//         maxW="360px"
//         textAlign="center"
//         position="relative"
//         zIndex={1}>
//         <Box
//           w="220px"
//           h="220px"
//           borderRadius="32px"
//           bg="var(--bg-layer-2)"
//           border="1px solid var(--border-structural)"
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//           position="relative"
//           boxShadow="0 24px 60px rgba(0,0,0,0.4)">
//           <Box
//             position="absolute"
//             inset={0}
//             borderRadius="30px"
//             opacity={0.04}
//             backgroundImage="repeating-linear-gradient(0deg, var(--text-primary) 0px, transparent 1px, transparent 28px), repeating-linear-gradient(90deg, var(--text-primary) 0px, transparent 1px, transparent 28px)"
//           />
//           <VStack spacing={4} position="relative">
//             {[0, 1, 2].map((i) => (
//               <Box
//                 key={i}
//                 w={`${140 - i * 16}px`}
//                 h="10px"
//                 borderRadius="full"
//                 bg={
//                   i === 0
//                     ? "var(--brand-gradient)"
//                     : i === 1
//                       ? "var(--border-structural)"
//                       : "rgba(255,255,255,0.04)"
//                 }
//                 transform={`translateY(${i * -6}px)`}
//               />
//             ))}
//             <HStack spacing={3} mt={2}>
//               {[
//                 { color: "var(--status-success)", w: "36px" },
//                 { color: "var(--status-warning)", w: "24px" },
//                 { color: "var(--status-info)", w: "48px" },
//               ].map((b, i) => (
//                 <Box
//                   key={i}
//                   h="6px"
//                   w={b.w}
//                   bg={b.color}
//                   borderRadius="full"
//                   opacity={0.7}
//                 />
//               ))}
//             </HStack>
//           </VStack>
//           <Box
//             position="absolute"
//             top={4}
//             right={4}
//             w="10px"
//             h="10px"
//             borderRadius="full"
//             bg="var(--status-success)">
//             <Box
//               position="absolute"
//               inset="-4px"
//               borderRadius="full"
//               border="2px solid var(--status-success)"
//               opacity={0.4}
//             />
//           </Box>
//         </Box>

//         <VStack spacing={2}>
//           <Text
//             fontSize="xs"
//             fontWeight="700"
//             letterSpacing="0.15em"
//             textTransform="uppercase"
//             color="var(--brand-primary)">
//             InstalFlow
//           </Text>
//           <Heading
//             size="md"
//             color="var(--text-primary)"
//             fontWeight="800"
//             lineHeight="1.3">
//             {headline}
//           </Heading>
//           <Text fontSize="sm" color="var(--text-secondary)" lineHeight="1.7">
//             {sub}
//           </Text>
//         </VStack>

//         <HStack spacing={4} flexWrap="wrap" justify="center">
//           {["256-bit SSL", "NDPR Compliant", "99.9% SLA"].map((b) => (
//             <HStack
//               key={b}
//               spacing={1}
//               bg="var(--bg-layer-2)"
//               px={3}
//               py={1}
//               borderRadius="full"
//               border="1px solid var(--border-structural)">
//               <CheckCircleIcon
//                 size={11}
//                 color="var(--status-success)"
//                 weight="fill"
//               />
//               <Text fontSize="10px" color="var(--text-muted)" fontWeight="600">
//                 {b}
//               </Text>
//             </HStack>
//           ))}
//         </HStack>
//       </VStack>
//     </Flex>
//   );
// };
