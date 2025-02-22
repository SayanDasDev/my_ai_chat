import { usePastAware } from "@/hooks/use-past-aware";
import { cn } from "@/lib/utils";
import { Save, SaveOff } from "lucide-react";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

const PastAwareSwitch = () => {
  const { isPastAware, setIsPastAware } = usePastAware();

  return (
    <div className="">
      <Label
        htmlFor="past-aware"
        className={cn(
          "flex flex-col items-start gap-1 py-1 px-3 rounded-md text-sm  transition-colors hover:bg-muted"
          // isPastAware &&
          //   "bg-accent-foreground/10 ring-1 ring-accent-foreground/20 outline-accent-foreground"
          // !!form.watch("file") && "pointer-events-none opacity-50"
        )}
      >
        <div className="text-xs text-foreground/50">Past Awareness</div>
        <div className="flex gap-1 items-center">
          {isPastAware ? (
            <>
              <Save size={14} className="text-accent-foreground/50" />{" "}
              <span>Remembers Chats</span>
            </>
          ) : (
            <>
              <SaveOff size={14} className="text-accent-foreground/50" />{" "}
              <span>Standalone Chat</span>
            </>
          )}
        </div>
      </Label>
      <Switch
        id="past-aware"
        className="sr-only"
        checked={isPastAware}
        onCheckedChange={setIsPastAware}
      />
    </div>
  );
};

export default PastAwareSwitch;
