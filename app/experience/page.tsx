import { Card } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { notFound } from 'next/navigation'
import { IoBriefcaseOutline, IoSchoolOutline } from "react-icons/io5";
import { FaCode } from "react-icons/fa6";
import { LuLightbulb } from "react-icons/lu";
import { IoIosStarOutline } from "react-icons/io";
import { FiBookOpen, FiCoffee } from "react-icons/fi";
import { CiGlobe } from "react-icons/ci";

// Set this to true when you want to enable the experience page
// and remove the notFound() call in the ExperiencePage component
const EXPERIENCE_ENABLED = false;

const detailedExperience = [
	{
		title: "Senior Frontend Developer",
		company: "TechCorp Inc.",
		location: "San Francisco, CA",
		date: "January 2023 - Present",
		description:
			"Leading frontend development for enterprise SaaS products with a focus on performance optimization and component architecture.",
		achievements: [
			"Reduced bundle size by 40% through code splitting and lazy loading strategies",
			"Led migration from Redux to React Context API and custom hooks",
			"Implemented automated testing with Jest and React Testing Library, achieving 90% coverage",
			"Mentored junior developers and established coding standards for the team",
		],
		technologies: ["React", "TypeScript", "Next.js", "GraphQL", "Tailwind CSS"],
		icon: <IoBriefcaseOutline className="h-6 w-6" />,
	},
	{
		title: "Full Stack Developer",
		company: "Innovate Solutions",
		location: "Austin, TX",
		date: "March 2020 - December 2022",
		description:
			"Built and maintained scalable web applications for enterprise clients across healthcare and finance sectors.",
		achievements: [
			"Developed real-time data visualization dashboard used by 50+ enterprise clients",
			"Implemented secure authentication system using JWT and OAuth2.0",
			"Optimized database queries resulting in 60% faster page load times",
			"Created RESTful APIs consumed by web and mobile applications",
		],
		technologies: ["React", "Node.js", "Express", "PostgreSQL", "Redis", "Docker"],
		icon: <FaCode className="h-6 w-6" />,
	},
	{
		title: "Open Source Contribution",
		company: "React Community",
		location: "Remote",
		date: "May 2019 - Ongoing",
		description:
			"Active contributor to several popular React libraries and maintainer of personal open source projects.",
		achievements: [
			"Created and maintained a React component library with 1000+ GitHub stars",
			"Contributed to React documentation and community tutorials",
			"Fixed critical bugs in popular state management libraries",
			"Spoke at 3 regional JavaScript conferences on React performance",
		],
		technologies: ["React", "JavaScript", "Open Source", "Git"],
		icon: <LuLightbulb className="h-6 w-6" />,
	},
	{
		title: "Junior Web Developer",
		company: "Digital Studio",
		location: "Portland, OR",
		date: "June 2018 - February 2020",
		description:
			"Started career working on web applications for small to medium-sized businesses.",
		achievements: [
			"Developed responsive websites for 15+ clients using modern JavaScript frameworks",
			"Integrated third-party APIs for payment processing and social media",
			"Created custom WordPress themes and plugins for content management",
			"Collaborated with designers to implement pixel-perfect UIs",
		],
		technologies: ["JavaScript", "HTML/CSS", "PHP", "WordPress", "jQuery"],
		icon: <FaCode className="h-6 w-6" />,
	},
	{
		title: "Tech Conference Speaker",
		company: "Various Tech Conferences",
		location: "Multiple Locations",
		date: "September 2019",
		description: "First-time speaker at regional web development conferences.",
		achievements: [
			"Delivered talk on 'Building Accessible React Applications' to audience of 200+",
			"Received 4.8/5 average rating for presentation quality",
			"Featured in conference highlights video",
		],
		technologies: ["Public Speaking", "React", "Accessibility"],
		icon: <IoIosStarOutline className="h-6 w-6" />,
	},
	{
		title: "Computer Science Degree",
		company: "Tech University",
		location: "Boston, MA",
		date: "August 2014 - May 2018",
		description:
			"Bachelor's degree with focus on software engineering and web technologies.",
		achievements: [
			"Graduated with 3.9 GPA and honors distinction",
			"Capstone project: Real-time collaborative code editor",
			"Teaching assistant for Web Development and Data Structures courses",
			"President of campus Coding Club for 2 years",
		],
		technologies: ["Computer Science", "JavaScript", "Python", "Java", "Algorithms"],
		icon: <IoSchoolOutline className="h-6 w-6" />,
	},
	{
		title: "Self-taught Programming",
		company: "Self-directed Learning",
		location: "Remote",
		date: "January 2012 - August 2014",
		description:
			"Started learning programming through online courses and personal projects before formal education.",
		achievements: [
			"Completed 12+ online courses on web development fundamentals",
			"Built personal portfolio website from scratch",
			"Created simple web games using JavaScript",
			"Participated in first hackathon with no prior formal training",
		],
		technologies: ["HTML", "CSS", "JavaScript", "Self-learning"],
		icon: <FiBookOpen className="h-6 w-6" />,
	},
	{
		title: "First Blog Post",
		company: "Personal Tech Blog",
		location: "Online",
		date: "March 2013",
		description:
			"Started technical blogging about web development experiences and tutorials.",
		achievements: [
			"First article received 5,000+ views within first month",
			"Featured on web development newsletter",
			"Established regular writing schedule with bi-weekly posts",
			"Grew subscriber base to 500+ developers in first year",
		],
		technologies: ["Technical Writing", "Web Development"],
		icon: <FiCoffee className="h-6 w-6" />,
	},
]

