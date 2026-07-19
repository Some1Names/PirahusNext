import Swal, { SweetAlertResult } from "sweetalert2";

const THEME = {
  background: "#0a0e08",
  color: "#d8e8b8",
  confirmButtonColor: "#708840",
  cancelButtonColor: "#4a5a30",
  dangerConfirmColor: "#b85040",
  warningConfirmColor: "#a8c060",
};

export const alertUtil = {
  showSuccess: (title: string, text?: string, options?: { timer?: number; showConfirmButton?: boolean }): Promise<SweetAlertResult> => {
    return Swal.fire({
      title,
      text,
      icon: "success",
      background: THEME.background,
      color: THEME.color,
      confirmButtonColor: THEME.confirmButtonColor,
      timer: options?.timer,
      showConfirmButton: options?.showConfirmButton !== false,
    });
  },

  showWarning: (title: string, text?: string): Promise<SweetAlertResult> => {
    return Swal.fire({
      title,
      text,
      icon: "warning",
      background: THEME.background,
      color: THEME.color,
      confirmButtonColor: THEME.warningConfirmColor,
    });
  },

  showError: (title: string, text?: string, options?: { timer?: number; showConfirmButton?: boolean }): Promise<SweetAlertResult> => {
    return Swal.fire({
      title,
      text,
      icon: "error",
      background: THEME.background,
      color: THEME.color,
      confirmButtonColor: THEME.confirmButtonColor,
      timer: options?.timer,
      showConfirmButton: options?.showConfirmButton !== false,
    });
  },

  showLoading: (title: string): void => {
    Swal.fire({
      title,
      allowOutsideClick: false,
      background: THEME.background,
      color: THEME.color,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  },

  close: (): void => {
    Swal.close();
  },

  showConfirm: (
    title: string,
    text: string,
    options?: {
      confirmButtonText?: string;
      cancelButtonText?: string;
      isDanger?: boolean;
    }
  ): Promise<SweetAlertResult> => {
    const confirmColor = options?.isDanger
      ? THEME.dangerConfirmColor
      : THEME.warningConfirmColor;

    return Swal.fire({
      title,
      text,
      icon: options?.isDanger ? "warning" : "question",
      showCancelButton: true,
      confirmButtonText: options?.confirmButtonText || "ยืนยัน",
      cancelButtonText: options?.cancelButtonText || "ยกเลิก",
      confirmButtonColor: confirmColor,
      cancelButtonColor: THEME.cancelButtonColor,
      background: THEME.background,
      color: THEME.color,
    });
  },

  showPrompt: (
    title: string,
    label: string,
    placeholder: string = "0",
    inputType: "text" | "number" = "number"
  ): Promise<SweetAlertResult> => {
    return Swal.fire({
      title,
      input: inputType,
      inputLabel: label,
      inputPlaceholder: placeholder,
      showCancelButton: true,
      background: THEME.background,
      color: THEME.color,
      confirmButtonColor: THEME.warningConfirmColor,
      cancelButtonColor: THEME.cancelButtonColor,
    });
  },
};
