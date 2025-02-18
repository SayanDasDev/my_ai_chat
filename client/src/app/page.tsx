import { HeroSection } from "@/components/hero-section";
import { Icons } from "@/components/ui/icons";

export default function Home() {
  return (
    <HeroSection
      badge={{
        text: "Introducing our new models",
        action: {
          text: "Learn more",
          href: "/docs",
        },
      }}
      title="My AI Chat"
      description="Join us to experience the most advanced AI chat platform that connects you with intelligent conversations and personalized interactions."
      actions={[
        {
          text: "Get Started",
          href: "/login",
          variant: "default",
        },
        {
          text: "GitHub",
          href: "https://github.com/my_ai_chat",
          variant: "secondary",
          icon: <Icons.gitHub className="h-5 w-5" />,
        },
      ]}
      image={{
        light: "/chatui.webp",
        dark: "/chatui.webp",
        alt: "UI Preview",
      }}
    />
  );
}
