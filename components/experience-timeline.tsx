import { Card } from "@/components/ui/card"
import { IoBriefcaseOutline, IoSchoolOutline } from "react-icons/io5";
import { FaCode } from "react-icons/fa6";
import { LuLightbulb } from "react-icons/lu";

// NOTE: This component is currently disabled in the home page.
// To enable it:
// 1. Uncomment the import in app/page.tsx
// 2. Uncomment the component usage in app/page.tsx
// 3. Optionally, uncomment the navbar link in components/navbar.tsx
// 4. Set EXPERIENCE_ENABLED to true in app/experience/page.tsx if you want to enable the detailed page
//    (currently configured to show the 404 page)

const timelineEvents = [
	{
		title: "Senior Frontend Developer",
		company: "TechCorp Inc.",
		date: "2023 - Present",
		description:
			"Leading frontend development for enterprise SaaS products, focusing on React, TypeScript, and Next.js.",
		icon: <IoBriefcaseOutline className="h-5 w-5" />,
	},
	{
		title: "Full Stack Developer",
		company: "Innovate Solutions",
		date: "2020 - 2023",
		description:
			"Built and maintained scalable web applications using React, Node.js, and PostgreSQL.",
		icon: <FaCode className="h-5 w-5" />,
	},
	{
		title: "Open Source Contribution",
		company: "React Community",
		date: "2019",
		description:
			"Contributed to several popular React libraries and maintained personal open source projects.",
		icon: <LuLightbulb className="h-5 w-5" />,
	},
	{
		title: "Junior Web Developer",
		company: "Digital Studio",
		date: "2018 - 2020",
		description:
			"Started career working with JavaScript, HTML/CSS, and basic backend systems.",
		icon: <FaCode className="h-5 w-5" />,
	},
	{
		title: "Computer Science Degree",
		company: "Tech University",
		date: "2014 - 2018",
		description:
			"Bachelor's degree with focus on software engineering and web technologies.",
		icon: <IoSchoolOutline className="h-5 w-5" />,
	},
]

export function ExperienceTimeline() {
	return (
		<section className="pt-2 pb-8">
			<div className="flex items-center justify-center mb-8">
				<h2 className="text-2xl font-semibold">Experience</h2>
			</div>
			
			<div className="flex flex-col gap-4">
				{/* Desktop timeline (hidden on mobile) */}
				<div className="relative hidden md:block">
					{/* Timeline line */}
					<div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border" />

					{/* Timeline events */}
					<div className="space-y-12">
						{timelineEvents.map((event, index) => (
							<div
								key={index}
								className={`flex items-center ${
									index % 2 === 0 ? "flex-row-reverse" : ""
								}`}
							>
								<div className="w-1/2" />

								{/* Timeline node */}
								<div className="z-10 flex items-center justify-center w-12 h-12 rounded-full bg-background border-2 border-primary mx-auto shadow-lg group-hover:scale-105 group-hover:border-primary/80 group-hover:shadow-md transition-all duration-200">
									<div className="text-primary/80 group-hover:text-primary transition-colors">
										{event.icon}
									</div>
								</div>

								<div className="w-1/2">
																	<Card
									className={`p-4 shadow-md mx-4 ${
										index % 2 === 0 ? "ml-8" : "mr-8"
									} hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer group`}
								>
									<h3 className="font-bold">{event.title}</h3>
									<div className="flex justify-between items-center">
										<span className="text-sm text-muted-foreground">
											{event.company}
										</span>
										<span className="text-sm font-medium bg-primary/10 text-primary rounded-full px-2 py-0.5">
											{event.date}
										</span>
									</div>
									<p className="mt-2 text-sm text-muted-foreground">
										{event.description}
									</p>
								</Card>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Mobile timeline (visible only on mobile) */}
				<div className="md:hidden">
					<div className="relative space-y-8">
						{/* Timeline line */}
						<div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

						{timelineEvents.map((event, index) => (
							<div key={index} className="relative pl-16">
								{/* Timeline node */}
								<div className="absolute left-0 flex items-center justify-center w-12 h-12 rounded-full bg-background border-2 border-primary shadow-lg group-hover:scale-105 group-hover:border-primary/80 group-hover:shadow-md transition-all duration-200">
									<div className="text-primary/80 group-hover:text-primary transition-colors">
										{event.icon}
									</div>
								</div>

															<Card className="p-4 shadow-md hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer group">
								<h3 className="font-bold">{event.title}</h3>
								<div className="flex justify-between items-center flex-wrap gap-1">
									<span className="text-sm text-muted-foreground">
										{event.company}
									</span>
									<span className="text-sm font-medium bg-primary/10 text-primary rounded-full px-2 py-0.5">
										{event.date}
									</span>
								</div>
								<p className="mt-2 text-sm text-muted-foreground">
									{event.description}
								</p>
							</Card>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}
