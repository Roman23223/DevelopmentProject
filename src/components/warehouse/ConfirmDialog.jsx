import { useEffect } from "react";
import Styles from "@styles/warehouse/ConfirmDialog.module.css";

export default function ConfirmDialog({
  title,
  text,
  confirmLabel = "Подтвердить",
  onConfirm,
  onCancel,
}) {
  // Закрытие по Escape + очистка слушателя
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", handleKey);

    // ⭐ Функция очистки: выполнится при размонтировании модалки
    return () => document.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  return (
    <div className={Styles.overlay} onClick={onCancel}>
      <div className={Styles.dialog} onClick={(e) => e.stopPropagation()}>
        <h3 className={Styles.dialogTitle}>{title}</h3>
        <p className={Styles.dialogText}>{text}</p>
        <div className={Styles.dialogButtons}>
          <button type="button" className={Styles.cancelButton} onClick={onCancel}>
            Отмена
          </button>
          <button type="button" className={Styles.confirmButton} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
