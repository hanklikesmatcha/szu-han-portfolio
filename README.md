# SvelteKit Portfolio Template

A modern, responsive portfolio website template built with SvelteKit and TailwindCSS. This template provides a solid foundation for developers to showcase their projects, skills, and services.

## ✨ Features

- **Modern Tech Stack**: Built with SvelteKit and TailwindCSS
- **Internationalization**: Ready-to-use i18n setup with Paraglide
- **Responsive Design**: Mobile-first approach with beautiful UI components
- **Performance Optimized**: Fast loading times and smooth transitions
- **SEO Friendly**: Meta tags and structured data included
- **Type Safety**: Full TypeScript support
- **Testing Ready**: Vitest setup included

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or newer)
- npm or pnpm

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/sveltekit-portfolio-template.git
cd sveltekit-portfolio-template
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

## 🛠️ Project Structure

```
src/
├── lib/
│   ├── components/     # Reusable UI components
│   ├── paraglide/     # i18n translations
│   ├── styles/        # Global styles and Tailwind config
│   └── server/        # Server-side utilities
├── routes/            # SvelteKit routes
│   ├── +page.svelte   # Home page
│   ├── portfolio/     # Portfolio section
│   └── services/      # Services section
└── app.html          # HTML template
```

## 🎨 Customization

### 1. Personal Information

Update your personal information in the following files:

- `src/routes/+layout.svelte` - Navigation and footer links
- `src/routes/+page.svelte` - About section
- `src/routes/portfolio/+page.svelte` - Project showcase
- `src/routes/services/+page.svelte` - Services offered

### 2. Styling

- The project uses TailwindCSS for styling
- Custom styles can be added in `src/lib/styles/`
- Theme colors can be modified in `tailwind.config.js`

### 3. Internationalization

- Translations are managed in `src/lib/paraglide/`
- Add new languages by creating translation files
- Update language switcher in `src/lib/components/`

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 🙏 Acknowledgments

- [SvelteKit](https://kit.svelte.dev/) - The web framework
- [TailwindCSS](https://tailwindcss.com/) - The CSS framework
- [Paraglide](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) - i18n solution

## 📫 Support

If you find this template helpful, please consider:
- Starring the repository
- Reporting bugs
- Contributing to the project
