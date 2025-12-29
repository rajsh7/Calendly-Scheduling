export function Card({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface border border-border rounded-xl shadow-soft p-6 hover:shadow-lift transition">
      {title && (
        <h2 className="text-lg font-semibold mb-4">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
