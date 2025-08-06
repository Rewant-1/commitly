export const POSTS = [
	{
		_id: "1",
		text: "Just shipped a new React component library with TypeScript support! 🚀 Finally, no more prop-types headaches. The developer experience is so much smoother now.",
		img: "/posts/post1.jpg",
		user: {
			username: "alexcode",
			profileImg: "/avatars/boy1.jpg",
			fullName: "Alex Thompson",
		},
		comments: [
			{
				_id: "1",
				text: "This looks amazing! Any plans for Vue.js support?",
				user: {
					username: "sarah_dev",
					profileImg: "/avatars/boy2.jpg",
					fullName: "Sarah Chen",
				},
			},
			{
				_id: "2", 
				text: "The TypeScript integration is solid. Great work! 👏",
				user: {
					username: "mikecoder",
					profileImg: "/avatars/boy3.jpg",
					fullName: "Mike Rodriguez",
				},
			},
		],
		likes: ["6658s891", "6658s892", "6658s893", "6658s894", "6658s895"],
		createdAt: "2024-12-15T10:30:00Z",
	},
	{
		_id: "2",
		text: "Working on a new microservices architecture with Docker and Kubernetes. The learning curve is steep but the scalability benefits are incredible! �",
		user: {
			username: "devops_ninja",
			profileImg: "/avatars/boy2.jpg",
			fullName: "David Park",
		},
		comments: [
			{
				_id: "1",
				text: "Kubernetes can be overwhelming at first. Have you tried Helm charts?",
				user: {
					username: "cloud_expert",
					profileImg: "/avatars/boy4.jpg",
					fullName: "Emma Wilson",
				},
			},
		],
		likes: ["6658s891", "6658s892", "6658s893"],
		createdAt: "2024-12-15T08:45:00Z",
	},
	{
		_id: "3",
		text: "AI-generated code review bot just caught a memory leak I completely missed! 🤖 The future of development is here. This saved hours of debugging.",
		img: "/posts/post2.jpg",
		user: {
			username: "ai_enthusiast",
			profileImg: "/avatars/boy3.jpg",
			fullName: "Jessica Liu",
		},
		comments: [
			{
				_id: "1",
				text: "Which AI tool are you using? Sounds very promising!",
				user: {
					username: "curious_dev",
					profileImg: "/avatars/boy5.jpg",
					fullName: "Tom Anderson",
				},
			},
		],
		likes: ["6658s891", "6658s892", "6658s893", "6658s894", "6658s895", "6658s896", "6658s897"],
		createdAt: "2024-12-15T06:20:00Z",
	},
	{
		_id: "4",
		text: "Refactored our entire authentication system to use OAuth 2.0 with refresh tokens. Security is no joke in 2024! 🔐 Also improved performance by 40%.",
		user: {
			username: "security_first",
			profileImg: "/avatars/boy4.jpg",
			fullName: "Ryan Cooper",
		},
		comments: [
			{
				_id: "1",
				text: "OAuth can be tricky to implement correctly. Any good resources you'd recommend?",
				user: {
					username: "junior_dev",
					profileImg: "/avatars/boy6.jpg",
					fullName: "Lisa Zhang",
				},
			},
			{
				_id: "2",
				text: "40% performance improvement is huge! What was the bottleneck?",
				user: {
					username: "performance_geek",
					profileImg: "/avatars/boy1.jpg",
					fullName: "Carlos Garcia",
				},
			},
		],
		likes: ["6658s891", "6658s892", "6658s893", "6658s894"],
		createdAt: "2024-12-15T04:15:00Z",
	},
	{
		_id: "5",
		text: "Building a real-time chat app with WebSockets and Redis. The message delivery is lightning fast! ⚡ Next step: implementing end-to-end encryption.",
		img: "/posts/post3.jpg",
		user: {
			username: "realtime_dev",
			profileImg: "/avatars/boy5.jpg",
			fullName: "Sophie Martinez",
		},
		comments: [
			{
				_id: "1",
				text: "WebSockets are amazing for real-time features. How are you handling reconnections?",
				user: {
					username: "chat_expert",
					profileImg: "/avatars/boy2.jpg",
					fullName: "Daniel Kim",
				},
			},
		],
		likes: ["6658s891", "6658s892", "6658s893", "6658s894", "6658s895", "6658s896"],
		createdAt: "2024-12-15T02:30:00Z",
	},
	{
		_id: "6",
		text: "Just discovered the power of GraphQL subscriptions! Real-time updates without polling. Mind = blown 🤯 The developer experience is phenomenal.",
		user: {
			username: "graphql_fan",
			profileImg: "/avatars/boy6.jpg",
			fullName: "Marcus Johnson",
		},
		comments: [
			{
				_id: "1",
				text: "GraphQL subscriptions vs WebSockets - which do you prefer?",
				user: {
					username: "tech_curious",
					profileImg: "/avatars/boy3.jpg",
					fullName: "Anna Brown",
				},
			},
		],
		likes: ["6658s891", "6658s892"],
		createdAt: "2024-12-14T22:45:00Z",
	},
	{
		_id: "7",
		text: "Implementing a CI/CD pipeline with GitHub Actions. Automated testing, deployment, and code quality checks. DevOps automation at its finest! 🔄",
		user: {
			username: "cicd_master",
			profileImg: "/avatars/boy1.jpg",
			fullName: "Jake Williams",
		},
		comments: [],
		likes: ["6658s891", "6658s892", "6658s893", "6658s894", "6658s895"],
		createdAt: "2024-12-14T20:10:00Z",
	},
	{
		_id: "8", 
		text: "Exploring Rust for systems programming. The memory safety guarantees are incredible, but the learning curve is real! 🦀 Coming from JavaScript, it's a whole new world.",
		user: {
			username: "rust_learner",
			profileImg: "/avatars/boy2.jpg",
			fullName: "Olivia Davis",
		},
		comments: [
			{
				_id: "1",
				text: "Rust's ownership model is brilliant once it clicks. Stick with it!",
				user: {
					username: "rust_veteran",
					profileImg: "/avatars/boy4.jpg",
					fullName: "Peter Schmidt",
				},
			},
		],
		likes: ["6658s891", "6658s892", "6658s893"],
		createdAt: "2024-12-14T18:30:00Z",
	},
	{
		_id: "9",
		text: "Built a machine learning model for code completion. 93% accuracy on predicting the next line of code! 🧠 The future of IDE assistance is bright.",
		img: "/posts/post1.jpg",
		user: {
			username: "ml_coder",
			profileImg: "/avatars/boy5.jpg",
			fullName: "Kevin O'Connor",
		},
		comments: [
			{
				_id: "1",
				text: "That's impressive! What dataset did you train on?",
				user: {
					username: "data_scientist",
					profileImg: "/avatars/boy6.jpg",
					fullName: "Rachel Green",
				},
			},
		],
		likes: ["6658s891", "6658s892", "6658s893", "6658s894", "6658s895", "6658s896", "6658s897", "6658s898"],
		createdAt: "2024-12-14T16:20:00Z",
	},
	{
		_id: "10",
		text: "Migrated our monolith to serverless functions. Cold start times were concerning at first, but the scalability and cost savings are worth it! ☁️",
		user: {
			username: "serverless_advocate",
			profileImg: "/avatars/boy3.jpg",
			fullName: "Benjamin Lee",
		},
		comments: [
			{
				_id: "1", 
				text: "How did you handle database connections in serverless?",
				user: {
					username: "backend_dev",
					profileImg: "/avatars/boy1.jpg",
					fullName: "Victoria Taylor",
				},
			},
		],
		likes: ["6658s891", "6658s892", "6658s893", "6658s894"],
		createdAt: "2024-12-14T14:05:00Z",
	},
];

