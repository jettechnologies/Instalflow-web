import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

export const tokens = {
  bg: {
    layer1: "#0B0F1A",
    layer2: "#111827",
  },
  border: {
    structural: "#1F2937",
  },
  brand: {
    primary: "#7C3AED",
    dark: "#1E3A8A",
    gradient: "linear-gradient(135deg, #1E3A8A 0%, #7C3AED 100%)",
  },
  text: {
    primary: "#F9FAFB",
    secondary: "#9CA3AF",
    muted: "#6B7280",
    placeholder: "#98A2B3",
  },
  status: {
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#06B6D4",
  },
};

const theme = extendTheme({
  config,
  fonts: {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`,
    mono: `'JetBrains Mono', ui-monospace, SFMono-Regular, monospace`,
  },
  colors: {
    bgLayer1: tokens.bg.layer1,
    bgLayer2: tokens.bg.layer2,
    borderStructural: tokens.border.structural,
    brand: {
      50: "#F5F0FF",
      100: "#E9DDFF",
      200: "#D2B9FF",
      300: "#B48BFF",
      400: "#965CFF",
      500: tokens.brand.primary,
      600: "#6D28D9",
      700: "#5B21B6",
      800: "#4C1D95",
      900: tokens.brand.dark,
    },
    textPrimary: tokens.text.primary,
    textSecondary: tokens.text.secondary,
    textMuted: tokens.text.muted,
    statusSuccess: tokens.status.success,
    statusWarning: tokens.status.warning,
    statusDanger: tokens.status.danger,
    statusInfo: tokens.status.info,
  },
  radii: {
    sm: "8px",
    md: "12px",
    lg: "12px",
    xl: "12px",
    "2xl": "16px",
  },
  styles: {
    global: {
      "html, body": {
        bg: tokens.bg.layer1,
        color: tokens.text.primary,
        fontFeatureSettings: `"cv11", "ss01"`,
        WebkitFontSmoothing: "antialiased",
      },
      "*": {
        borderColor: "transparent",
      },
      "*::placeholder": {
        color: tokens.text.placeholder,
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 600,
        borderRadius: "12px",
      },
      sizes: {
        md: { h: "44px", px: "20px", fontSize: "14px" },
      },
      variants: {
        gradient: {
          bg: tokens.brand.gradient,
          color: "white",
          _hover: { opacity: 0.92, _disabled: { opacity: 0.4 } },
          _active: { opacity: 0.85 },
          _loading: { opacity: 0.8 },
          _disabled: { opacity: 0.4, cursor: "not-allowed" },
        },
        ghostOutline: {
          bg: "transparent",
          border: "1px solid",
          borderColor: tokens.brand.primary,
          color: tokens.brand.primary,
          _hover: { bg: tokens.brand.primary, color: "white" },
        },
        // ghost: {
        //   bg: "transparent",
        //   color: tokens.brand.primary,
        // },
        redOutline: {
          bg: "transparent",
          border: "1px solid",
          borderColor: tokens.status.danger,
          color: tokens.status.danger,
          _hover: { bg: tokens.status.danger, color: "white" },
        },
      },
      defaultProps: { variant: "gradient", size: "md" },
    },
    Input: {
      baseStyle: { field: { borderRadius: "12px" } },
      variants: {
        instalflow: {
          field: {
            bg: tokens.bg.layer1,
            border: "1px solid",
            borderColor: tokens.border.structural,
            color: tokens.text.primary,
            h: "44px",
            _placeholder: { color: tokens.text.placeholder },
            _hover: { borderColor: "#2B3647" },
            _focus: {
              borderColor: tokens.brand.primary,
              boxShadow: `0 0 0 3px rgba(124,58,237,0.2)`,
            },
            _invalid: {
              borderColor: tokens.status.danger,
              boxShadow: `0 0 0 3px rgba(239,68,68,0.18)`,
            },
          },
        },
      },
      defaultProps: { variant: "instalflow" },
    },
    FormLabel: {
      baseStyle: {
        color: tokens.text.secondary,
        fontSize: "12px",
        fontWeight: 500,
        mb: "6px",
      },
    },
    Heading: {
      baseStyle: { color: tokens.text.primary, letterSpacing: "-0.01em" },
    },
  },
});

export default theme;
