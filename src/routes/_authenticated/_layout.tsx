import { DashboardLayout } from "@layouts/dashboard-layout";
import { ForcePasswordChangeModal } from "@layouts/modal-layout/force-password-change";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import * as Yup from "yup";

export const LoginSearchSchema = Yup.object({
  forceChangePassword: Yup.boolean().optional(),
});

export const Route = createFileRoute("/_authenticated/_layout")({
  validateSearch: (search) =>
    LoginSearchSchema.validateSync(search, {
      abortEarly: false,
      stripUnknown: true,
    }),
  loaderDeps: ({ search }) => {
    return {
      forceChangePassword: search.forceChangePassword,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { forceChangePassword } = Route.useLoaderDeps();

  return (
    <DashboardLayout>
      <Outlet />
      {forceChangePassword && <ForcePasswordChangeModal />}
    </DashboardLayout>
  );
}
