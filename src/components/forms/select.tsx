import React from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Flex,
  Box,
  Text,
} from "@chakra-ui/react";
import makeAnimated from "react-select/animated";
import Select, {
  type MenuPlacement,
  type MultiValue,
  type SingleValue,
} from "react-select";
// import { tokens } from "../../theme";
import { tokens } from "@theme";
import CreatableSelect from "react-select/creatable";
import { useOptionalFormikField } from "@hooks/context/useOptionalFormikContext";
import { useField } from "formik";

const animatedComponent = makeAnimated();

export interface Option {
  label: string;
  value: number | string;
  icon?: React.ReactElement;
}

interface OptionalSelectFieldProps {
  /** Optional. Only provide this when the field lives inside a <Formik> form. */
  name?: string;
  placeholder?: string;
  options: Option[];
  onChange?: (selectedOption: Option | Option[] | null) => void;
  defaultValue?: string | number;
  width?: string;
  height?: string;
  fontSize?: string;
  menuWidth?: string;
  label?: string;
  labelColor?: string;
  labelInfo?: string;
  radius?: string;
  noBorder?: boolean;
  fontWeight?: string;
  multi?: "yes" | "no";
  isDisabled?: boolean;
  icon?: React.ReactElement;
  outlineColor?: string;
  background?: string;
  menuBg?: string;
  /** Only consulted when the field is NOT bound to Formik (no name / no <Formik> ancestor). */
  isInvalid?: boolean;
  errorMessage?: string;
}

const buildSelectStyles = ({
  height,
  fontSize,
  menuBg,
  menuWidth,
}: Pick<SelectFieldProps, "height" | "fontSize" | "menuBg" | "menuWidth">) => ({
  control: (base: any, state: any) => ({
    ...base,
    height: height ?? "44px",
    minHeight: height ?? "44px",
    fontSize: fontSize ?? "14px",
    background: "transparent",
    border: "none",
    boxShadow: "none",
    borderRadius: 0,
    cursor: state.isDisabled ? "not-allowed" : "pointer",
  }),
  valueContainer: (base: any) => ({
    ...base,
    padding: "0 12px",
    color: tokens.text.primary,
  }),
  singleValue: (base: any) => ({
    ...base,
    color: tokens.text.primary,
    fontSize: fontSize ?? "14px",
  }),
  multiValue: (base: any) => ({
    ...base,
    background: `${tokens.brand.primary}33`,
    borderRadius: "6px",
  }),
  multiValueLabel: (base: any) => ({
    ...base,
    color: tokens.text.primary,
    fontSize: "13px",
    padding: "2px 6px",
  }),
  multiValueRemove: (base: any) => ({
    ...base,
    color: tokens.text.secondary,
    borderRadius: "0 6px 6px 0",
    ":hover": {
      background: `${tokens.status.danger}33`,
      color: tokens.status.danger,
    },
  }),
  input: (base: any) => ({
    ...base,
    color: tokens.text.primary,
    fontSize: fontSize ?? "14px",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: tokens.text.placeholder,
    fontSize: fontSize ?? "14px",
  }),
  dropdownIndicator: (base: any) => ({
    ...base,
    color: tokens.text.secondary,
    padding: "0 8px",
    ":hover": { color: tokens.text.primary },
  }),
  clearIndicator: (base: any) => ({
    ...base,
    color: tokens.text.secondary,
    ":hover": { color: tokens.status.danger },
  }),
  indicatorSeparator: () => ({ display: "none" }),
  menu: (base: any) => ({
    ...base,
    background: menuBg ?? tokens.bg.layer2,
    border: `1px solid ${tokens.border.structural}`,
    borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.48)",
    zIndex: 9999,
    width: menuWidth ?? "100%",
    overflow: "hidden",
  }),
  menuList: (base: any) => ({
    ...base,
    padding: "4px",
    "&::-webkit-scrollbar": { width: "4px" },
    "&::-webkit-scrollbar-track": { background: "transparent" },
    "&::-webkit-scrollbar-thumb": {
      background: tokens.border.structural,
      borderRadius: "4px",
    },
  }),
  option: (base: any, state: any) => ({
    ...base,
    background: state.isSelected
      ? `${tokens.brand.primary}33`
      : state.isFocused
        ? tokens.border.structural
        : "transparent",
    color: state.isSelected ? tokens.text.primary : tokens.text.secondary,
    fontSize: fontSize ?? "14px",
    borderRadius: "8px",
    padding: "8px 12px",
    cursor: "pointer",
    ":active": { background: `${tokens.brand.primary}22` },
  }),
  noOptionsMessage: (base: any) => ({
    ...base,
    color: tokens.text.muted,
    fontSize: "14px",
  }),
  menuPortal: (base: any) => ({ ...base, zIndex: 1600 }),
});

