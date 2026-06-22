import { Button, Center } from "@chakra-ui/react";
import { useAuth } from "@context/auth-provider";
import { useToastContext } from "@hooks/context";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_layout/marketer/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { logout } = useAuth();

  const { openToast } = useToastContext();

  return (
    <Center
      border="2px solid black"
      width="100vw"
      minHeight="100vh"
      bg="var(--brand-dark)">
      <Button
        type="submit"
        h="52px"
        borderRadius="12px"
        background="var(--brand-gradient)"
        color="white"
        fontSize="sm"
        fontWeight="700"
        _hover={{ opacity: 0.9 }}
        onClick={async () => {
          try {
            await logout();
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Something went wrong. Please try again.";

            openToast(errorMessage, "error");
          }
        }}
        mt={1}>
        Log out
      </Button>
    </Center>
  );
}
