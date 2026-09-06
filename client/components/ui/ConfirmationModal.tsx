import React from "react";
import { AlertTriangle, Info, ShieldAlert, X } from "lucide-react";
import Button from "./Button";

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  loading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const iconColors = {
    danger: "bg-rose-100 text-rose-600",
    warning: "bg-amber-100 text-amber-600",
    info: "bg-blue-100 text-blue-600",
  };

  const Icons = {
    danger: AlertTriangle,
    warning: ShieldAlert,
    info: Info,
  };

  const IconComponent = Icons[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 relative"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className={`w-12 h-12 rounded-full ${iconColors[variant]} flex items-center justify-center mx-auto`}>
          <IconComponent className="w-6 h-6" />
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <div className="text-xs text-slate-600 leading-relaxed">{description}</div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variant === "info" ? "primary" : "danger"}
            size="sm"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