export const USERS_FOR_RIGHT_PANEL = [
	{
		_id: "1",
		fullName: "Alex Thompson",
		username: "alexcode",
		profileImg: "/avatars/boy1.jpg",
		bio: "Full-stack developer | React enthusiast | TypeScript lover",
		followers: 1243,
		following: 456,
		isVerified: true,
	},
	{
		_id: "2", 
		fullName: "Sarah Chen",
		username: "sarah_dev",
		profileImg: "/avatars/boy2.jpg",
		bio: "Frontend wizard | Vue.js core contributor | UI/UX passionate",
		followers: 987,
		following: 234,
		isVerified: false,
	},
	{
		_id: "3",
		fullName: "Mike Rodriguez", 
		username: "mikecoder",
		profileImg: "/avatars/boy3.jpg",
		bio: "Backend engineer | Python & Go | Cloud architecture",
		followers: 756,
		following: 189,
		isVerified: true,
	},
	{
		_id: "4",
		fullName: "Emma Wilson",
		username: "cloud_expert", 
		profileImg: "/avatars/boy4.jpg",
		bio: "DevOps engineer | Kubernetes certified | AWS solutions architect",
		followers: 2134,
		following: 567,
		isVerified: true,
	},
	{
		_id: "5",
		fullName: "David Park",
		username: "devops_ninja",
		profileImg: "/avatars/boy5.jpg", 
		bio: "DevOps specialist | Docker & K8s | Automation enthusiast",
		followers: 1567,
		following: 423,
		isVerified: false,
	},
	{
		_id: "6",
		fullName: "Jessica Liu",
		username: "ai_enthusiast",
		profileImg: "/avatars/boy6.jpg",
		bio: "AI/ML engineer | Python & TensorFlow | Computer vision researcher",
		followers: 3421,
		following: 234,
		isVerified: true,
	},
];