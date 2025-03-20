import { Link } from "react-router-dom";
import { FileText, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon = FileText,
  title = "No data found",
  description = "Get started by creating your first record.",
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50",
        className
      )}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}

export function TranscriptsEmptyState() {
  return (
    <EmptyState
      icon={FileText}
      title="No transcripts yet"
      description="Create your first transcript to get started with grading and transcript management."

    />
  );
} 