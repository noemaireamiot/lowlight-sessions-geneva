import { getLocale } from "@/i18n/server";
import { getDictionary } from "@/i18n/dictionaries";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ConceptSection from "@/components/ConceptSection";
import SessionsSection from "@/components/SessionsSection";
import CommunitySection from "@/components/CommunitySection";
import Footer from "@/components/Footer";

export default async function Home() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <>
      <Navbar dict={dict.nav} locale={locale} />
      <main>
        <HeroSection dict={dict.hero} />
        <ConceptSection dict={dict.concept} />
        <SessionsSection dict={dict.sessions} />
        <CommunitySection dict={dict.community} />
      </main>
      <Footer dict={dict.footer} navDict={dict.nav} />
    </>
  );
}