export const OptionalSelectField = ({
  options,
  placeholder,
  onChange,
  defaultValue,
  width,
  height,
  fontSize,
  menuBg,
  label,
  labelColor,
  menuWidth,
  radius,
  name,
  labelInfo,
  noBorder,
  multi,
  fontWeight,
  icon,
  outlineColor,
  background,
  isDisabled,
  isInvalid: isInvalidProp,
  errorMessage,
  ...props
}: OptionalSelectFieldProps) => {
  const isMulti = multi === "yes";

  // Binds to Formik only when `name` is set AND a <Formik> ancestor exists.
  // Otherwise behaves as a self-contained, uncontrolled-by-default select.
  const field = useOptionalFormikField<string | number | (string | number)[]>({
    name,
    initialValue: defaultValue,
  });

  const instanceId = React.useId();
  const [isMounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const isInvalid = field.isFormikBound
    ? Boolean(field.touched && field.error)
    : Boolean(isInvalidProp);

  const errorToShow = field.isFormikBound
    ? (field.error as string | undefined)
    : errorMessage;

  const handleChange = (selected: any) => {
    if (isMulti) {
      const values = Array.isArray(selected)
        ? selected.map((opt: Option) => opt.value)
        : [];
      field.setValue(values);
    } else {
      field.setValue(selected?.value ?? "");
    }
    onChange?.(selected as Option | Option[] | null);
  };

  const handleBlur = () => {
    if (field.isFormikBound) field.setTouched();
  };

  const selectedValue = isMulti
    ? options.filter(
        (opt) =>
          Array.isArray(field.value) &&
          (field.value as (string | number)[]).includes(opt.value)
      )
    : (options.find((opt) => opt.value === field.value) ?? null);

  if (!isMounted) return null;

  return (
    <FormControl isInvalid={isInvalid} width={width ?? "100%"}>
      {label && (
        <FormLabel
          htmlFor={name ?? instanceId}
          color={labelColor ?? "textSecondary"}
          fontSize="12px"
          fontWeight={fontWeight ?? 500}
          mb="6px">
          {label}
          {labelInfo && (
            <Text as="span" color="statusDanger" ml="4px" display="inline">
              *{labelInfo}
            </Text>
          )}
        </FormLabel>
      )}

      <Flex
        alignItems="center"
        borderRadius={radius ?? "12px"}
        border={noBorder ? "none" : "1px solid"}
        borderColor={
          noBorder
            ? "transparent"
            : isInvalid
              ? "statusDanger"
              : (outlineColor ?? "borderStructural")
        }
        bg={background ?? "bgLayer1"}
        overflow="hidden"
        transition="border-color 0.15s ease, box-shadow 0.15s ease"
        _focusWithin={
          noBorder
            ? {}
            : {
                borderColor: "brand.500",
                boxShadow: "0 0 0 3px rgba(124,58,237,0.2)",
              }
        }
        _hover={noBorder ? {} : { borderColor: "#2B3647" }}>
        {icon && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
            pl="12px"
            color="textSecondary">
            {icon}
          </Box>
        )}

        <Box flex="1" minW={0}>
          <Select
            {...props}
            inputId={name ?? instanceId}
            instanceId={instanceId}
            isMulti={isMulti}
            isDisabled={isDisabled}
            value={selectedValue}
            onChange={handleChange}
            onBlur={handleBlur}
            menuPortalTarget={
              typeof document !== "undefined" ? document.body : undefined
            }
            menuPosition="fixed"
            components={animatedComponent}
            placeholder={placeholder}
            options={options}
            noOptionsMessage={() => (
              <Text color="textMuted" fontSize="14px">
                No options found
              </Text>
            )}
            formatOptionLabel={(option: Option) => (
              <Flex alignItems="center" gap="8px">
                {option.icon && (
                  <Box display="flex" flexShrink={0} color="textSecondary">
                    {option.icon}
                  </Box>
                )}
                <Text fontSize={fontSize ?? "14px"} color="textPrimary">
                  {option.label}
                </Text>
              </Flex>
            )}
            styles={buildSelectStyles({ height, fontSize, menuBg, menuWidth })}
          />
        </Box>
      </Flex>

      <FormErrorMessage fontSize="12px" color="statusDanger">
        {errorToShow}
      </FormErrorMessage>
    </FormControl>
  );
};

