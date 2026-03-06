export interface AboutSection {
  id: string;
  title: string;
  quick: string;
  detailed: string;
}

/** Use {{age}} in strings for dynamic age that updates without rebuild */
export const aboutSections: AboutSection[] = [
  {
    id: "tools",
    title: "Tools",
    quick: "I use Cursor + Codex with Arch Linux + Hyprland to improve my productivity while keeping it minimalistic.",
    detailed: "I use Cursor and Codex for coding assistance, Arch Linux for its minimalism, and Hyprland for its customizability. I've tailored my workflow around these tools for maximum efficiency."
  },
  {
    id: "approach",
    title: "My Approach",
    quick: "DRY (Don't Repeat Yourself) keeps code maintainable. With AI making code less valuable, we need to be more experimental to find the best approach.",
    detailed: "DRY (Don't Repeat Yourself) is one of the most important coding principles, especially when using AI, making code more readable and maintainable. Since AI is making the actual code less valuable, rather than sticking with one implementation, we can experiment with multiple approaches to find the best result."
  },
  {
    id: "background",
    title: "Background",
    quick: "I've always been interested in technology, which led me to coding and learning by building. I'm entirely self-taught at {{age}} years old.",
    detailed: "I've been interested in computers and technology since I was 7. I started coding at 11 with Python and learning to think like a developer. A year later, I began web development with HTML, CSS, and JavaScript, learning by building. I moved on to more complex frameworks like Next.js and Tailwind CSS. I'm entirely self-taught at {{age}} years old and always eager to learn more. I'd love to hear about any opportunities."
  },
  {
    id: "interests",
    title: "What I'm Into",
    quick: "I'm into AI, Linux and customizing my desktop environment to improve my workflow.",
    detailed: "I'm interested in complex backend systems, AI, Linux, and customization. I love customizing my Linux setup to make it look stunning while being efficient and minimalistic. You can find my dotfiles on GitHub!"
  }
];
