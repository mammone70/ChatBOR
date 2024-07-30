import FilesSideNav from "@/components/files/files-side-nav";

export default function FilesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
        <FilesSideNav />
        <div className="w-full bg-muted/40 p-4">{children}</div>
    </div>
  );
}