const LABEL_BASE = {
  fontSize: "12px",
  fontWeight: 500,
  mb: "6px",
  color: "textSecondary",
} as const;

export interface Option {
  label: string;
  value: number | string;
  icon?: React.ReactElement;
}

interface SelectFieldProps {
  name: string;
  placeholder?: string;
  options: Option[];
  onChange?: (selectedOption: Option | Option[]) => void;
  defaultValue?: string | number;
  width?: string;
  height?: string;
  fontSize?: string;
  menuWidth?: string;
  label?: string;
  labelColor?: string;
  labelInfo?: string;
  radius?: string;
  noBorder?: boolean;
  fontWeight?: string;
  multi?: "yes" | "no";
  isDisabled?: boolean;
  icon?: React.ReactElement;
  outlineColor?: string;
  background?: string;
  menuBg?: string;
}

export const SelectField = ({
  options,
  placeholder,
  onChange,
  defaultValue,
  width,
  height,
  fontSize,
  menuBg,
  label,
  labelColor,
  menuWidth,
  radius,
  name,
  labelInfo,
  noBorder,
  multi,
  fontWeight,
  icon,
  outlineColor,
  background,
  isDisabled,
  ...props
}: SelectFieldProps) => {
  const defaultOption = options.find((option) => option.value === defaultValue);

  const [_, meta, helpers] = useField(name);
  const { value } = meta;

  const instanceId = React.useId();
  const [isMounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const isInvalid = Boolean(meta.touched && meta.error);

  const handleChange = (selected: any) => {
    if (multi === "yes") {
      helpers.setValue(selected);
    } else {
      helpers.setValue(selected?.value ?? "");
    }
    onChange?.(selected as Option | Option[]);
  };

  const selectedValue =
    multi === "yes"
      ? value
      : (options.find((opt) => opt.value === value) ?? null);

  if (!isMounted) return null;

  return (
    <FormControl isInvalid={isInvalid} width={width ?? "100%"}>
      {label && (
        <FormLabel
          htmlFor={name}
          color={labelColor ?? LABEL_BASE.color}
          fontSize={LABEL_BASE.fontSize}
          fontWeight={fontWeight ?? LABEL_BASE.fontWeight}
          mb={LABEL_BASE.mb}>
          {label}
          {labelInfo && (
            <Text as="span" color="statusDanger" ml="4px" display="inline">
              *{labelInfo}
            </Text>
          )}
        </FormLabel>
      )}

      <Flex
        alignItems="center"
        borderRadius={radius ?? "12px"}
        border={noBorder ? "none" : "1px solid"}
        borderColor={
          noBorder
            ? "transparent"
            : isInvalid
              ? "statusDanger"
              : (outlineColor ?? "borderStructural")
        }
        bg={background ?? "bgLayer1"}
        overflow="hidden"
        transition="border-color 0.15s ease, box-shadow 0.15s ease"
        _focusWithin={
          noBorder
            ? {}
            : {
                borderColor: "brand.500",
                boxShadow: "0 0 0 3px rgba(124,58,237,0.2)",
              }
        }
        _hover={noBorder ? {} : { borderColor: "#2B3647" }}>
        {icon && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
            pl="12px"
            color="textSecondary">
            {icon}
          </Box>
        )}

        <Box flex="1" minW={0}>
          <Select
            {...props}
            instanceId={instanceId}
            isMulti={multi === "yes"}
            isDisabled={isDisabled}
            value={selectedValue}
            onChange={handleChange}
            onBlur={() => helpers.setTouched(true)}
            menuPortalTarget={
              typeof document !== "undefined" ? document.body : undefined
            }
            menuPosition="fixed"
            components={animatedComponent}
            placeholder={placeholder}
            options={options}
            defaultValue={defaultOption}
            noOptionsMessage={() => (
              <Text color="textMuted" fontSize="14px">
                No options found
              </Text>
            )}
            formatOptionLabel={(option: Option) => (
              <Flex alignItems="center" gap="8px">
                {option.icon && (
                  <Box display="flex" flexShrink={0} color="textSecondary">
                    {option.icon}
                  </Box>
                )}
                <Text fontSize={fontSize ?? "14px"} color="textPrimary">
                  {option.label}
                </Text>
              </Flex>
            )}
            styles={buildSelectStyles({ height, fontSize, menuBg, menuWidth })}
          />
        </Box>
      </Flex>

      <FormErrorMessage fontSize="12px" color="statusDanger">
        {meta.error}
      </FormErrorMessage>
    </FormControl>
  );
};

