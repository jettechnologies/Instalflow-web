import { useMemo } from "react";
import { Flex, HStack, Box, Button, Text } from "@chakra-ui/react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { OptionalSelectField } from "@components/forms/select";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  pageSizeOptions?: number[];
  onMouseEnter?: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  onMouseEnter,
  pageSizeOptions = [5, 10, 20, 30, 50],
}: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const pageNumbers = useMemo(() => {
    const delta = 1;
    const range: number[] = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(pageCount - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }
    return range;
  }, [currentPage, pageCount]);

  const pageButtonStyle = (isActive: boolean) => ({
    px: 3,
    minWidth: "32px",
    h: "32px",
    fontSize: "13px",
    borderRadius: "8px",
    bg: isActive ? "brand.500" : "bgLayer1",
    color: isActive ? "white" : "textSecondary",
    border: "1px solid",
    borderColor: isActive ? "brand.500" : "borderStructural",
    _hover: { bg: isActive ? "brand.600" : "whiteAlpha.100" },
  });

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      justify="space-between"
      align={{ base: "stretch", md: "center" }}
      gap={3}
      px="16px"
      py="12px"
      borderTop="1px solid"
      borderColor="borderStructural">
      <Text fontSize="13px" color="textSecondary">
        Page {currentPage} of {pageCount}
      </Text>

      <Flex
        direction={{ base: "column", sm: "row" }}
        align={{ base: "stretch", sm: "center" }}
        gap={3}>
        <Box minW={{ base: "auto", sm: "150px" }}>
          <OptionalSelectField
            key={itemsPerPage}
            options={pageSizeOptions.map((s) => ({
              label: `${s} per page`,
              value: s,
            }))}
            defaultValue={itemsPerPage}
            fontSize="13px"
            height="38px"
            onChange={(selectedOption: any) =>
              onItemsPerPageChange(Number(selectedOption.value))
            }
          />
        </Box>

        <HStack spacing={1.5} justify="center">
          <Button
            aria-label="Previous page"
            variant="ghost"
            color="textSecondary"
            _hover={{ color: "textPrimary", bg: "whiteAlpha.100" }}
            onClick={() => onPageChange(currentPage - 1)}
            isDisabled={currentPage === 1}
            p={2}
            minWidth="32px"
            h="32px">
            <CaretLeft size={16} />
          </Button>

          <HStack spacing={1.5} display={{ base: "none", sm: "flex" }}>
            <Button
              onClick={() => onPageChange(1)}
              {...pageButtonStyle(currentPage === 1)}>
              1
            </Button>

            {pageNumbers[0] > 2 && (
              <Text color="textMuted" fontSize="13px">
                …
              </Text>
            )}

            {pageNumbers.map((page) => (
              <Button
                key={page}
                onClick={() => {
                  onPageChange(page);
                  onMouseEnter?.(page);
                }}
                {...pageButtonStyle(currentPage === page)}>
                {page}
              </Button>
            ))}

            {pageCount > 1 &&
              pageNumbers[pageNumbers.length - 1] < pageCount - 1 && (
                <Text color="textMuted" fontSize="13px">
                  …
                </Text>
              )}

            {pageCount > 1 && (
              <Button
                onClick={() => {
                  onPageChange(pageCount);
                  onMouseEnter?.(pageCount);
                }}
                {...pageButtonStyle(currentPage === pageCount)}>
                {pageCount}
              </Button>
            )}
          </HStack>

          <Button
            aria-label="Next page"
            variant="ghost"
            color="textSecondary"
            _hover={{ color: "textPrimary", bg: "whiteAlpha.100" }}
            onClick={() => {
              onPageChange(currentPage + 1);
              onMouseEnter?.(currentPage + 1);
            }}
            isDisabled={currentPage === pageCount}
            p={2}
            minWidth="32px"
            h="32px">
            <CaretRight size={16} />
          </Button>
        </HStack>
      </Flex>
    </Flex>
  );
}
