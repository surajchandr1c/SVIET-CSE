import type { InputHTMLAttributes } from "react";

type AdminTextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function AdminTextField({ label, id, ...props }: AdminTextFieldProps) {
  return (
    <label htmlFor={id} className="block text-sm font-semibold text-(--admin-text)">
      <span className="mb-1 block">{label}</span>
      <input id={id} {...props} className={`admin-input ${props.className ?? ""}`} />
    </label>
  );
}
