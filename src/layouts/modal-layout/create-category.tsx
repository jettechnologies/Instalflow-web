import { Form, Formik } from "formik";
import { ModalLayout } from "./modal";
import * as Yup from "yup";
import { useCreateCategory } from "@services/tanstack-mutations/catalog";
import { Button, VStack } from "@chakra-ui/react";
import { InputField } from "@components/forms/input-field";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const createCategorySchema = Yup.object({
  name: Yup.string().required("Category name is required"),
  description: Yup.string().optional(),
});

export const CreateCategoryModal = ({
  isOpen,
  onClose,
}: CreateCategoryModalProps) => {
  const { mutateAsync: createCategory, isPending: isCreating } =
    useCreateCategory();

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Category"
      size="md">
      <Formik
        initialValues={{
          name: "",
          description: undefined,
        }}
        validationSchema={createCategorySchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            await createCategory(values);
            resetForm();
            onClose();
          } catch (_) {}
        }}>
        {(formik) => (
          <Form>
            <VStack spacing={4}>
              <InputField
                name="name"
                type="text"
                label="Category Name"
                placeholder="Electronics"
              />
              <InputField
                name="description"
                type="text"
                label="Category Description"
                placeholder="Electronic gadgets and accessories for testing purposes"
              />
              <Button
                type="submit"
                w="full"
                isLoading={formik.isSubmitting || isCreating}
                loadingText="Creating...">
                Create Category
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </ModalLayout>
  );
};
