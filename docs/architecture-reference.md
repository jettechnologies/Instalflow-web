# InstalFlow Frontend Architecture Reference

This document captures the current architectural patterns used in the frontend codebase and should be treated as a practical reference for extending the app consistently.

## 1. Core stack and architectural direction

The app is built around a React 19 + TypeScript frontend with a route-driven, component-oriented structure.

### Primary libraries

- React: 19.1.0
- Chakra UI: 2.x with custom theme extension
- TanStack Router: 1.170.15
- TanStack React Query: 5.83.0
- Formik: 2.4.6 with Yup validation
- Zustand: 5.0.14 is installed, but the current implementation does not rely on a dedicated Zustand store
- Framer Motion and Phosphor/Lucide icons for UI motion and iconography

### Overall architecture style

- The app is organized around feature areas such as auth, company, products, marketer, customer, and shared UI.
- Routing is file-based and nested.
- Server state is centralized with TanStack Query.
- UI state is split between local React state, shared context, URL search state, and browser storage helpers.
- The codebase favors reusable wrappers over one-off UI primitives.

---

## 2. Provider and app shell structure

The application shell is assembled in [src/main.tsx](src/main.tsx).

### Provider order

1. ChakraProvider with the custom theme
2. ToastProvider for global feedback
3. AuthProvider for authentication and session state
4. TanStackQueryProvider for server-state infrastructure
5. RouterProvider with TanStack Router context

This ordering is important because:

- auth state is needed by routing guards
- query client context is required by route loaders and data hooks
- toast feedback is used by mutations and query failures

### Key providers

- [src/context/auth-provider.tsx](src/context/auth-provider.tsx): owns auth state, login/logout/refresh flows, and token persistence.
- [src/context/toast-provider.tsx](src/context/toast-provider.tsx): exposes a global toast API for success, error, warning, and info feedback.
- [src/providers/tanstack-provider.tsx](src/providers/tanstack-provider.tsx): creates the QueryClient once, wires mutation-toasts and invalidation behavior, and mounts React Query Devtools.

---

## 3. State management model

The app uses a layered state strategy instead of a single global store.

### 3.1 Local UI state

Use local state when the state is only relevant to one component or a small subtree.

Typical examples:

- modal visibility with Chakra’s useDisclosure
- form state with Formik
- temporary input state inside UI components
- component-specific loading or selected item state

Examples:

- [src/containers/company/admin-overview.tsx](src/containers/company/admin-overview.tsx) uses local modal visibility and component state for the modal trigger.
- [src/containers/onboarding-flow.tsx](src/containers/onboarding-flow.tsx) uses local state for the onboarding step data while wiring the URL view state.

### 3.2 Global app state

Use context for cross-cutting concerns that should be globally available and are not suitable for URL or server state.

Current global state usage:

- Authentication state lives in [src/context/auth-provider.tsx](src/context/auth-provider.tsx).
- Toast state lives in [src/context/toast-provider.tsx](src/context/toast-provider.tsx).
- Router context is injected from [src/main.tsx](src/main.tsx) and is consumed by route guards and navigation helpers.

This is the preferred pattern when the state should be shared by many branches of the app but does not need a dedicated store abstraction.

### 3.3 URL state

Use URL state for navigation-sensitive and shareable state, especially filters, pagination, onboarding steps, and redirect targets.

The app uses TanStack Router search validation and a custom search-param updater:

- [src/hooks/context/useSearchParams.tsx](src/hooks/context/useSearchParams.tsx)
- [src/routes/(auth)/login.tsx](<src/routes/(auth)/login.tsx>)
- [src/routes/(auth)/company-onboarding.tsx](<src/routes/(auth)/company-onboarding.tsx>)
- [src/routes/\_authenticated/\_layout.tsx](src/routes/_authenticated/_layout.tsx)

Good use cases:

- pagination and filters
- current onboarding step
- redirect target after authentication
- route-specific modal state that should survive refresh/navigation

### 3.4 Browser storage for persistence

