import dotenv from "dotenv";
dotenv.config({ path: process.cwd() + "/.env" });
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import connectMongoDB from "../db/connectMongoDB.js";

const seedUsers = [
	{
		username: "alexcode",
		fullName: "Alex Thompson",
		email: "alex@commitly.dev",
		password: "password123",
		bio: "Full-stack developer | React enthusiast | TypeScript lover",
		profileImg: "/avatars/boy1.jpg",
		coverImg: "/cover.png",
		link: "https://alexthompson.dev",
	},
	{
		username: "sarah_dev",
		fullName: "Sarah Chen",
		email: "sarah@commitly.dev", 
		password: "password123",
		bio: "Frontend wizard | Vue.js core contributor | UI/UX passionate",
		profileImg: "/avatars/boy2.jpg",
		coverImg: "/cover.png",
		link: "https://sarahchen.design",
	},
	{
		username: "mikecoder",
		fullName: "Mike Rodriguez",
		email: "mike@commitly.dev",
		password: "password123", 
		bio: "Backend engineer | Python & Go | Cloud architecture",
		profileImg: "/avatars/boy3.jpg",
		coverImg: "/cover.png",
		link: "https://mikerodriguez.tech",
	},
	{
		username: "cloud_expert",
		fullName: "Emma Wilson",
		email: "emma@commitly.dev",
		password: "password123",
		bio: "DevOps engineer | Kubernetes certified | AWS solutions architect",
		profileImg: "/avatars/boy4.jpg",
		coverImg: "/cover.png",
		link: "https://emmawilson.cloud",
	},
	{
		username: "devops_ninja",
		fullName: "David Park",
		email: "david@commitly.dev",
		password: "password123",
		bio: "DevOps specialist | Docker & K8s | Automation enthusiast",
		profileImg: "/avatars/boy5.jpg",
		coverImg: "/cover.png",
		link: "https://davidpark.dev",
	},
	{
		username: "ai_enthusiast",
		fullName: "Jessica Liu",
		email: "jessica@commitly.dev",
		password: "password123",
		bio: "AI/ML engineer | Python & TensorFlow | Computer vision researcher",
		profileImg: "/avatars/boy6.jpg",
		coverImg: "/cover.png",
		link: "https://jessicaliu.ai",
	},
	{
		username: "security_first",
		fullName: "Ryan Cooper",
		email: "ryan@commitly.dev",
		password: "password123",
		bio: "Security engineer | Penetration testing | Cybersecurity consultant",
		profileImg: "/avatars/boy1.jpg",
		coverImg: "/cover.png",
		link: "https://ryancooper.security",
	},
	{
		username: "realtime_dev",
		fullName: "Sophie Martinez",
		email: "sophie@commitly.dev",
		password: "password123",
		bio: "Real-time systems developer | WebSocket expert | Event-driven architecture",
		profileImg: "/avatars/boy2.jpg",
		coverImg: "/cover.png",
		link: "https://sophiemartinez.dev",
	},
	{
		username: "graphql_fan",
		fullName: "Marcus Johnson",
		email: "marcus@commitly.dev",
		password: "password123",
		bio: "GraphQL specialist | API design | Developer experience enthusiast",
		profileImg: "/avatars/boy3.jpg",
		coverImg: "/cover.png",
		link: "https://marcusjohnson.graphql",
	},
	{
		username: "rust_learner",
		fullName: "Olivia Davis",
		email: "olivia@commitly.dev",
		password: "password123",
		bio: "Systems programmer | Rust advocate | Performance optimization",
		profileImg: "/avatars/boy4.jpg",
		coverImg: "/cover.png",
		link: "https://oliviadavis.rust",
	},
];

const seedPosts = [
	{
		text: "Just shipped a new React component library with TypeScript support! 🚀 Finally, no more prop-types headaches. The developer experience is so much smoother now.",
		img: "/posts/post1.jpg",
		username: "alexcode",
	},
	{
		text: "Working on a new microservices architecture with Docker and Kubernetes. The learning curve is steep but the scalability benefits are incredible! 📈",
		username: "devops_ninja",
	},
	{
		text: "AI-generated code review bot just caught a memory leak I completely missed! 🤖 The future of development is here. This saved hours of debugging.",
		img: "/posts/post2.jpg",
		username: "ai_enthusiast",
	},
	{
		text: "Refactored our entire authentication system to use OAuth 2.0 with refresh tokens. Security is no joke in 2024! 🔐 Also improved performance by 40%.",
		username: "security_first",
	},
	{
		text: "Building a real-time chat app with WebSockets and Redis. The message delivery is lightning fast! ⚡ Next step: implementing end-to-end encryption.",
		img: "/posts/post3.jpg",
		username: "realtime_dev",
	},
	{
		text: "Just discovered the power of GraphQL subscriptions! Real-time updates without polling. Mind = blown 🤯 The developer experience is phenomenal.",
		username: "graphql_fan",
	},
	{
		text: "Implementing a CI/CD pipeline with GitHub Actions. Automated testing, deployment, and code quality checks. DevOps automation at its finest! 🔄",
		username: "cloud_expert",
	},
	{
		text: "Exploring Rust for systems programming. The memory safety guarantees are incredible, but the learning curve is real! 🦀 Coming from JavaScript, it's a whole new world.",
		username: "rust_learner",
	},
	{
		text: "Built a machine learning model for code completion. 93% accuracy on predicting the next line of code! 🧠 The future of IDE assistance is bright.",
		img: "/posts/post1.jpg",
		username: "ai_enthusiast",
	},
	{
		text: "Migrated our monolith to serverless functions. Cold start times were concerning at first, but the scalability and cost savings are worth it! ☁️",
		username: "cloud_expert",
	},
	{
		text: "Created a new Vue.js animation library with CSS-in-JS support. Smooth 60fps animations with zero configuration needed! ✨",
		username: "sarah_dev",
	},
	{
		text: "Deep diving into WebAssembly for high-performance web applications. The speed improvements are remarkable! 🏎️ Native performance in the browser.",
		username: "mikecoder",
	},
	{
		text: "Implementing zero-trust security architecture. Every request verified, every connection encrypted. Security by design! 🛡️",
		username: "security_first",
	},
	{
		text: "Building a distributed event streaming platform with Apache Kafka. Real-time data processing at scale! 📊",
		username: "realtime_dev",
	},
	{
		text: "New GraphQL federation setup allows independent team deployments while maintaining a unified API. Developer productivity through the roof! 🚀",
		username: "graphql_fan",
	},
];

