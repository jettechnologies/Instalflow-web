import { Form, Formik } from "formik";
import { ModalLayout } from "./modal";
import { createMarketerSchema } from "@utils/schema";
import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { InputField } from "@components/forms/input-field";
import { useState } from "react";
import { useCreateAdmin } from "@services/tanstack-mutations/staff-maanagement";
import { UserSuccessScreen, type UserInfo } from "@components/admin";

interface CreateAdminProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateAdmin = ({ isOpen, onClose }: CreateAdminProps) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const { mutateAsync: createAdmin, isPending: isCreating } = useCreateAdmin();

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Create admin">
      <Formik
        initialValues={{
          name: "",
          email: "",
        }}
        validateSchema={createMarketerSchema}
        onSubmit={async (data) => {
          const response = await createAdmin(data);
          const userInfo = {
            name: response.data.user.name,
            email: response.data.user.email,
            tempPassword: response.data.tempPassword,
            instruction: response.data.instructions,
          };

          setUserInfo(userInfo);
        }}>
        {(formik) => {
          return userInfo === null ? (
            <VStack as={Form} width="full" spacing={4} align="stretch">
              <InputField
                name="name"
                label="Admin Name"
                type="text"
                placeholder="Enter a Admin Name"
              />
              <InputField
                name="email"
                label="Admin Email"
                type="email"
                placeholder="Enter a Admin Name"
              />
              <Box
                p={3}
                borderRadius="md"
                bg="rgba(6,182,212,0.08)"
                border="1px solid"
                borderColor="rgba(6,182,212,0.25)">
                <Text fontSize="11px" color="textSecondary" lineHeight="1.6">
                  An account has been successfully created for the admin. A
                  notification email containing their temporary password has
                  been sent to their inbox.
                </Text>
              </Box>
              <HStack spacing={3} pt={3} justifyContent="flex-end">
                <Button variant="ghostOutline" onClick={onClose} type="button">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={formik.isSubmitting && isCreating}
                  loadingText="Creating..">
                  Create Account
                </Button>
              </HStack>
            </VStack>
          ) : (
            <UserSuccessScreen
              user={userInfo!}
              onContinue={onClose}
              role="admin"
            />
          );
        }}
      </Formik>
    </ModalLayout>
  );
};
