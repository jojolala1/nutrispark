import { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ name: string }>;
}): Promise<Metadata> {
    const { name } = await params;

    const title = `Discover ${name} - Nutristark`;
    const description = `Learn all about the nutritionnnal values of ${name} on NutriTeck. Explore now!`;
    return {
        title,
        description,
    };
}

export default function FoodLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
