"use client";

import { useState } from "react";
import { journeyEntries, JourneyEntry } from "@/lib/journey-data";
import { cn } from "@/lib/utils";

function JourneyItem({ entry }: { entry: JourneyEntry }) {
  const [isHovered, setIsHovered] = useState(false);

  const hasAlternateDates = entry.alternateDate || entry.alternateEndDate;
  const isAlternateActive = isHovered && hasAlternateDates;
  const displayDate = isAlternateActive ? entry.alternateDate ?? entry.date : entry.date;
  const displayEndDate = isAlternateActive
    ? entry.alternateEndDate ?? entry.endDate
    : entry.endDate;

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1 ">
          <h3 className="font-semibold text-xl">{entry.title}</h3>
          <p className="text-muted-foreground text-lg -mt-1">
            {entry.organization}
          </p>
          {entry.location && (
            <p className="text-muted-foreground/80 text-sm">{entry.location}</p>
          )}
        </div>
        <div
          className={cn(
            "text-sm text-muted-foreground sm:text-right inline-block",
            hasAlternateDates &&
              "cursor-pointer border-b-2 border-dashed border-muted-foreground/30! hover:border-muted-foreground/60! transition-colors pb-0.5"
          )}
          onMouseEnter={() => hasAlternateDates && setIsHovered(true)}
          onMouseLeave={() => hasAlternateDates && setIsHovered(false)}
        >
          <span
            className={cn(
              "transition-opacity duration-250",
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
          <div className="space-y-6">
            {journeyEntries.map((entry, index) => (
              <div
                key={index}
                className="animate-fade-in-up pb-6 border-b border-border last:border-b-0 last:pb-0"
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
