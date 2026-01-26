"use client";

import { useState, useRef } from "react";
import { journeyEntries, JourneyEntry } from "@/data/journey";
import { cn } from "@/lib/utils";

function JourneyItem({ entry }: { entry: JourneyEntry }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileToggled, setIsMobileToggled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const hasAlternateDates = entry.alternateDate || entry.alternateEndDate;
  const isAlternateActive = isHovered && hasAlternateDates;
  const isMobileAlternateActive = isMobileToggled && hasAlternateDates;
  const displayDate = isAlternateActive ? entry.alternateDate ?? entry.date : entry.date;
  const displayEndDate = isAlternateActive
    ? entry.alternateEndDate ?? entry.endDate
    : entry.endDate;
  const displayDateMobile = isMobileAlternateActive ? entry.alternateDate ?? entry.date : entry.date;
  const displayEndDateMobile = isMobileAlternateActive
    ? entry.alternateEndDate ?? entry.endDate
    : entry.endDate;

  const handleMouseHover = (entering: boolean) => {
    if (!hasAlternateDates) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsHovered(entering), 50);
  };

  const handleMobileClick = () => {
    if (!hasAlternateDates) return;
    setIsMobileToggled(!isMobileToggled);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-3">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 sm:block">
            <div>
              <h3 className="font-semibold text-xl">{entry.title}</h3>
              <p className="text-muted-foreground text-lg -mt-1">
                {entry.organization}
              </p>
            </div>
            <div
              className={cn(
                "text-sm text-muted-foreground sm:hidden shrink-0",
                hasAlternateDates && "cursor-pointer border-b-2 border-dashed border-muted-foreground/30 pb-0.5 inline-block"
              )}
              onClick={handleMobileClick}
            >
              <span
                className={cn(
                  "transition-opacity duration-250 whitespace-nowrap",
                  displayDateMobile?.toLowerCase() === "now" && "font-semibold text-blue-500"
                )}
              >
                {displayDateMobile}
                {displayEndDateMobile && (
                  <>
                    {" - "}
                    <span
                      className={cn(
                        displayEndDateMobile.toLowerCase() === "now" && "font-semibold text-blue-500"
                      )}
                    >
                      {displayEndDateMobile}
                    </span>
                  </>
                )}
              </span>
            </div>
          </div>
          {entry.location && (
            <p className="text-muted-foreground/80 text-sm">{entry.location}</p>
          )}
        </div>
        <div
          className={cn(
            "hidden sm:block text-sm text-muted-foreground sm:text-right",
            hasAlternateDates &&
              "cursor-pointer sm:border-b-2 sm:border-dashed sm:border-muted-foreground/30 sm:hover:border-muted-foreground/60 transition-colors sm:pb-0.5 sm:inline-block"
          )}
          onMouseEnter={() => handleMouseHover(true)}
          onMouseLeave={() => handleMouseHover(false)}
        >
          <span
            className={cn(
              "transition-opacity duration-250 whitespace-nowrap",
              displayDate?.toLowerCase() === "now" && "font-semibold text-blue-500"
            )}
          >
            {displayDate}
            {displayEndDate && (
              <>
                {" - "}
                <span
                  className={cn(
                    displayEndDate.toLowerCase() === "now" && "font-semibold text-blue-500"
                  )}
                >
                  {displayEndDate}
                </span>
              </>
            )}
          </span>
        </div>
      </div>
      {entry.description && (
        <p className="text-sm text-foreground/70 mt-2">{entry.description}</p>
      )}
    </div>
  );
}

export default function Journey() {
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
        id="journey"
        className="py-12 animate-fade-in-up"
        style={{ animationDelay: "400ms" }}
      >
        <div className="container mx-auto max-w-2xl px-6">
          <div className="space-y-4 sm:space-y-6">
            {journeyEntries.map((entry, index) => (
              <div
                key={index}
                className="animate-fade-in-up pb-4 sm:pb-6 border-b border-border last:border-b-0 last:pb-0"
                style={{ animationDelay: `${500 + index * 100}ms` }}
              >
                <JourneyItem entry={entry} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