interface CreateableSelectFieldProps {
  /** Optional. Only provide this when the field lives inside a <Formik> form. */
  name?: string;
  placeholder?: string;
  options: Option[];
  onChange?: (
    selectedOption: MultiValue<Option> | SingleValue<Option> | null
  ) => void;
  defaultValue?: Option | Option[];
  outlineColor?: string;
  width?: string;
  height?: string;
  caretColor?: string;
  background?: string;
  fontSize?: string;
  menuBg?: string;
  label?: string;
  labelColor?: string;
  radius?: string;
  menuWidth?: string;
  noBorder?: boolean;
  placement?: MenuPlacement;
  isMulti?: boolean;
  errorMessage?: string;
}

export const CreateableSelectField = ({
  options,
  placeholder,
  defaultValue,
  outlineColor,
  width,
  height,
  caretColor,
  background,
  fontSize,
  menuBg,
  label,
  labelColor,
  name,
  radius,
  menuWidth,
  noBorder,
  placement,
  onChange,
  isMulti,
  errorMessage,
  ...props
}: CreateableSelectFieldProps) => {
  // Binds to Formik only when `name` is set AND a <Formik> ancestor exists.
  const field = useOptionalFormikField<(string | number) | (string | number)[]>(
    {
      name,
      initialValue: isMulti ? [] : "",
    }
  );

  const id = React.useId();
  const [isMounted, setMounted] = React.useState(false);
  const fieldId = React.useMemo(() => `field-${name ?? id}`, [name, id]);

  React.useEffect(() => setMounted(true), []);

  const handleChange = (newValue: MultiValue<Option> | SingleValue<Option>) => {
    if (isMulti) {
      const values = Array.isArray(newValue)
        ? newValue.map((opt) => opt.value)
        : [];
      field.setValue(values);
    } else {
      field.setValue((newValue as Option | null)?.value ?? "");
    }
    onChange?.(newValue);
  };

  const handleBlur = () => {
    if (field.isFormikBound) field.setTouched();
  };

  const selectedValue = React.useMemo(() => {
    if (isMulti) {
      if (!Array.isArray(field.value)) return [];
      return (
        options?.filter((opt) =>
          (field.value as (string | number)[]).includes(opt.value)
        ) ?? []
      );
    }
    return options?.find((opt) => opt.value === field.value) ?? null;
  }, [field.value, isMulti, options]);

  const getNewOptionData = (inputValue: string): Option => {
    const slugify = (text: string) =>
      text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
    return { label: inputValue, value: slugify(inputValue) };
  };

  const errorToShow = field.isFormikBound
    ? (field.error as string | undefined)
    : errorMessage;

  return (
    <>
      {isMounted ? (
        <FormControl>
          {label && (
            <FormLabel
              htmlFor={fieldId}
              fontSize={{ lg: "16px", md: "14px", base: "14px" }}
              textTransform="capitalize"
              fontWeight="400"
              color={labelColor || ""}>
              {label}
            </FormLabel>
          )}

          <CreatableSelect
            {...props}
            inputId={fieldId}
            instanceId={id}
            isMulti={isMulti}
            value={selectedValue}
            options={options}
            defaultValue={defaultValue}
            placeholder={placeholder}
            menuPosition="fixed"
            menuPortalTarget={
              typeof document !== "undefined" ? document.body : undefined
            }
            noOptionsMessage={() => (
              <Text color="var(--text-primary)">No options found</Text>
            )}
            formatCreateLabel={(input) => `Select ${input}`}
            menuPlacement={placement || "bottom"}
            getNewOptionData={(inputValue) => getNewOptionData(inputValue)}
            onBlur={handleBlur}
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                margin: ".6em 0",
                height: height,
                width: width,
                fontSize: fontSize,
                border: noBorder
                  ? "none"
                  : `1px solid ${outlineColor}` ||
                    "1px solid var(--text-primary)",
                outline: "none",
                backgroundColor: background || "#fff",
                textTransform: "capitalize",
                "&:hover": {
                  cursor: "pointer",
                },
                boxShadow: "none",
                fontWeight: "400",
                borderRadius: radius || "8px",
              }),
              singleValue: (baseStyles) => ({
                ...baseStyles,
                fontSize: "14px",
                color: "var(--input-placeholder)",
              }),
              dropdownIndicator: (baseStyles) => ({
                ...baseStyles,
                color: caretColor || "var(--text-primary)",
              }),
              menuPortal: (baseStyles) => ({
                ...baseStyles,
                zIndex: 99999999,
              }),
              option: (baseStyles, state) => ({
                ...baseStyles,
                position: "relative",
                color: state.isSelected ? "#fff" : "var(--text-primary)",
                margin: ".3em 0",
                padding: ".3em .3em",
                borderRadius: "4px",
                transition: "all .3s ease-in-out",
                textTransform: "capitalize",
                "&:hover": {
                  cursor: "pointer",
                  background: "var(--pale)",
                },
                background: state.isSelected ? "var(--text-primary)" : "",
              }),
              placeholder: (baseStyles) => ({
                ...baseStyles,
                fontSize: fontSize || "14px",
                color: "var(--input-placeholder)",
              }),
              menu: (baseStyles) => ({
                ...baseStyles,
                padding: ".4em .6em",
                backgroundColor: menuBg || "#fff",
                position: "absolute",
                zIndex: 9999999999999,
                width: menuWidth || "",
              }),
              multiValue: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "var(--gray-100)",
                borderRadius: "6px",
              }),
              multiValueLabel: (baseStyles) => ({
                ...baseStyles,
                color: "var(--gray-700)",
                fontSize: "13px",
              }),
              multiValueRemove: (baseStyles) => ({
                ...baseStyles,
                color: "var(--gray-500)",
                "&:hover": {
                  backgroundColor: "var(--gray-200)",
                  color: "var(--gray-700)",
                },
              }),
              indicatorSeparator: (baseStyles) => ({
                ...baseStyles,
                display: "none",
              }),
            }}
            onChange={(option) => handleChange(option)}
          />

          {errorToShow ? (
            <Text color="var(--deep-blood)" fontSize="sm" pt=".3em">
              {errorToShow}
            </Text>
          ) : null}
        </FormControl>
      ) : null}
    </>
  );
};

