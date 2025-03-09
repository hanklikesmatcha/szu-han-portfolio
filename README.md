# Personal Portfolio Website

A modern, responsive portfolio website built with SvelteKit and TailwindCSS to showcase my projects, skills, and services.

## Features

- **Home/About Me**: Professional introduction and overview of skills
- **Portfolio**: Showcase of projects with GitHub links, screenshots, and video demos
- **Services**: Detailed information about services offered and expertise
- **Responsive Design**: Optimized for all devices from mobile to desktop

## Technologies Used

- [SvelteKit](https://kit.svelte.dev/) - Full-stack web development framework
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Paraglide](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) - Internationalization

## Setup and Development

### Prerequisites

- Node.js (v18 or newer)
- npm or pnpm

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. Install dependencies

```bash
npm install
# or
pnpm install
```

3. Start the development server

```bash
npm run dev
# or
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Customization

### Personal Information

Update your personal information in the following files:

- `src/routes/+layout.svelte` - Update navigation and footer links
- `src/routes/+page.svelte` - Update about section with your information
- `src/routes/portfolio/+page.svelte` - Add your actual projects
- `src/routes/services/+page.svelte` - Customize services you offer

### Images

Add your images to the `static/images` directory:

- Project screenshots
- Profile photo
- Testimonial photos

## Deployment

This site can be deployed to any platform that supports SvelteKit. Here are a few options:

- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)

Example deployment command:

```bash
npm run build
```

## License

[MIT License](LICENSE)

## Contact

Your Name - [your.email@example.com](mailto:your.email@example.com)

---

Made with ❤️ using SvelteKit and TailwindCSS
