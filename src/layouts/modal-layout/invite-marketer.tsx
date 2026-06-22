import { Form, Formik } from "formik";
import { ModalLayout } from "./modal";
import { createMarketerSchema } from "@utils/schema";
import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { InputField } from "@components/forms/input-field";
import { useState } from "react";
import { useInviteMarketer } from "@services/tanstack-mutations/staff-maanagement";
import { UserSuccessScreen, type UserInfo } from "@components/admin";

interface InviteMarketerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteMarketer = ({ isOpen, onClose }: InviteMarketerProps) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const { mutateAsync: inviteMarkter, isPending: isInviting } =
    useInviteMarketer();

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Invite marketer">
      <Formik
        initialValues={{
          name: "",
          email: "",
        }}
        validateSchema={createMarketerSchema}
        onSubmit={async (data) => {
          const response = await inviteMarkter(data);
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
                label="Marketer Name"
                type="text"
                placeholder="Enter a Marketers Name"
              />
              <InputField
                name="email"
                label="Marketer Email"
                type="email"
                placeholder="Enter Marketers Email"
              />
              <Box
                p={3}
                borderRadius="md"
                bg="rgba(6,182,212,0.08)"
                border="1px solid"
                borderColor="rgba(6,182,212,0.25)">
                <Text fontSize="11px" color="textSecondary" lineHeight="1.6">
                  An invite link is generated immediately. The marketer will
                  appear with INVITED status until they accept and complete
                  onboarding.
                </Text>
              </Box>
              <HStack spacing={3} pt={3} justifyContent="flex-end">
                <Button variant="ghostOutline" onClick={onClose} type="button">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={formik.isSubmitting && isInviting}
                  loadingText="Creating..">
                  Create Account
                </Button>
              </HStack>
            </VStack>
          ) : (
            <UserSuccessScreen
              user={userInfo!}
              onContinue={onClose}
              role="marketer"
            />
          );
        }}
      </Formik>
    </ModalLayout>
  );
};
