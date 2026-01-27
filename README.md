# Portfolio Project

This is a personal portfolio website built with Next.js.

**Live Site:** [ewanc.dev](https://ewanc.dev)

### Clone the Repository

```bash
git clone <repository-url>
cd ewanc-dev
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

Then, add your GitHub personal access token to the `.env.local` file:

```
GITHUB_ACCESS_TOKEN=your_github_token_here
```

You'll need to create a GitHub personal access token if you don't have one. This token is used to fetch your GitHub data for the github commit graph.

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.