Use browser storage sparingly for values that need to survive refreshes but do not belong in server state.

Current examples:

- [src/store/session-store/onboarding-session.ts](src/store/session-store/onboarding-session.ts) stores onboarding intent data in sessionStorage.
- [src/utils/helpers.ts](src/utils/helpers.ts) provides generic localStorage and sessionStorage helpers for transient persistence.

This is appropriate for:

- onboarding state between steps
- short-lived recovery data
- data that should not be fetched repeatedly from the server

### Decision rule

- Use local state for ephemeral UI details.
- Use context for shared cross-cutting concerns.
- Use URL state for navigationally meaningful state.
- Use browser storage only for persistence across refreshes.
- Use server state for data coming from the API.

---

## 4. Server state management

Server state is managed through TanStack Query v5.

### 4.1 Query layer organization

The codebase separates API call implementations and query helpers into clear folders:

- [src/services/queries](src/services/queries)
- [src/services/tanstack-queries](src/services/tanstack-queries)
- [src/services/mutations](src/services/mutations)
- [src/services/tanstack-mutations](src/services/tanstack-mutations)

This separation keeps:

- endpoint implementations separate from hook logic
- query options reusable across containers and routes
- mutation hooks easy to reuse from multiple screens

### 4.2 Centralized query keys

Query keys are centralized in [src/services/query-keys.ts](src/services/query-keys.ts).

This is the preferred pattern because it:

- prevents duplicate key shapes
- makes invalidation predictable
- keeps cache behavior consistent for list, detail, and relationship queries

Examples:

- products list and detail keys
- admin and marketer management keys
- subscription and installment-related keys

### 4.3 Query usage pattern

Queries are typically created with `useQuery` and query options created in [src/services/tanstack-queries](src/services/tanstack-queries).

Example pattern:

- [src/containers/products/list.tsx](src/containers/products/list.tsx)
- [src/containers/products/details.tsx](src/containers/products/details.tsx)
- [src/containers/company/admin-overview.tsx](src/containers/company/admin-overview.tsx)

The common pattern is:

- define query options once
- share them between route loaders and components
- use `select` when the component only needs a reduced shape of the response

### 4.4 Mutation usage pattern

Mutations are wrapped in dedicated hooks under [src/services/tanstack-mutations](src/services/tanstack-mutations).

Examples:

- [src/services/tanstack-mutations/catalog.ts](src/services/tanstack-mutations/catalog.ts)
- [src/services/tanstack-mutations/staff-maanagement.ts](src/services/tanstack-mutations/staff-maanagement.ts)
- [src/services/tanstack-mutations/auth.ts](src/services/tanstack-mutations/auth.ts)

The mutation hooks consistently:

- call the API mutation function
- surface success or error feedback
- set `meta.invalidatesQuery` for cache invalidation
- optionally trigger toasts from `onSuccess` or `onError`

---

## 5. Data manipulation flow: queries, mutations, and cache invalidation

The app follows a consistent data flow for mutations.

### 5.1 Query flow

1. Route or component requests a query option.
2. TanStack Query caches the result under a stable key.
3. Components read from the cache and optionally transform the data.
4. If the route was preloaded, the data is available immediately on navigation.

### 5.2 Mutation flow

1. A component calls a mutation hook such as `useCreateCategory` or `useCreateInstallmentPlan`.
2. The mutation runs through the API service layer.
3. On success or error, the app surfaces feedback.
4. The provider invalidates the specified query key automatically.

### 5.3 Invalidation strategy

Invalidation is centralized in [src/providers/tanstack-provider.tsx](src/providers/tanstack-provider.tsx).

The provider uses the mutation metadata field `invalidatesQuery` to invalidate the relevant cache entry after a mutation settles. This avoids scattering invalidation logic across components.

Example from [src/services/tanstack-mutations/catalog.ts](src/services/tanstack-mutations/catalog.ts):

- product mutations invalidate product detail or product list queries
- category mutations invalidate category query keys
- gallery mutations invalidate the gallery query for the product

### 5.4 Prefetching strategy

