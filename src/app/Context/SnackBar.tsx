"use client"
import {
  createContext,
  useState,
  useContext,
  useRef,
  type ReactNode,
} from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define the alert state interface
interface AlertState {
  open: boolean;
  message: string;
  title?: string;
  variant: "default" | "destructive" | "success" | "warning";
}

// Define the context type
interface AlertContextType {
  alert: AlertState;
  setAlert: React.Dispatch<React.SetStateAction<AlertState>>;
  showAlert: (
    message: string,
    variant?: "default" | "destructive" | "success" | "warning",
    title?: string
  ) => void;
}

// Create context with undefined as initial value
const AlertShowHideContext = createContext<AlertContextType | undefined>(
  undefined
);

// Define props interface for the provider
interface AlertShowHideProviderProps {
  children: ReactNode;
}

export const AlertShowHideProvider = ({
  children,
}: AlertShowHideProviderProps) => {
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: "",
    title: undefined,
    variant: "default",
  });

  const timeoutRef = useRef<number | null>(null);

  const showAlert = (
    message: string,
    variant: "default" | "destructive" | "success" | "warning" = "default",
    title?: string
  ) => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    setAlert({
      open: true,
      message,
      title,
      variant,
    });

    timeoutRef.current = window.setTimeout(() => {
      setAlert((prev) => ({ ...prev, open: false }));
    }, 4000);
  };

  const handleClose = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setAlert((prev) => ({ ...prev, open: false }));
  };

  // Get icon based on variant
  const getIcon = () => {
    switch (alert.variant) {
      case "success":
        return <CheckCircle2 className="h-5 w-5" />;
      case "destructive":
        return <XCircle className="h-5 w-5" />;
      case "warning":
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  // Get variant styles
  const getVariantStyles = () => {
    switch (alert.variant) {
      case "success":
        return "border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100";
      case "warning":
        return "border-orange-500 bg-orange-50 text-orange-900 dark:bg-orange-950 dark:text-orange-100";
      default:
        return "";
    }
  };

  return (
    <AlertShowHideContext.Provider value={{ alert, setAlert, showAlert }}>
      {children}

      {/* Alert Toast Container */}
      {alert.open && (
        <div
          className="fixed bottom-4 left-4 z-50 w-full max-w-md animate-in slide-in-from-bottom-5"
          onClick={handleClose}
        >
          <Alert
            variant={
              alert.variant === "success" || alert.variant === "warning"
                ? "default"
                : alert.variant
            }
            className={`cursor-pointer shadow-lg ${getVariantStyles()}`}
          >
            <div className="flex items-start gap-3">
              {getIcon()}
              <div className="flex-1">
                {alert.title && <AlertTitle>{alert.title}</AlertTitle>}
                <AlertDescription>{alert.message}</AlertDescription>
              </div>
              <Button
                onClick={handleClose}
                className="opacity-70 hover:opacity-100 transition-opacity"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          </Alert>
        </div>
      )}
    </AlertShowHideContext.Provider>
  );
};

// Custom hook with proper error handling
export const useAlertShowHide = (): AlertContextType => {
  const context = useContext(AlertShowHideContext);
  if (context === undefined) {
    throw new Error(
      "useAlertShowHide must be used within an AlertShowHideProvider"
    );
  }
  return context;
};