// import { FormControl, Text, FormLabel, Flex, Box } from "@chakra-ui/react";
// import makeAnimated from "react-select/animated";
// import { useField } from "formik";
// import React from "react";
// import Select from "react-select";

// const animatedComponent = makeAnimated();

// export interface Option {
//   label: string;
//   value: number | string;
//   icon?: React.ReactElement;
// }

// interface SelectProps {
//   name: string;
//   placeholder?: string;
//   options: Option[];
//   onChange?: (selectedOption: Option) => void;
//   defaultValue: string | number | undefined;
//   outlineColor?: string;
//   width?: string;
//   height?: string;
//   caretColor?: string;
//   background?: string;
//   fontSize?: string;
//   menuBg?: string;
//   labelColor?: string;
//   label?: string;
//   radius?: string;
//   menuWidth?: string;
//   noBorder?: boolean;
//   fontWeight?: string;
//   labelInfo?: string;
//   multi?: "yes" | "no";
//   isDisabled?: boolean;
//   icon?: React.ReactElement;
// }

// export const SelectField = ({
//   options,
//   placeholder,
//   onChange,
//   defaultValue,
//   outlineColor,
//   width,
//   height,
//   caretColor,
//   background,
//   fontSize,
//   menuBg,
//   label,
//   labelColor,
//   menuWidth,
//   radius,
//   name,
//   labelInfo,
//   noBorder,
//   multi,
//   fontWeight,
//   icon,
//   ...props
// }: SelectProps) => {
//   const defaultOption = options.find((option) => option.value === defaultValue);

