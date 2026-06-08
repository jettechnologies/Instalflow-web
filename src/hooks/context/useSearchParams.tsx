// Loosely return type for this custom hook

// import { useNavigate } from "@tanstack/react-router";

// /**
//  * Returns a stable setter that merges a single search-param key/value
//  * into the current URL without a full navigation.
//  *
//  * The generic is applied at *call-site* (the setter), not at hook level,
//  * so TanStack Router can resolve `prev` against the actual route search
//  * type rather than the wider TSearch bound — fixing the variance error.
//  */
// export function useUpdateSearchParam() {
//   const navigate = useNavigate();

//   return <TSearch extends Record<string, unknown>, K extends keyof TSearch>(
//     key: K,
//     value: TSearch[K]
//   ) => {
//     navigate({
//       to: ".",
//       search: (prev) => {
//         const next = { ...prev } as TSearch;

//         next[key] = (
//           Array.isArray(value)
//             ? (value as string[]).join(",")
//             : value != null
//               ? String(value)
//               : undefined
//         ) as TSearch[K];

//         return next;
//       },
//     });
//   };
// }

// strick return type for the custom hook

import { useNavigate } from "@tanstack/react-router";

type SearchValue = string | number | boolean | null | undefined | string[];

export function useUpdateSearchParam<
  TSearch extends Record<string, SearchValue>,
>() {
  const navigate = useNavigate();

  return <K extends keyof TSearch>(key: K, value: TSearch[K]) => {
    navigate({
      to: ".",
      search: (prev) => {
        const next = { ...(prev as unknown as TSearch) };

        next[key] = (
          Array.isArray(value)
            ? (value as string[]).join(",")
            : value != null
              ? String(value)
              : undefined
        ) as TSearch[K];

        return next as unknown as typeof prev;
      },
    });
  };
}
