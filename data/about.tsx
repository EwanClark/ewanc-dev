export interface AboutSection {
  id: string;
  title: string;
  quick: string;
  detailed: string;
}

export const aboutSections: AboutSection[] = [
  {
    id: "tools",
    title: "Tools",
    quick: "I use Cursor and GitHub Copilot. They speed things up, but I review everything before it goes in.",
    detailed: "I use AI tools daily—mainly Cursor for navigating codebases and Copilot for routine tasks. They're helpful, but I don't trust them blindly. I always review suggestions, test them, and understand what they're doing. Sometimes they're wrong, sometimes they're overcomplicated. The goal is faster iteration, not replacing thinking."
  },
  {
    id: "approach",
    title: "How I Work",
    quick: "I write code that's easy to understand and change. Simple over clever.",
    detailed: "I'd rather write boring code that works than clever code that breaks. I think about who's going to read this in six months—probably me, and I'll have forgotten what I was thinking. I document decisions as I make them, not after. I test things to make sure they work, not because I'm supposed to. Sometimes I overthink things, sometimes I underthink them. I'm working on finding the balance."
  },
  {
    id: "collaboration",
    title: "Working With Me",
    quick: "I ask questions when I'm stuck. I prefer async communication. I'll tell you if something doesn't make sense.",
    detailed: "If I'm blocked, I'll ask. If something seems off, I'll say so. I prefer async communication—Slack messages, PR comments, that kind of thing. I'm not great at small talk, but I'm good at explaining technical things. I appreciate when people are direct with me. Code reviews are about making the code better, not about being right. If I'm wrong about something, tell me."
  },
  {
    id: "interests",
    title: "What I'm Into",
    quick: "Backend systems, databases, and how tools shape how we work.",
    detailed: "I like backend stuff—APIs, databases, making things fast and reliable. I'm interested in how development tools change how we write code. I build side projects to learn new things. I read a lot of code. I don't have a CS degree, so I learn by doing and reading documentation."
  },
  {
    id: "values",
    title: "What Matters",
    quick: "Shipping things that work. Learning. Not working weekends.",
    detailed: "I want to build things that actually work and that people use. I'd rather ship something good enough than perfect something that never ships. I'm always learning—there's too much I don't know. I work hard during work hours, but I don't work weekends unless something's actually on fire. Burnout helps nobody."
  }
];