//   const [field, meta, helpers] = useField(name);
//   const { value } = meta;
//   const { setValue } = helpers;

//   // to bypass the hydration error
//   const id = Date.now().toString();
//   const [isMounted, setMounted] = React.useState<boolean>(false);
//   React.useEffect(() => setMounted(true), []);

//   const handleChange = (selectedOption: any) => {
//     if (multi === "yes") {
//       setValue(selectedOption);
//     } else {
//       setValue(selectedOption?.value || "");
//     }

//     if (onChange) {
//       onChange(selectedOption as Option);
//     }
//   };

//   return (
//     <>
//       {isMounted && (
//         <FormControl>
//           {label && (
//             <FormLabel
//               fontSize="14px"
//               lineHeight="20px"
//               fontWeight="400"
//               color={labelColor || "#211E1D"}>
//               {label}{" "}
//               {labelInfo && (
//                 <Text as="span" color="var(--deep-blood)">
//                   *{labelInfo}
//                 </Text>
//               )}
//             </FormLabel>
//           )}

//           <Flex
//             width={width || "100%"}
//             alignItems="center"
//             borderRadius={radius || "8px"}
//             border={noBorder ? "none" : `1px solid ${outlineColor || "#ccc"}`}
//             bg={background || "#fff"}
//             overflow="hidden">
//             {icon && (
//               <Box
//                 display="flex"
//                 alignItems="center"
//                 justifyContent="center"
//                 width="20px"
//                 height={height || "20px"}
//                 bg={background || "#f5f5f5"}
//                 ml="12px">
//                 {icon}
//               </Box>
//             )}
//             <Box flex="1">
//               <Select
//                 {...field}
//                 {...props}
//                 isMulti={multi === "yes"}
//                 value={options.find((opt) => opt.value === value) || null}
//                 instanceId={id}
//                 onChange={handleChange}
//                 menuPortalTarget={document.body}
//                 menuPosition="fixed"
//                 components={animatedComponent}
//                 placeholder={placeholder}
//                 options={options}
//                 defaultValue={defaultOption}
//                 noOptionsMessage={() => (
//                   <Text color="var(--text-primary)">No options found</Text>
//                 )}
//                 formatOptionLabel={(option: Option) => (
//                   <Flex alignItems="center">
//                     {option.icon && (
//                       <Box mr="8px" display="flex">
//                         {option.icon}
//                       </Box>
//                     )}
//                     <span>{option.label}</span>
//                   </Flex>
//                 )}
//                 styles={{
//                   control: (baseStyles) => ({
//                     ...baseStyles,
//                     height,
//                     fontSize,
//                     border: "none",
//                     boxShadow: "none",
//                     borderRadius: "0",
//                     background: "transparent",
//                   }),
//                   menu: (baseStyles) => ({
//                     ...baseStyles,
//                     zIndex: 9999,
//                     backgroundColor: menuBg || "#fff",
//                     width: menuWidth || "auto",
//                   }),
//                   placeholder: (baseStyles) => ({
//                     ...baseStyles,
//                     fontSize: fontSize || "14px",
//                     color: "var(--input-placeholder)",
//                   }),
//                   menuPortal: (baseStyles) => ({
//                     ...baseStyles,
//                     zIndex: 1600,
//                   }),
//                 }}
//               />
//             </Box>
//           </Flex>

//           {meta.touched && meta.error && (
//             <Text color="var(--deep-blood)" fontSize="sm" mt="-.4em">
//               {meta.error}
//             </Text>
//           )}
//         </FormControl>
//       )}
//     </>
//   );
// };
