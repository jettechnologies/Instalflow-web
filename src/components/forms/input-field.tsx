import React from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  Box,
  Text,
  Textarea,
  Switch,
  Flex,
  Select,
  type InputProps as ChakraInputProps,
  type TextareaProps as ChakraTextareaProps,
  type FormControlProps,
  type CheckboxProps,
  chakra,
  useCheckbox,
} from "@chakra-ui/react";
import { useField } from "formik";
import { WarningCircle, Eye, EyeSlash, Check } from "@phosphor-icons/react";

type TextTransform = "uppercase" | "capitalize" | "lowercase" | "none";

const LABEL_BASE = {
  fontSize: "12px",
  fontWeight: 500,
  mb: "6px",
  color: "textSecondary",
} as const;

export interface CustomInputProps extends ChakraInputProps {
  name: string;
  type?: string;
  label?: string;
  labelInfo?: string;
  labelTextTransform?: TextTransform;
  labelColor?: string;
  required?: boolean;
  password?: boolean;
  placeholder?: string;
  radius?: string | number | Record<string, unknown>;
  boldLabel?: boolean;
  icon?: React.ReactElement;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputField = ({
  name,
  label,
  type = "text",
  radius,
  placeholder,
  password,
  labelInfo,
  labelColor,
  labelTextTransform = "none",
  boldLabel = false,
  icon,
  onChange,
  ...props
}: CustomInputProps) => {
  const [field, meta] = useField(name);
  const [show, setShow] = React.useState(false);
  const handleShow = React.useCallback(() => setShow((s) => !s), []);

  const isInvalid = Boolean(meta.touched && meta.error);
  const inputType = password && show ? "text" : type;
  const radiusOverride =
    radius !== undefined
      ? typeof radius === "string"
        ? radius
        : `${radius}px`
      : undefined;

  const sharedInputProps = {
    id: name,
    placeholder,
    borderRadius: radiusOverride,
    _placeholder: {
      color: "textMuted",
      fontSize: "14px",
      fontWeight: 400,
    },
    className: isInvalid ? "shake" : undefined,
    ...props,
    ...field,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      field.onChange(e);
      onChange?.(e);
    },
  };

  return (
    <FormControl width="100%" isInvalid={isInvalid}>
      {label && (
        <FormLabel
          htmlFor={name}
          textTransform={labelTextTransform}
          fontWeight={boldLabel ? 600 : LABEL_BASE.fontWeight}
          color={labelColor ?? LABEL_BASE.color}
          fontSize={LABEL_BASE.fontSize}
          mb={LABEL_BASE.mb}>
          {label}
          {labelInfo && (
            <Text as="span" color="statusDanger" display="inline" ml="4px">
              *{labelInfo}
            </Text>
          )}
        </FormLabel>
      )}

      {password ? (
        <InputGroup>
          {icon && (
            <InputLeftElement h="44px" w="44px">
              {icon}
            </InputLeftElement>
          )}
          <Input
            autoComplete="current-password"
            type={inputType}
            pl={icon ? "44px" : undefined}
            {...sharedInputProps}
          />
          <InputRightElement h="44px" w="44px">
            {isInvalid ? (
              <WarningCircle
                color="var(--chakra-colors-statusDanger)"
                size={18}
              />
            ) : (
              <Box onClick={handleShow} cursor="pointer">
                {show ? (
                  <Eye color="var(--chakra-colors-textSecondary)" size={18} />
                ) : (
                  <EyeSlash
                    color="var(--chakra-colors-textSecondary)"
                    size={18}
                  />
                )}
              </Box>
            )}
          </InputRightElement>
        </InputGroup>
      ) : (
        <InputGroup>
          {icon && (
            <InputLeftElement h="44px" w="44px">
              {icon}
            </InputLeftElement>
          )}
          <Input
            autoComplete="off"
            type={type}
            pl={icon ? "44px" : undefined}
            {...sharedInputProps}
          />
          {isInvalid && (
            <InputRightElement h="44px" w="44px" cursor="pointer">
              <WarningCircle
                color="var(--chakra-colors-statusDanger)"
                size={18}
              />
            </InputRightElement>
          )}
        </InputGroup>
      )}

      <FormErrorMessage fontSize="12px" color="statusDanger">
        {meta.error}
      </FormErrorMessage>
    </FormControl>
  );
};

