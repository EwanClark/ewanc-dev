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
    date: "Year 9",
    endDate: "Now",
    alternateDate: "Dec 2024",
    alternateEndDate: "Now",
    description: "Taking the Computer Science GCSE 2 years early, without any formal teaching.",
  },
  {
    title: "Volunteering",
    organization: "Local Church",
    date: "Jan 2025",
    endDate: "Now",
    description: "Volunteering at my local church, helping with their IT systems, applying my skills to real world problems.",
  },
];
