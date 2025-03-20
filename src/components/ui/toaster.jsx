import { Toaster as Sonner } from 'sonner';

export function Toaster() {
  return (
    <Sonner
      className="toaster group"
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          success: 
            'group-[.toaster]:bg-green-50 group-[.toaster]:text-green-800 group-[.toaster]:border-green-200',
          error:
            'group-[.toaster]:bg-destructive/15 group-[.toaster]:text-destructive group-[.toaster]:border-destructive/20',
          info:
            'group-[.toaster]:bg-blue-50 group-[.toaster]:text-blue-800 group-[.toaster]:border-blue-200',
          warning:
            'group-[.toaster]:bg-yellow-50 group-[.toaster]:text-yellow-800 group-[.toaster]:border-yellow-200',
        },
      }}
    />
  );
}
