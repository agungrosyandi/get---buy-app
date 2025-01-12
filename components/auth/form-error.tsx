import { AlertCircle } from "lucide-react";

export default function FormError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <div className=" bg-destructive text-xs flex items-center gap-3 text-secondary-foreground p-3 rounded-md">
      <AlertCircle className="w-4 h-4" />
      <p>{message}</p>
    </div>
  );
}
