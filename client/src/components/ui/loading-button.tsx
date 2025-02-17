import { VariantProps } from "class-variance-authority";
import { Loader2Icon } from "lucide-react";

import { Button, buttonVariants } from "./button";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

export const LoadingButton: React.FC<ButtonProps> = ({
  isLoading,
  className,
  children,
  ...props
}) => {
  return (
    <Button disabled={isLoading} className={className} {...props}>
      {isLoading && <Loader2Icon size={16} className="mr-2 animate-spin" />}
      {children}
    </Button>
  );
};

export default LoadingButton;
