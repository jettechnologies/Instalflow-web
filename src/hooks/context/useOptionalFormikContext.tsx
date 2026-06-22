import { useContext, useState } from "react";
import { FormikContext, getIn } from "formik";

interface UseOptionalFormikFieldArgs<T> {
  /** Formik field name. Omit this to use the field outside of any <Formik> form. */
  name?: string;
  /** Starting value, used only when NOT bound to Formik (no name, or no <Formik> ancestor). */
  initialValue?: T;
}

interface UseOptionalFormikFieldResult<T> {
  value: T | undefined;
  error: unknown;
  touched: boolean;
  isFormikBound: boolean;
  setValue: (value: T) => void;
  setTouched: () => void;
}

/**
 * A drop-in, crash-proof alternative to formik's `useField`.
 *
 * - If `name` is provided AND the component is rendered inside a <Formik> form,
 *   it reads/writes through formik: value, error, touched, setFieldValue, setFieldTouched.
 * - If `name` is omitted, OR there is no surrounding <Formik> form, it falls back
 *   to plain React state. The component never throws and never requires a
 *   Formik provider to exist.
 *
 * Why not just call formik's `useField()` conditionally?
 * 1. `useField()` (and `useFormikContext()`, which it calls internally) runs an
 *    `invariant()` check that THROWS when there's no <Formik> ancestor — it
 *    doesn't fail silently, so "just don't call it" is necessary, not optional.
 * 2. Hooks must be called in the same order on every render. A literal
 *    `if (name) useField(name)` breaks the rules of hooks the moment `name`'s
 *    presence changes, or differs between component instances.
 *
 * This hook sidesteps both problems by reading the context directly with
 * `useContext(FormikContext)`, which simply returns `undefined` when there's
 * no provider — no throw. `useContext` and `useState` are called
 * unconditionally on every render; only the *returned values* branch on
 * whether formik is actually present.
 */
export function useOptionalFormikField<T = any>({
  name,
  initialValue,
}: UseOptionalFormikFieldArgs<T>): UseOptionalFormikFieldResult<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formikContext = useContext(FormikContext);
  const [localValue, setLocalValue] = useState<T | undefined>(initialValue);

  const isFormikBound = Boolean(formikContext) && Boolean(name);

  if (isFormikBound) {
    return {
      value: getIn(formikContext.values, name as string),
      error: getIn(formikContext.errors, name as string),
      touched: Boolean(getIn(formikContext.touched, name as string)),
      isFormikBound: true,
      setValue: (value: T) =>
        formikContext.setFieldValue(name as string, value),
      setTouched: () => formikContext.setFieldTouched(name as string, true),
    };
  }

  return {
    value: localValue,
    error: undefined,
    touched: false,
    isFormikBound: false,
    setValue: setLocalValue,
    setTouched: () => {},
  };
}
