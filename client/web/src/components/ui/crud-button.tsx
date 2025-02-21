import { cn } from "@/lib/utils";
import React from "react";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalTitle,
  ResponsiveModalTrigger,
} from "./responsive-modal";

interface CrudButtonProps {
  children: React.ReactNode;
  form: React.ReactNode;
  title: string;
  description?: string | React.ReactNode;
  showTitle?: boolean;
  showDescription?: boolean;
  size?: "default" | "sm" | "lg";
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const CrudButton = ({
  children,
  form,
  title,
  description,
  showTitle = true,
  showDescription = true,
  size,
  open,
  setOpen,
}: CrudButtonProps) => {
  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <ResponsiveModalTrigger asChild>{children}</ResponsiveModalTrigger>
      <ResponsiveModalContent size={size}>
        <ResponsiveModalTitle hidden={!showTitle}>{title}</ResponsiveModalTitle>
        {typeof description === "string" ? (
          <ResponsiveModalDescription hidden={!showDescription}>
            {description}
          </ResponsiveModalDescription>
        ) : (
          <div className={cn(!showDescription && "sr-only")}>{description}</div>
        )}
        {form}
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export default CrudButton;
