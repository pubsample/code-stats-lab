# Codeforces Analytics Dashboard

A modern, responsive web application for analyzing Codeforces competitive programming statistics. Built with React, TypeScript, and Tailwind CSS.

## Features

- 🔍 **User Search**: Search any Codeforces user by handle
- 📊 **Rating Chart**: Visualize rating progress over time with interactive charts
- 🏆 **Contest History**: View detailed contest performance with rank changes
- 💡 **Problem Statistics**: Analyze solved problems by tags and difficulty levels
- 🎨 **Modern UI**: Clean, responsive design with dark/light theme support
- 📱 **Responsive**: Seamless experience across desktop, tablet, and mobile devices
- ⚡ **Fast Performance**: Optimized data fetching and rendering

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Charts**: Recharts for data visualization
- **Routing**: React Router v6
- **State Management**: TanStack Query (React Query)
- **API**: Codeforces API integration
- **Theme**: next-themes for dark/light mode

## Project URL

**Lovable Project**: https://lovable.dev/projects/d86beb0a-825b-4786-a6c6-b5a73409f00e

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd codeforces-analytics

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

1. Enter a Codeforces handle in the search bar
2. View comprehensive analytics including:
   - User profile with rating and rank
   - Rating progression chart
   - Contest history with performance metrics
   - Problem-solving statistics by tags and difficulty
3. Navigate using the sidebar (collapsible on mobile)
4. Toggle between dark and light themes

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── AppSidebar.tsx  # Navigation sidebar
│   ├── UserSearch.tsx  # Search component
│   ├── UserProfile.tsx # User profile card
│   ├── RatingChart.tsx # Rating visualization
│   ├── ContestHistory.tsx # Contest table
│   ├── ProblemStats.tsx   # Problem statistics
│   └── ThemeToggle.tsx    # Theme switcher
├── services/           # API services
│   └── codeforcesApi.ts # Codeforces API client
├── pages/              # Page components
│   └── Index.tsx       # Main dashboard
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── index.css           # Global styles & design system
```

## API Integration

This project uses the public Codeforces API:
- User information: `/user.info`
- Rating history: `/user.rating`
- User submissions: `/user.status`

No API key required for basic usage.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Editing

You can edit this project in multiple ways:

1. **Lovable IDE**: Visit the [project page](https://lovable.dev/projects/d86beb0a-825b-4786-a6c6-b5a73409f00e)
2. **Local IDE**: Clone and edit with VS Code, WebStorm, etc.
3. **GitHub**: Edit files directly on GitHub
4. **GitHub Codespaces**: Use cloud-based development environment

## Design System

The project uses a comprehensive design system defined in `src/index.css`:
- HSL color tokens for consistent theming
- Custom gradients and shadows
- Smooth transitions and animations
- Responsive breakpoints
- Dark/light mode support

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Deployment

### Deploy with Lovable

1. Visit your [Lovable project](https://lovable.dev/projects/d86beb0a-825b-4786-a6c6-b5a73409f00e)
2. Click Share → Publish
3. Your app will be deployed automatically

### Custom Domain

Connect a custom domain via Project > Settings > Domains in Lovable.

[Learn more about custom domains](https://docs.lovable.dev/features/custom-domain#custom-domain)

### Manual Deployment

Build the project and deploy to any static hosting service:

```bash
npm run build
```

The `dist` folder will contain the production build ready for deployment.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- [Codeforces](https://codeforces.com/) for providing the public API
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Recharts](https://recharts.org/) for data visualization
- Built with [Lovable](https://lovable.dev/)

## Support

For issues, questions, or suggestions, please open an issue on GitHub or contact through the Lovable project page.
