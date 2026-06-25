import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  type ChakraProps,
} from "@chakra-ui/react";
import { CaretRightIcon, XIcon } from "@phosphor-icons/react";
import type { RefObject } from "react";

interface ModalLayoutProps extends ChakraProps {
  title?: string;
  subTitle?: string;
  children: React.ReactNode;
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "full";
  onClose: () => void;
  isOpen: boolean;
  radius?: string;
  focusRef?: RefObject<HTMLElement>;
  px?: string;
  closeBtnSize?: string;
  noCloseButton?: boolean;
  background?: string;
  noRadius?: boolean;
  autoClose?: boolean;
  modalFooter?: React.ReactNode;
  modalItems?: {
    icon?: React.ReactElement;
    text: string;
    link?: string;
  }[];
}

export const ModalLayout = ({
  size = "lg",
  px,
  py,
  title,
  onClose,
  isOpen,
  children,
  subTitle,
  radius,
  focusRef,
  closeBtnSize,
  background,
  noCloseButton,
  noRadius,
  autoClose = true,
  modalItems,
  modalFooter,
}: ModalLayoutProps) => {
  return (
    <Modal
      finalFocusRef={focusRef}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      closeOnOverlayClick={autoClose}
      closeOnEsc={autoClose}
      size={size}>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(12px)" />

      <ModalContent
        bg={background || "bgLayer2"}
        border="1px solid"
        borderColor="borderStructural"
        borderRadius={noRadius ? "none" : radius || "2xl"}
        px={px || 6}
        py={py ?? (noCloseButton ? 0 : 4)}
        color="textPrimary"
        overflow="hidden">
        {(title || modalItems?.length) && (
          <Flex justify="space-between" align="flex-start" gap={4} mb={4}>
            <Flex flex="1" align="flex-start">
              {!noCloseButton && (
                <IconButton
                  aria-label="Close modal"
                  variant="ghost"
                  size="sm"
                  minW={closeBtnSize || "32px"}
                  h={closeBtnSize || "32px"}
                  mr={3}
                  icon={<XIcon size={18} />}
                  color="textSecondary"
                  _hover={{
                    bg: "bgLayer1",
                    color: "textPrimary",
                  }}
                  onClick={onClose}
                />
              )}

              {title && (
                <ModalHeader p={0} flex="1">
                  <Text fontSize="lg" fontWeight="600" color="textPrimary">
                    {title}
                  </Text>

                  {subTitle && (
                    <Text
                      mt={1}
                      fontSize="sm"
                      color="textSecondary"
                      fontWeight="400">
                      {subTitle}
                    </Text>
                  )}
                </ModalHeader>
              )}
            </Flex>

            {modalItems && modalItems.length > 0 && (
              <Breadcrumb
                spacing="8px"
                separator={<CaretRightIcon size={16} weight="bold" />}>
                {modalItems.map((item, index) => {
                  const isLast = index === modalItems.length - 1;

                  return (
                    <BreadcrumbItem
                      key={`${item.text}-${index}`}
                      isCurrentPage={isLast}>
                      <BreadcrumbLink
                        href={item.link || "#"}
                        color={isLast ? "textPrimary" : "textSecondary"}
                        _hover={{
                          textDecoration: "none",
                          color: "brand.500",
                        }}>
                        <Flex align="center" gap={2}>
                          {item.icon && <Box display="flex">{item.icon}</Box>}

                          <Text
                            fontSize="sm"
                            fontWeight={isLast ? "600" : "500"}
                            textTransform="capitalize">
                            {item.text}
                          </Text>
                        </Flex>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  );
                })}
              </Breadcrumb>
            )}
          </Flex>
        )}

        <ModalBody px={0} pb={0}>
          {children}
        </ModalBody>

        {modalFooter && (
          <ModalFooter
            px={0}
            pt={6}
            pb={0}
            mt={6}
            borderTop="1px solid"
            borderColor="borderStructural">
            {modalFooter}
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};