export default function ExperiencePage() {
	if (!EXPERIENCE_ENABLED) {
		notFound();
	}

	return (
		<div className="min-h-screen">
			<Navbar />
			<div className="container py-16">
				<h1 className="text-4xl font-bold mb-2 text-center">
					Professional Experience
				</h1>
				<p className="text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
					A detailed timeline of my professional journey, education, and significant
					milestones that have shaped my career in software development.
				</p>

			{/* Desktop timeline (hidden on mobile) */}
			<div className="relative px-4 hidden md:block">
				{/* Vertical timeline line */}
				<div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border" />

				<div className="space-y-16">
					{detailedExperience.map((item, index) => (
						<div key={index} className="relative group">
							{/* Timeline node */}
							<div className="absolute left-1/2 transform -translate-x-1/2 -mt-3">
								<div className="flex items-center justify-center w-14 h-14 rounded-full bg-background border-2 border-primary shadow-lg group-hover:scale-105 group-hover:border-primary/80 group-hover:shadow-md transition-all duration-200">
									<div className="text-primary/80 group-hover:text-primary transition-colors">
										{item.icon}
									</div>
								</div>
							</div>

							{/* Content card - alternating sides */}
							<div
								className={`w-5/12 ${
									index % 2 === 0 ? "ml-auto" : "mr-auto"
								}`}
							>
								<Card className="p-6 shadow-lg hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer group">
									<div className="flex items-start justify-between mb-2">
										<div>
											<h2 className="text-xl font-bold group-hover:text-primary transition-colors">{item.title}</h2>
											<h3 className="text-lg font-medium group-hover:text-foreground/90 transition-colors">
												{item.company}
											</h3>
										</div>
										<span className="text-sm font-medium bg-primary/10 text-primary rounded-full px-3 py-1 whitespace-nowrap group-hover:bg-primary/20 transition-colors">
											{item.date}
										</span>
									</div>

									<div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors mb-4">
										<CiGlobe className="h-4 w-4 mr-1 group-hover:text-primary/80 transition-colors" />
										{item.location}
									</div>

									<p className="mb-4 group-hover:text-foreground/90 transition-colors">{item.description}</p>

									<div className="mb-4">
										<h4 className="text-sm font-bold mb-2">
											Key Achievements:
										</h4>
										<ul className="list-disc pl-5 space-y-1">
											{item.achievements.map((achievement, idx) => (
												<li key={idx} className="text-sm">
													{achievement}
												</li>
											))}
										</ul>
									</div>

									<div className="flex flex-wrap gap-2">
										{item.technologies.map((tech, idx) => (
											<span
												key={idx}
												className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-md"
											>
												{tech}
											</span>
										))}
									</div>
								</Card>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Mobile timeline (visible only on mobile) */}
			<div className="md:hidden px-4">
				<div className="relative space-y-12">
					{/* Timeline line */}
					<div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

					{detailedExperience.map((item, index) => (
						<div key={index} className="relative pl-16 group">
							{/* Timeline node */}
							<div className="absolute left-0 flex items-center justify-center w-12 h-12 rounded-full bg-background border-2 border-primary shadow-lg group-hover:scale-105 group-hover:border-primary/80 group-hover:shadow-md transition-all duration-200">
								<div className="text-primary/80 group-hover:text-primary transition-colors">
									{item.icon}
								</div>
							</div>

							<Card className="p-4 shadow-lg hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer group">
								<div className="mb-2">
									<h2 className="text-xl font-bold group-hover:text-primary transition-colors">{item.title}</h2>
									<h3 className="text-lg font-medium group-hover:text-foreground/90 transition-colors">{item.company}</h3>
									<span className="text-sm font-medium bg-primary/10 text-primary rounded-full px-2 py-0.5 inline-block mt-1 group-hover:bg-primary/20 transition-colors">
										{item.date}
									</span>
								</div>

								<div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors mb-4">
									<CiGlobe className="h-4 w-4 mr-1 group-hover:text-primary/80 transition-colors" />
									{item.location}
								</div>

								<p className="mb-4 group-hover:text-foreground/90 transition-colors">{item.description}</p>

								<div className="mb-4">
									<h4 className="text-sm font-bold mb-2">
										Key Achievements:
									</h4>
									<ul className="list-disc pl-5 space-y-1">
										{item.achievements.map((achievement, idx) => (
											<li key={idx} className="text-sm">
												{achievement}
											</li>
										))}
									</ul>
								</div>

								<div className="flex flex-wrap gap-2">
									{item.technologies.map((tech, idx) => (
										<span
											key={idx}
											className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-md"
										>
											{tech}
										</span>
									))}
								</div>
							</Card>
						</div>
					))}
				</div>
			</div>
			</div>
		</div>
	)
}
