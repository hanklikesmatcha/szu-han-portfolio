// Project data including both personal and professional projects
export const projects = [
	{
		id: 'fanlytics',
		title: 'Fanlytics - Community App for Sports Fans',
		description:
			'Community platform for sports clubs and brands to attract, own and engage their fanbase. Built with Flutter, Cloudflare and Supabase for realtime feeds, chat, groups and geo features.',
		technologies: ['Flutter', 'Cloudflare', 'Supabase', 'Postgres', 'Mobile Development'],
		image: '/images/fanlytics.png',
		featured: true,
		type: 'professional',
		companyName: 'Fanlytics',
		detailsUrl: '/portfolio/fanlytics',
		hideProfessionalBadge: true
	},
	{
		id: 'sja-honey',
		title: 'SJA Honey',
		description:
			'A Computer Vision project that locates bees and queen bees in the hive.  This helps the beekeepers track the health of the hive and the bees.',
		technologies: [
			'Python/FastAPI',
			'Object Detection',
			'Computer Vision',
			'AI/ML',
			'API Development',
			'TypeScript/React',
			'Docker'
		],
		image: '/images/sja.png',
		featured: true,
		type: 'professional',
		liveUrl: 'https://drive.google.com/file/d/1_ruhPJwswtBR7dbCGJivLVKE518cJXgT/view?usp=sharing'
	},
	{
		id: 'gaze-design',
		title: 'Gaze Design',
		description:
			'A cutting-edge interior design tool powered that auto-generates 2D layouts with a video walkthrough of the design.',
		technologies: ['Python/FastAPI', 'Veo 3', 'AI/ML', 'API Development', 'TypeScript/React'],
		image: '/images/gaze.svg',
		featured: true,
		type: 'professional',
		liveUrl: 'https://drive.google.com/file/d/1TebIqH9Z29I26H7KNrSpvA_-011zNrUe/view?usp=sharing'
	},
	{
		id: 'kiaora-oracle',
		title: 'KiaOra Oracle - Mystical Guidance Platform',
		description:
			"A Next.js application providing mystical guidance through an AI-powered oracle experience. Users can ask questions and receive personalized answers based on the card they select, powered by OpenAI's language models. The platform features beautiful animations and an intuitive interface inspired by Māori tradition.",
		technologies: [
			'Next.js',
			'ChatGPT',
			'TypeScript/React',
			'Postgres',
			'Tailwind CSS',
			'Animation'
		],
		liveUrl: 'https://oracle.kiaorahealing.com',
		image: '/images/kiaora-oracle.jpg', // You'll need to add this image
		featured: false,
		type: 'professional'
	},
	{
		id: 'rag-template',
		title: 'Full Control RAG System Template',
		description:
			'A self-hosted Retrieval-Augmented Generation (RAG) system template for AI support, providing deep customization, enhanced data privacy, and transparent control. Built with Python and FastAPI, deployable via Docker, supporting multiple LLM providers and vector databases for knowledge retrieval.',
		technologies: [
			'Python/FastAPI',
			'Docker',
			'Vector Database',
			'AI/ML',
			'RAG',
			'API Development'
		],
		purchaseUrl: 'https://szuhan.gumroad.com/l/rag-template',
		image: '/images/rag-template.jpg',
		featured: true,
		type: 'personal'
	},
	{
		id: 'o3space',
		title: 'O3Space - Social Community App',
		description:
			'A mobile application for the O3 community platform that connects users in a safe, engaging social space. Built with Flutter and Supabase, this app provides a responsive and intuitive interface for community interaction with real-time updates and seamless user experience.',
		technologies: ['Flutter', 'Supabase', 'Postgres', 'Mobile Development', 'Firebase'],
		companyUrl: 'https://www.o3space.org/socialapp',
		image: '/images/o3.jpg',
		featured: true,
		appStoreUrl: 'https://apps.apple.com/nz/app/o3space/id6730118317',
		type: 'professional',
		companyName: 'O3'
	},
	{
		id: 'running4life',
		title: 'Running4Life - Fitness Platform',
		description:
			'A fitness-focused web platform designed to help users track and improve their running performance. This project demonstrates my ability to create clean, user-friendly interfaces for health and wellness applications.',
		technologies: ['Next.js', 'Database', 'Tailwind CSS', 'Animation'],
		githubUrl: 'https://github.com/hanklikesmatcha/running4life',
		liveUrl: 'https://running4life-git-main-hanklikesmatchas-projects.vercel.app/',
		image: '/images/running4life.jpg',
		featured: true,
		type: 'personal'
	},
	{
		id: 'cnc-cost-analysis',
		title: 'CNC Cost Analysis Tool',
		description:
			'A specialized web application for analyzing costs associated with CNC machining operations. This tool helps manufacturers calculate and optimize production costs, demonstrating my ability to develop industry-specific technical solutions.',
		technologies: ['Python/FastAPI', 'TypeScript/React', 'Data Analysis', 'Docker', 'ML'],
		githubUrl: 'https://github.com/hanklikesmatcha/cnc-cost-analysis',
		image: '/images/cnc-cost-analysis.jpg',
		type: 'personal'
	},
	// Professional projects from work experience
	{
		id: 'sharesies-platform',
		title: 'Investment Trading Platform (Sharesies)',
		description:
			'Contributed to a complex investment platform serving hundreds of thousands of users. Led development of several key features, improved system reliability, and enhanced user experience. Utilized microservices architecture to ensure scalability and reliability, working collaboratively in a cross-functional Agile team environment.',
		accomplishments: [
			'Built critical features for order management system',
			'Implemented scheduled tasks for Anti-Money Laundering checks and internal audits',
			'Collaborated in agile environment with cross-functional teams',
			'Implemented microservices architecture for scalability'
		],
		technologies: ['TypeScript', 'React', 'Node.js', 'AWS', 'Microservices', 'GraphQL'],
		companyName: 'Sharesies',
		companyUrl: 'https://sharesies.com.au/',
		image: '/images/sharesies.png',
		type: 'professional'
	},
	{
		id: 'good-registry',
		title: 'Charity Gift Card Generator (The Good Registry)',
		description:
			'Developed a specialized application to generate and manage gift cards for bulk orders, streamlining the workflow for corporate customers. This solution significantly improved operational efficiency by automating a previously manual process, reducing processing time from hours to minutes, and eliminating human error in gift card creation and delivery.',
		accomplishments: [
			'Developed app to automate gift card generation for bulk orders',
			'Integrated with Shopify e-commerce platform',
			'Reduced processing time from hours to minutes',
			'Eliminated manual errors in gift card creation'
		],
		technologies: ['JavaScript', 'Node.js', 'Shopify API', 'E-commerce', 'Automation'],
		companyName: 'The Good Registry',
		companyUrl: 'https://thegoodregistry.com',
		image: '/images/the-good-registry.png',
		type: 'professional'
	},
	{
		id: 'eighty20-ai',
		title: 'Data Analytics & ML Platform (Eighty20.AI)',
		description:
			'Designed and built sophisticated AI solutions for business intelligence and predictive analytics. Developed custom machine learning models that process large datasets to extract actionable insights, implemented data pipelines for efficient processing, and created visualization dashboards that translate complex data into clear business recommendations for clients.',
		accomplishments: [
			'Built data processing pipelines for large-scale analytics',
			'Developed machine learning models for predictive insights',
			'Created interactive data visualization dashboards',
			'Flutter mobile app for data collection and analysis',
			'Utilized AI agents to automate boring tasks'
		],
		technologies: [
			'Python',
			'Machine Learning',
			'Data Science',
			'Cloud Computing',
			'Data Visualization'
		],
		companyName: 'Eighty20.AI',
		companyUrl: 'https://eighty20.ai',
		image: '/images/eighty20-ai.png',
		type: 'professional'
	},
	{
		id: 'octopus-energy',
		title: 'Smart Energy Consumption Platform (Octopus)',
		description:
			'Contributed to the development of an innovative energy management system that helps customers monitor and optimize their energy usage. Built with Django backend and Next.js frontend, enabling seamless customer onboarding and integration with local electricity markets. Implemented real-time data visualization features, integrated with smart home devices, and developed scalable solutions for energy data processing.',
		accomplishments: [
			'Contributed to migration of legacy systems to modern Django/Next.js stack',
			'Built customer onboarding workflows and integration with local electricity markets',
			'Developed real-time energy consumption monitoring with Django REST/GraphQL APIs',
			'Created responsive data visualization dashboards using Next.js and React',
			'Optimized database performance for handling large volumes of energy consumption data'
		],
		technologies: [
			'Django',
			'Next.js',
			'React',
			'TypeScript',
			'IoT Integration',
			'Data Visualization',
			'API Development',
			'GraphQL'
		],
		companyName: 'Octopus Energy',
		companyUrl: 'https://octopusenergy.com',
		image: '/images/octopus-energy.png',
		type: 'professional'
	},
	{
		id: 'taggun',
		title: 'AI-Powered Receipt OCR System (Taggun)',
		description:
			'Worked on an intelligent receipt processing system utilizing computer vision and machine learning for automated data extraction. Enhanced OCR capabilities for improved accuracy in reading diverse receipt formats, implemented classification algorithms to categorize expenses, and built APIs for seamless integration with accounting software platforms.',
		accomplishments: [
			'Enhanced OCR accuracy for receipt data extraction',
			'Implemented ML algorithms for expense categorization',
			'Designed APIs for integration with accounting software',
			'Optimized image processing for mobile device photos'
		],
		technologies: ['Computer Vision', 'Machine Learning', 'OCR', 'Python', 'API Design', 'Node.js'],
		companyName: 'Taggun',
		companyUrl: 'https://www.taggun.io',
		image: '/images/taggun.jpeg',
		type: 'professional'
	},
	{
		id: 'generate-zero',
		title: 'Carbon Footprint Tracking Solution (Generate Zero)',
		description:
			'Currently developing a sustainability platform that helps businesses track, analyze, and reduce their carbon footprint. Creating interactive dashboards for emissions monitoring, implementing data collection workflows that simplify sustainability reporting, and building recommendation systems to suggest actionable emission reduction strategies based on company-specific data patterns.',
		accomplishments: [
			'Building interactive emissions tracking dashboards using React and Django',
			'Developing automated sustainability reporting workflows and client migration processes',
			'Creating recommendation engines for carbon reduction strategies',
			'Integrating with external emissions data sources and local electricity markets',
			'Implementing full stack solutions with Next.js frontend and Node.js backend'
		],
		technologies: [
			'Node.js',
			'Next.js',
			'React',
			'Data Analytics',
			'Azure',
			'Python',
			'Sustainability'
		],
		companyName: 'Generate Zero',
		companyUrl: 'https://generatezero.com',
		image: '/images/logo-placeholder.jpg',
		type: 'professional'
	}
];
