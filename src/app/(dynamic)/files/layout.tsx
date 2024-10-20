import FilesSideNav from "@/app/(dynamic)/files/_components/files-side-nav";

export default function FilesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
        <FilesSideNav />
        <div className="w-full p-4">{children}</div>
    </div>
  );
}