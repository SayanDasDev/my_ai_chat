import { Loader2Icon } from "lucide-react";

const FullScreenLoading = () => {
  return (
    <div className="bg-muted absolute inset-0 flex items-center justify-center">
      <Loader2Icon size={32} className="mr-2 animate-spin" />
    </div>
  );
};

export default FullScreenLoading;