interface TextAreaFieldProps extends ChakraTextareaProps {
  name: string;
  label?: string;
  labelColor?: string;
  height?: string;
  radius?: string | number | Record<string, unknown>;
  borderColor?: string;
  placeholder?: string;
}

export const TextAreaField = ({
  name,
  label,
  radius,
  placeholder,
  labelColor,
  height,
  borderColor,
  ...props
}: TextAreaFieldProps) => {
  const [field, meta] = useField(name);
  const isInvalid = Boolean(meta.touched && meta.error);

  return (
    <FormControl width="100%" isInvalid={isInvalid}>
      {label && (
        <FormLabel
          htmlFor={name}
          fontSize={LABEL_BASE.fontSize}
          fontWeight={LABEL_BASE.fontWeight}
          color={labelColor ?? LABEL_BASE.color}
          mb={LABEL_BASE.mb}>
          {label}
        </FormLabel>
      )}

      <Textarea
        id={name}
        placeholder={placeholder}
        borderRadius={
          radius
            ? typeof radius === "string"
              ? radius
              : `${radius}px`
            : "12px"
        }
        bg="bgLayer1"
        border="1px solid"
        borderColor={borderColor ?? "borderStructural"}
        color="textPrimary"
        _placeholder={{ color: "textMuted", fontSize: "14px" }}
        _hover={{ borderColor: "#2B3647" }}
        _focus={{
          borderColor: "brand.500",
          boxShadow: "0 0 0 3px rgba(124,58,237,0.2)",
          outline: "none",
        }}
        _invalid={{
          borderColor: "statusDanger",
          boxShadow: "0 0 0 3px rgba(239,68,68,0.18)",
        }}
        height={height ?? "200px"}
        fontSize="sm"
        className={isInvalid ? "shake" : undefined}
        {...props}
        {...field}
      />

      <FormErrorMessage fontSize="12px" color="statusDanger">
        {meta.error}
      </FormErrorMessage>
    </FormControl>
  );
};

