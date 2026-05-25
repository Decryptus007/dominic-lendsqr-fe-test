import React, { useEffect, useRef } from 'react';
import './ConfirmModal.scss';

export type ConfirmModalType = 'danger' | 'success';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmModalType;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  onConfirm,
  onClose,
}) => {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  // Focus the confirm button when the modal opens for keyboard accessibility
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => confirmBtnRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="confirm-modal__backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-message"
    >
      <div className="confirm-modal">
        {/* Icon */}
        <div className={`confirm-modal__icon confirm-modal__icon--${type}`}>
          {type === 'danger' ? (
            <i className="fa-solid fa-user-slash"></i>
          ) : (
            <i className="fa-solid fa-user-check"></i>
          )}
        </div>

        {/* Content */}
        <h2 id="confirm-modal-title" className="confirm-modal__title">
          {title}
        </h2>
        <p id="confirm-modal-message" className="confirm-modal__message">
          {message}
        </p>

        {/* Actions */}
        <div className="confirm-modal__actions">
          <button
            className="confirm-modal__btn confirm-modal__btn--cancel"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            ref={confirmBtnRef}
            className={`confirm-modal__btn confirm-modal__btn--confirm confirm-modal__btn--${type}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