const seedComments = [
	{
		text: "This looks amazing! Any plans for Vue.js support?",
		username: "sarah_dev",
	},
	{
		text: "The TypeScript integration is solid. Great work! 👏",
		username: "mikecoder",
	},
	{
		text: "Kubernetes can be overwhelming at first. Have you tried Helm charts?",
		username: "cloud_expert",
	},
	{
		text: "Which AI tool are you using? Sounds very promising!",
		username: "mikecoder",
	},
	{
		text: "OAuth can be tricky to implement correctly. Any good resources you'd recommend?",
		username: "sarah_dev",
	},
	{
		text: "40% performance improvement is huge! What was the bottleneck?",
		username: "alexcode",
	},
	{
		text: "WebSockets are amazing for real-time features. How are you handling reconnections?",
		username: "graphql_fan",
	},
	{
		text: "GraphQL subscriptions vs WebSockets - which do you prefer?",
		username: "realtime_dev",
	},
	{
		text: "Rust's ownership model is brilliant once it clicks. Stick with it!",
		username: "alexcode",
	},
	{
		text: "That's impressive! What dataset did you train on?",
		username: "ai_enthusiast",
	},
];

const seedDatabase = async () => {
	try {
		console.log("🌱 Starting database seeding...");

		// Connect to MongoDB
		await connectMongoDB();

		// Clear existing data
		console.log("🗑️  Clearing existing data...");
		await User.deleteMany({});
		await Post.deleteMany({});

		// Create users
		console.log("👥 Creating users...");
		const createdUsers = [];

		for (const userData of seedUsers) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(userData.password, salt);

			const user = new User({
				...userData,
				password: hashedPassword,
			});

			const savedUser = await user.save();
			createdUsers.push(savedUser);
			console.log(`✅ Created user: ${userData.username}`);
		}

		// Create some follow relationships
		console.log("🔗 Creating follow relationships...");
		for (let i = 0; i < createdUsers.length; i++) {
			const user = createdUsers[i];
			const randomFollowers = createdUsers
				.filter((u) => u._id.toString() !== user._id.toString())
				.sort(() => 0.5 - Math.random())
				.slice(0, Math.floor(Math.random() * 4) + 1);

			for (const follower of randomFollowers) {
				if (!user.followers.includes(follower._id)) {
					user.followers.push(follower._id);
					follower.following.push(user._id);
					await follower.save();
				}
			}
			await user.save();
		}

		// Create posts
		console.log("📝 Creating posts...");
		const createdPosts = [];

		for (const postData of seedPosts) {
			const user = createdUsers.find((u) => u.username === postData.username);
			if (user) {
				const post = new Post({
					user: user._id,
					text: postData.text,
					img: postData.img || "",
					likes: [],
					comments: [],
				});

				const savedPost = await post.save();
				createdPosts.push(savedPost);
				console.log(`✅ Created post by: ${postData.username}`);
			}
		}

		// Add likes to posts
		console.log("❤️  Adding likes to posts...");
		for (const post of createdPosts) {
			const randomLikers = createdUsers
				.sort(() => 0.5 - Math.random())
				.slice(0, Math.floor(Math.random() * 6) + 1);

			for (const liker of randomLikers) {
				if (!post.likes.includes(liker._id)) {
					post.likes.push(liker._id);
					liker.likedPosts.push(post._id);
					await liker.save();
				}
			}
			await post.save();
		}

		// Add comments to posts
		console.log("💬 Adding comments to posts...");
		for (let i = 0; i < Math.min(seedComments.length, createdPosts.length); i++) {
			const post = createdPosts[i];
			const commentData = seedComments[i];
			const commenter = createdUsers.find((u) => u.username === commentData.username);

			if (commenter && post.user.toString() !== commenter._id.toString()) {
				post.comments.push({
					text: commentData.text,
					user: commenter._id,
				});
				await post.save();
				console.log(`✅ Added comment to post by: ${commentData.username}`);
			}
		}

		console.log("🎉 Database seeding completed successfully!");
		console.log(`👥 Created ${createdUsers.length} users`);
		console.log(`📝 Created ${createdPosts.length} posts`);
		console.log(`💬 Added ${seedComments.length} comments`);

		process.exit(0);
	} catch (error) {
		console.error("❌ Error seeding database:", error);
		process.exit(1);
	}
};

seedDatabase();
