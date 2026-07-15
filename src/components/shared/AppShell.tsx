import { type ReactNode } from "react";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CaretRight } from "@phosphor-icons/react";
import { Link, useLocation } from "@tanstack/react-router";

interface NavigationItem {
  label: string;
  to: string;
  icon?: React.ComponentType<any>;
}

interface AppShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: string | number;
  // breadcrumbs?: { label: string; href: string }[];
  isBreadCrumbs?: boolean;
  navigation?: NavigationItem[];
  actions?: ReactNode;
  footer?: ReactNode;
}

export function AppShell({
  title,
  subtitle,
  children,
  maxWidth,
  isBreadCrumbs = false,
  navigation = [],
  actions,
  footer,
}: AppShellProps) {
  const { pathname } = useLocation();

  const pathSegments = pathname.split("/").filter(Boolean);

  const buildUrl = (index: number) =>
    `/${pathSegments.slice(0, index + 1).join("/")}`;

  return (
    <VStack align="stretch" spacing={6} maxW={maxWidth} mx="auto">
      <HStack
        justify="space-between"
        align="flex-start"
        flexWrap="wrap"
        spacing={4}>
        <Box flex="1">
          {isBreadCrumbs && (
            <Breadcrumb
              mb={2}
              spacing="8px"
              separator={<CaretRight size={16} />}>
              {pathSegments.map((segment, index) => {
                const href = buildUrl(index);
                const navMatch = navigation.find(
                  (item) => item.to.toLowerCase() === href.toLowerCase()
                );
                const label = navMatch?.label ?? segment.replace(/-/g, " ");
                const Icon = navMatch?.icon;
                return (
                  <BreadcrumbItem
                    key={href}
                    isCurrentPage={index === pathSegments.length - 1}>
                    <BreadcrumbLink
                      as={Link}
                      to={href}
                      fontSize="sm"
                      fontWeight="medium"
                      textTransform="capitalize">
                      <Flex align="center" gap={1.5}>
                        {Icon && <Icon size={16} weight="bold" />}
                        <Text>{label}</Text>
                      </Flex>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                );
              })}
            </Breadcrumb>
          )}
          <Heading size="lg">{title}</Heading>
          {subtitle && (
            <Text mt={1} fontSize="13px" color="textSecondary">
              {subtitle}
            </Text>
          )}
          {footer && <Box mt={3}>{footer}</Box>}
        </Box>
        {actions && <Box>{actions}</Box>}
      </HStack>
      {children}
    </VStack>
  );
}