Prefetching is handled in two places:

- route loaders for full-page data preloading
- the custom hook [src/hooks/prefetch-query-data.tsx](src/hooks/prefetch-query-data.tsx) for component-level prefetching

Route loader examples:

- [src/routes/\_authenticated/\_layout/company/\_layout/products/index.tsx](src/routes/_authenticated/_layout/company/_layout/products/index.tsx)
- [src/routes/\_authenticated/\_layout/company/\_layout/products/$productId/$product-name/index.tsx](src/routes/_authenticated/_layout/company/_layout/products/$productId/$product-name/index.tsx)

Component-level prefetch examples:

- [src/containers/company/admin-overview.tsx](src/containers/company/admin-overview.tsx)
- [src/containers/company/marketer-overview.tsx](src/containers/company/marketer-overview.tsx)

Recommended rule:

- prefetch for route-level data that should appear immediately on navigation
- use hover or interaction-based prefetching for adjacent pages or pagination state
- rely on normal query caching for most data that does not need immediate readiness

---

## 6. Theming and visual system

The visual system is built on Chakra UI and a custom theme defined in [src/theme.ts](src/theme.ts).

### 6.1 Theme structure

The theme file defines:

- a dark color mode configuration
- semantic token values for background, border, text, and status colors
- custom brand colors and a purple gradient
- component-level defaults for Button, Input, FormLabel, and Heading

### 6.2 Core design tokens

The theme uses a compact token set centered around:

- background layers: layer1 and layer2
- structural borders
- brand purple accent
- semantic status colors for success, warning, danger, and info

The token values are intentionally consistent and reused across components.

### 6.3 UI styling conventions

- Most surfaces use a layered dark UI: background layer 1 for main surfaces and layer 2 for elevated surfaces.
- Primary action styling uses the brand gradient by default.
- Inputs and form controls inherit the same rounded, bordered treatment from the theme.
- The app uses CSS variables derived from the theme in several places, especially in components that were built before the theme tokens became fully standardized.

### 6.4 Global styling layer

Global styling is defined in [style/globals.scss](style/globals.scss) and supporting variables in [style/\_variables.scss](style/_variables.scss).

The style system is intentionally lightweight and mostly relies on Chakra theme props rather than large custom CSS modules.

---

## 7. Modal architecture

The app uses a reusable modal shell to keep dialogs consistent.

### 7.1 Base modal wrapper

The base component is [src/layouts/modal-layout/modal.tsx](src/layouts/modal-layout/modal.tsx).

It centralizes:

- modal size and padding
- consistent header/body/footer structure
- close button behavior
- Chakra styling tokens for borders, spacing, and dark surfaces

### 7.2 How to create a new modal

Create a feature-specific wrapper component that uses the shared modal shell and injects the feature-specific content.

Examples:

- [src/layouts/modal-layout/create-admin.tsx](src/layouts/modal-layout/create-admin.tsx)
- [src/layouts/modal-layout/create-plan-modal.tsx](src/layouts/modal-layout/create-plan-modal.tsx)
- [src/layouts/modal-layout/force-password-change.tsx](src/layouts/modal-layout/force-password-change.tsx)

### 7.3 Modal pattern in the app

The pattern is:

1. Use the feature-specific modal component inside a container or page.
2. Control visibility with Chakra’s `useDisclosure` or route-driven conditional rendering.
3. Keep form state local to the modal unless the data needs to be shared elsewhere.
4. Run the mutation and close the modal on success.

This makes common modal behaviors predictable and reduces UI drift across the product.

---

## 8. Form architecture

Forms are built around Formik + Yup with a small set of shared field primitives.

### 8.1 Core form strategy

The app uses:

- Formik for form state and submission lifecycle
- Yup schemas for validation rules
- shared field components for consistent UI and behavior

### 8.2 Shared form components

The reusable field system lives in [src/components/forms](src/components/forms).

Current components include:

