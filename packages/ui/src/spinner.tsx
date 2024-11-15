import { Loader } from "lucide-react";
import { cn } from "./lib/utils";

interface SpinnerProps {
  size?: number;
  inverted?: boolean;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = (props) => {
  return (
    <Loader
      className={cn(
        `animate-spin flex ${props.inverted ? "text-white" : "text-primary"}`,
        props.className,
      )}
      size={props.size ?? "40px"}
    />
  );
};

export default Spinner;
