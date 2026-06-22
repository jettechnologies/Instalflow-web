import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  Users,
  Wallet,
  Receipt,
  BarChart3,
  LogOut,
  Link2,
  FileCheck,
  Menu as MenuIcon,
} from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { NotificationBell } from "@components/shared/notification-bell";
import { LightningIcon } from "@phosphor-icons/react";
import { useAuth } from "@context/auth-provider";
import type { UserRole } from "@utils/types";

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const NAV: Record<UserRole, NavItem[]> = {
  COMPANY: [
    { to: "/company/overview", label: "Overview", icon: LayoutDashboard },
    { to: "/company/products", label: "Products", icon: Package },
    { to: "/company/applications", label: "Applications", icon: FileCheck },
    { to: "/company/marketers", label: "Marketers", icon: Users },
    { to: "/company/admins", label: "Admins", icon: Users },
    { to: "/company/commissions", label: "Payouts", icon: Wallet },
    { to: "/company/analytics", label: "Analytics", icon: BarChart3 },
  ],
  ADMIN: [
    { to: "/company/overview", label: "Overview", icon: LayoutDashboard },
    { to: "/company/applications", label: "Applications", icon: FileCheck },
    { to: "/company/marketers", label: "Marketers", icon: Users },
    { to: "/company/products", label: "Products", icon: Package },
    { to: "/company/commissions", label: "Payouts", icon: Wallet },
  ],
  MARKETER: [
    { to: "/marketer/overview", label: "Overview", icon: LayoutDashboard },
    { to: "/marketer/products", label: "Products", icon: Package },
    { to: "/marketer/applications", label: "Applications", icon: FileCheck },
    { to: "/marketer/referrals", label: "Leads", icon: Users },
    { to: "/marketer/links", label: "My links", icon: Link2 },
    { to: "/marketer/payouts", label: "Payouts", icon: Wallet },
  ],
  CUSTOMER: [
    { to: "/customer/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/customer/installments", label: "Installments", icon: Receipt },
  ],
};

function NavList({
  items,
  pathname,
  onItemClick,
}: {
  items: NavItem[];
  pathname: string;
  onItemClick?: () => void;
}) {
  return (
    <VStack spacing={1} align="stretch">
      {items.map(({ to, label, icon: Icon }) => {
        const active = pathname.startsWith(to);
        return (
          <RouterLink key={to} to={to} onClick={onItemClick}>
            <HStack
              px={3}
              py={2.5}
              borderRadius="10px"
              bg={active ? "rgba(124,58,237,0.12)" : "transparent"}
              borderLeft="3px solid"
              borderLeftColor={active ? "brand.500" : "transparent"}
              color={active ? "textPrimary" : "textSecondary"}
              _hover={{
                bg: active ? "rgba(124,58,237,0.16)" : "rgba(255,255,255,0.04)",
              }}
              transition="all .15s ease"
              spacing={3}>
              <Icon size={16} color={active ? "#7C3AED" : "#667185"} />
              <Text fontSize="13px" fontWeight={active ? 600 : 500}>
                {label}
              </Text>
            </HStack>
          </RouterLink>
        );
      })}
    </VStack>
  );
}

export function DashboardLayout({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const drawer = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    drawer.onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!user) return null;
  const items = NAV[user.role];

  return (
    <Flex minH="100vh" bg="bgLayer1">
      {/* Desktop sidebar */}
      <Box
        w="248px"
        bg="bgLayer2"
        borderRight="1px solid"
        borderColor="borderStructural"
        py={6}
        px={4}
        display={{ base: "none", lg: "block" }}>
        <HStack spacing={2} px={2} mb={8}>
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
        <NavList items={items} pathname={pathname} />
      </Box>

      {/* Mobile/tablet drawer */}
      <Drawer
        isOpen={drawer.isOpen}
        onClose={drawer.onClose}
        placement="left"
        size="xs">
        <DrawerOverlay backdropFilter="blur(4px)" />
        <DrawerContent
          bg="bgLayer2"
          borderRight="1px solid"
          borderColor="borderStructural">
          <DrawerCloseButton color="textSecondary" />
          <DrawerBody py={6} px={4}>
            <HStack spacing={2} px={2} mb={8}>
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
            <NavList
              items={items}
              pathname={pathname}
              onItemClick={drawer.onClose}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main */}
      <Flex direction="column" flex={1} minW={0}>
        <Flex
          as="header"
          h={{ base: "56px", md: "64px" }}
          align="center"
          justify="space-between"
          px={{ base: 4, md: 6, lg: 8 }}
          borderBottom="1px solid"
          borderColor="borderStructural"
          bg="bgLayer2"
          gap={3}>
          <HStack spacing={2} minW={0} flex={1}>
            <IconButton
              aria-label="Open menu"
              icon={<MenuIcon size={18} />}
              variant="ghost"
              size="sm"
              color="textSecondary"
              _hover={{ color: "textPrimary", bg: "rgba(255,255,255,0.04)" }}
              display={{ base: "inline-flex", lg: "none" }}
              onClick={drawer.onOpen}
            />
            <Text
              fontSize={{ base: "16px", md: "20px" }}
              fontWeight={700}
              color="textPrimary"
              noOfLines={1}>
              {title}
            </Text>
          </HStack>
          <HStack spacing={{ base: 2, md: 3 }}>
            <NotificationBell />
            <Menu>
              <MenuButton>
                <HStack spacing={3} cursor="pointer">
                  <Avatar
                    size="sm"
                    name={user.name}
                    bg="brand.700"
                    color="white"
                    fontWeight={600}
                  />
                  <Box textAlign="left" display={{ base: "none", md: "block" }}>
                    <Text
                      fontSize="13px"
                      fontWeight={600}
                      color="textPrimary"
                      lineHeight="1.1">
                      {user.name}
                    </Text>
                    <Text fontSize="11px" color="textMuted">
                      {user.role}
                    </Text>
                  </Box>
                </HStack>
              </MenuButton>
              <MenuList bg="bgLayer2" borderColor="borderStructural">
                <MenuItem
                  bg="bgLayer2"
                  color="textPrimary"
                  _hover={{ bg: "rgba(255,255,255,0.04)" }}
                  icon={<LogOut size={14} />}
                  onClick={async () => {
                    await logout();
                    navigate({ to: "/login" });
                  }}>
                  Sign out
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
        <Box
          flex={1}
          p={{ base: 4, md: 6, lg: 8 }}
          overflowY="auto"
          width="full">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
