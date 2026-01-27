import TechPill from "@/components/tech-pill"
import { techs } from "@/data/tech"

export default function TechStack() {
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
        id="tech-stack" 
        className="py-12 animate-fade-in-up"
        style={{ animationDelay: '400ms' }}
      >
        <div className="container mx-auto max-w-5xl px-6">
          {/* Tech Pills Grid - Centered */}
          <div className="flex flex-wrap justify-center gap-4">
            {techs.map((tech, index) => (
              <div
                key={tech.name}
                className="animate-fade-in-up"
                style={{ 
                  animationDelay: `${500 + index * 50}ms`
                }}
              >
                <TechPill
                  label={tech.name}
                  icon={tech.icon}
                  colorClass={tech.color}
                  size="lg"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
