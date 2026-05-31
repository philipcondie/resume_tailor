import { Hero } from "../components/landing/Hero";
import { DemoSection } from "../components/landing/DemoSection";
import { HowItWorks } from "../components/landing/HowItWorks";
import { Features } from "../components/landing/Features";
import { LandingFooter } from "../components/landing/LandingFooter";

export function Landing() {
    return (
        <div className="min-h-screen bg-white text-gray-900">
            <Hero />
            <DemoSection />
            <HowItWorks />
            <Features />
            <LandingFooter />
        </div>
    );
}
