// app/(client)/layout.tsx

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default function ClientGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