type CustomSwitchProps = FormControlProps & {
  name: string;
  label?: string;
  labelColor?: string;
  labelWeight?: string | number;
  labelSize?: string | number;
  labelPosition?: "left" | "right";
  isRequired?: boolean;
  size?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const SwitchField = ({
  name,
  label,
  labelSize,
  labelWeight,
  labelColor,
  labelPosition = "left",
  isRequired = false,
  onChange,
  size,
  ...props
}: CustomSwitchProps) => {
  const [field, meta, helpers] = useField(name);
  const computedFontSize =
    typeof labelSize === "number" ? `${labelSize}px` : (labelSize ?? "12px");

  const labelEl = label ? (
    <FormLabel
      htmlFor={name}
      color={labelColor ?? "textSecondary"}
      fontSize={computedFontSize}
      fontWeight={labelWeight ?? LABEL_BASE.fontWeight}
      mb="0">
      {label}
      {isRequired && (
        <Text as="span" color="statusDanger" ml="4px">
          *
        </Text>
      )}
    </FormLabel>
  ) : null;

  return (
    <FormControl
      as={Flex}
      alignItems="center"
      gap="8px"
      maxW="fit-content"
      {...props}>
      {labelPosition === "left" && labelEl}

      <Switch
        id={name}
        isChecked={field.value}
        size={size ?? "md"}
        onChange={(e) => {
          helpers.setValue(e.target.checked);
          onChange?.(e);
        }}
        sx={{
          ".chakra-switch__track": {
            bg: field.value ? "brand.500" : "borderStructural",
            _checked: { bg: "brand.500" },
          },
          ".chakra-switch__thumb": {
            bg: "textPrimary",
          },
        }}
      />

      {labelPosition === "right" && labelEl}

      {meta.touched && meta.error && (
        <Text color="statusDanger" fontSize="12px" mt="4px">
          {meta.error}
        </Text>
      )}
    </FormControl>
  );
};

type SelectFieldProps = FormControlProps & {
  name: string;
  label?: string;
  labelColor?: string;
  options: Array<{ value: string | number; label: string }>;
  isRequired?: boolean;
  placeholder?: string;
};

export const ChakraSelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  labelColor,
  options,
  isRequired = false,
  placeholder = "Select an option",
  ...props
}) => {
  const [field, meta, helpers] = useField(name);
  const isInvalid = Boolean(meta.touched && meta.error);

  return (
    <FormControl isInvalid={isInvalid} {...props}>
      {label && (
        <FormLabel
          htmlFor={name}
          color={labelColor ?? LABEL_BASE.color}
          fontSize={LABEL_BASE.fontSize}
          fontWeight={LABEL_BASE.fontWeight}
          mb={LABEL_BASE.mb}>
          {label}
          {isRequired && (
            <Text as="span" color="statusDanger" ml="4px">
              *
            </Text>
          )}
        </FormLabel>
      )}

      <Select
        id={name}
        name={name}
        value={field.value}
        onBlur={field.onBlur}
        onChange={(e) => helpers.setValue(e.target.value)}
        h="44px"
        bg="bgLayer1"
        border="1px solid"
        borderColor={isInvalid ? "statusDanger" : "borderStructural"}
        color={field.value ? "textPrimary" : "textMuted"}
        borderRadius="12px"
        fontSize="14px"
        _hover={{ borderColor: "#2B3647" }}
        _focus={{
          borderColor: "brand.500",
          boxShadow: "0 0 0 3px rgba(124,58,237,0.2)",
          outline: "none",
        }}
        iconColor="var(--chakra-colors-textSecondary)">
        <option value="" disabled style={{ background: "#111827" }}>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            style={{ background: "#111827", color: "#F9FAFB" }}>
            {opt.label}
          </option>
        ))}
      </Select>

      <FormErrorMessage fontSize="12px" color="statusDanger">
        {meta.error}
      </FormErrorMessage>
    </FormControl>
  );
};

interface CustomCheckboxProps extends CheckboxProps {
  label: string;
  value?: string;
  isChecked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  spacing?: number | string;
  checkboxSize?: number | string;
  labelProps?: Record<string, unknown>;
  checkboxProps?: Record<string, unknown>;
}

export const CustomCheckbox = ({
  label,
  value,
  isChecked,
  onChange,
  spacing = 2,
  checkboxSize = "24px",
  labelProps,
  checkboxProps,
  ...rest
}: CustomCheckboxProps) => {
  const { state, getCheckboxProps, getInputProps, getLabelProps } = useCheckbox(
    {
      value,
      isChecked,
      onChange,
      ...rest,
    }
  );

  return (
    <chakra.label
      display="flex"
      flexDirection="row-reverse"
      alignItems="center"
      gap={spacing}
      cursor="pointer"
      userSelect="none"
      justifyContent="space-between"
      {...rest}>
      <input {...getInputProps()} hidden />

      <Flex
        alignItems="center"
        justifyContent="center"
        border="1.5px solid"
        borderColor={state.isChecked ? "brand.500" : "borderStructural"}
        borderRadius="8px"
        w={checkboxSize}
        h={checkboxSize}
        bg={state.isChecked ? "brand.500" : "bgLayer1"}
        transition="all 0.15s ease"
        _hover={{ borderColor: "brand.500" }}
        boxSize={checkboxSize}
        flexShrink={0}
        {...getCheckboxProps(checkboxProps)}>
        {state.isChecked && <Check size={14} color="white" weight="bold" />}
      </Flex>

      <Text
        fontSize="14px"
        color={state.isChecked ? "textPrimary" : "textSecondary"}
        fontWeight={state.isChecked ? 500 : 400}
        transition="color 0.15s ease"
        {...getLabelProps(labelProps)}>
        {label}
      </Text>
    </chakra.label>
  );
};
