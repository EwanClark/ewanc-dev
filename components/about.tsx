import { aboutSections } from "@/data/about";
import AboutSectionItem from "@/components/about-item";

export default function About() {
  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(2rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.7s ease-out forwards;
        }
      `}</style>

      <section
        id="about"
        className="py-12 animate-fade-in-up"
        style={{ animationDelay: "400ms" }}
      >
        <div className="container mx-auto max-w-2xl px-6">
          <div className="space-y-6">
            {aboutSections.map((section, index) => (
              <div
                key={section.id}
                className="animate-fade-in-up pb-3 border-b border-border last:border-b-0 last:pb-0"
                style={{ animationDelay: `${500 + index * 100}ms` }}
              >
                <AboutSectionItem section={section} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
