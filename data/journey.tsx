export interface JourneyEntry {
  title: string;
  organization: string;
  location?: string;
  date: string;
  endDate?: string;
  alternateDate?: string;
  alternateEndDate?: string;
  description?: string;
}

export const journeyEntries: JourneyEntry[] = [
  {
    title: "Computer Science GCSE",
    organization: "Secondary School",
    date: "Year 8",
    endDate: "Year 9",
    alternateDate: "Dec 2024",
    alternateEndDate: "May 2026",
    description: "Taking the Computer Science GCSE 2 years early, without any formal teaching.",
  },
  {
    title: "Volunteering",
    organization: "Local Church",
    date: "Jan 2026",
    endDate: "Apr 2026",
    description: "Volunteering at my local church, helping with their IT systems, applying my skills to real world problems.",
  },
];