- [src/components/forms/input-field.tsx](src/components/forms/input-field.tsx): text, password, textarea, switch, and select wrappers built on Formik field bindings
- [src/components/forms/select.tsx](src/components/forms/select.tsx): a more advanced select wrapper that supports both Formik-bound and standalone usage
- [src/components/forms/datetime-picker.tsx](src/components/forms/datetime-picker.tsx)
- [src/components/forms/multi-date-picker.tsx](src/components/forms/multi-date-picker.tsx)
- [src/components/forms/react-dropzone.tsx](src/components/forms/react-dropzone.tsx)

### 8.3 Optional Formik integration

The hook [src/hooks/context/useOptionalFormikContext.tsx](src/hooks/context/useOptionalFormikContext.tsx) allows components to work both inside and outside a Formik form. This is valuable because several UI components need to be reusable in both embedded and standalone contexts.

### 8.4 Form examples

Examples include:

- [src/components/auth/login-form.tsx](src/components/auth/login-form.tsx)
- [src/layouts/modal-layout/create-plan-modal.tsx](src/layouts/modal-layout/create-plan-modal.tsx)
- [src/layouts/modal-layout/force-password-change.tsx](src/layouts/modal-layout/force-password-change.tsx)

The preferred form pattern is:

- keep validation schemas in the shared schema layer when reusable
- use the shared field components instead of writing one-off Chakra form markup
- keep submission state and success/error handling in the component or mutation hook

---

## 9. Routing and role-based UI hierarchy

Routing is handled through TanStack Router with file-based route definitions.

### 9.1 Route structure

The route tree is split into:

- public/auth routes in [src/routes/(auth)](<src/routes/(auth)>)
- protected routes in [src/routes/\_authenticated](src/routes/_authenticated)
- role-specific route branches under [src/routes/\_authenticated/\_layout](src/routes/_authenticated/_layout)

The route hierarchy is designed so that:

- the root handles app-wide providers and context
- the authenticated layout wraps protected pages in the dashboard shell
- role-specific route folders separate the UI for the different product surfaces

### 9.2 Authentication guard

The authenticated route group is guarded in [src/routes/\_authenticated.tsx](src/routes/_authenticated.tsx), which redirects unauthenticated users to login.

### 9.3 Role-based navigation and route access

The navigation shell is defined in [src/layouts/dashboard-layout.tsx](src/layouts/dashboard-layout.tsx).

Roles are typed in [src/utils/types/auth.ts](src/utils/types/auth.ts) and mapped to different navigation items:

- COMPANY
- ADMIN
- MARKETER
- CUSTOMER

The route-level guard in [src/routes/\_authenticated/\_layout/company/\_layout.tsx](src/routes/_authenticated/_layout/company/_layout.tsx) adds an additional layer of route access control for company routes.

### 9.4 Separation of UI hierarchy

The UI hierarchy is separated in three layers:

1. App shell and global providers
2. Feature layout and role-based navigation
3. Feature-specific containers, components, and modals

This structure keeps the overall app easy to reason about and prevents role-specific screens from bleeding into one another.

---

## 10. Recommended conventions for future work

To keep the codebase consistent as it grows, follow these principles:

- Prefer shared hooks and wrappers over ad-hoc implementations.
- Keep API calls in the service layer, not inside components.
- Use TanStack Query for all server data and keep query keys centralized.
- Use mutation metadata for invalidation instead of manually calling `invalidateQueries` at the component level whenever possible.
- Keep UI state local unless it needs to be shared.
- Use URL state for anything navigation-driven or filter-driven.
- Use the shared modal and form systems for new flows.
- Keep role-specific routing explicit and avoid mixing role UI into the same route tree without a guard.

---

## 11. Practical summary

If you need to add a new feature, the default pattern in this codebase is:

1. Add a route under the appropriate role folder.
2. Create or reuse a container component for the page.
3. Fetch or prefetch data with query options and route loaders.
4. Use a mutation hook for writes.
5. Invalidate the relevant query key through mutation metadata.
6. Reuse the shared modal and form components for UI consistency.

That pattern is already the dominant architecture of the application and should remain the default approach for future work.
