import React, { Fragment } from "react";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  showCloseButton?: boolean;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, showCloseButton = true, children }) => {
  return (
    <Transition
      appear
      show={isOpen}
      as={Fragment}
    >
      <Dialog
        as="div"
        className="relative z-[100]"
        onClose={onClose}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="animate-fade-in relative w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-gray-100 text-2xl text-gray-700 shadow transition-all hover:bg-gray-200 hover:text-gray-900"
                  aria-label="Zamknij"
                  type="button"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-full w-full items-center justify-center"
                  >
                    ×
                  </span>
                </button>
              )}
              {title && <h2 className="mb-4 text-xl font-bold">{title}</h2>}
              {children}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
