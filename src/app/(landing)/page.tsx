import { auth } from "@/auth";
import { redirect } from "next/navigation";
import HeroSection from "./_sections/hero";
import { PricingSection } from "./_sections/pricing";

export default async function Home() {
  const session = await auth();
  if (session) {
    redirect("/files");
  }

  return (
    <>
      <HeroSection></HeroSection>
      <PricingSection hasSubscription={false}></PricingSection>
    </>
  );
}
