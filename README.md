# Ahmad Ziyad - Professional Portfolio

A modern, AI-themed portfolio website showcasing professional experience, skills, certifications, and projects. Built with React, TypeScript, and modern web technologies.

🌐 **Live Demo**: [https://ahmad-ziyad-portfolio.vercel.app](https://ahmad-ziyad-portfolio.vercel.app)

## 🚀 Features

- **Modern AI Theme**: Neural gradients, glass morphism effects, and dynamic animations
- **Interactive Tabs**: Skills, Experience, Personal Projects, Certifications, Contact, and Profile
- **Floating Chat Widget**: AI-powered chatbot for visitor interactions
- **Real Certifications**: 11+ professional certifications from AWS, Microsoft, Oracle, and NVIDIA
- **Comprehensive Skills**: Focus on AWS, DevOps, AI/ML, and enterprise technologies
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Performance Optimized**: Fast loading with modern React patterns

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Styled Components** for styling
- **Framer Motion** for animations
- **Modern CSS** with glass morphism effects

### Backend (Optional)
- **Node.js** with Express
- **Ollama** integration for AI chat
- **Redis** for session management

### Deployment
- **Vercel** for frontend hosting
- **GitHub Actions** for CI/CD
- **Docker** for containerization

## 🏗️ Project Structure

```
portfolio/
├── packages/
│   ├── frontend/         # React portfolio application
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── profile/
│   │   │   │   ├── ChatBotWidget.tsx
│   │   │   │   └── TabNavigation.tsx
│   │   │   ├── styles/
│   │   │   │   ├── aiTheme.ts
│   │   │   │   └── theme.ts
│   │   │   ├── data/
│   │   │   └── App.tsx
│   │   ├── public/
│   │   └── package.json
│   ├── backend/          # Optional AI chat backend
│   └── shared/           # Shared types and utilities
├── .github/
│   └── workflows/        # GitHub Actions
├── docker-compose.yml
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ahmad-ziyad-portfolio.git
   cd ahmad-ziyad-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev:frontend
   ```

4. **Access the application**
   - Portfolio: http://localhost:3000

### Full Stack Development (with AI Chat)

1. **Start all services**
   ```bash
   npm run setup
   ```
   This will start:
   - Frontend on port 3000
   - Backend API on port 3001
   - Docker services (Redis, Ollama)

## 📝 Available Scripts

```bash
# Development
npm run dev:frontend          # Start frontend only
npm run dev:backend          # Start backend only
npm run dev                  # Start both frontend and backend

# Building
npm run build               # Build all packages
npm run build:frontend      # Build frontend only

# Testing
npm run test               # Run all tests
npm run lint              # Lint all packages

# Docker
npm run docker:up         # Start Docker services
npm run docker:down       # Stop Docker services
npm run setup            # Complete development setup
```

## 🌟 Key Features

### Professional Sections

1. **Skills Tab**
   - AWS Cloud Services (Expert level)
   - DevOps & Infrastructure (Kubernetes, Docker, CI/CD)
   - AI/ML Technologies (TensorFlow, PyTorch, LangChain)
   - Programming Languages (Python, Java, JavaScript, TypeScript)
   - Monitoring & Observability (Prometheus, Grafana, Dynatrace, Splunk)

2. **Experience Tab**
   - AI Software Engineer/Architect roles
   - Enterprise-level project experience
   - Leadership and mentorship background

3. **Certifications Tab**
   - AWS Certified Solutions Architect
   - Microsoft Azure certifications
   - Oracle Cloud certifications
   - NVIDIA AI/ML certifications
   - All with verification links

4. **Personal Projects Tab**
   - IntelGen Studio (AI Chat Application)
   - Other portfolio projects
   - Live demo links and source code

5. **Contact Tab**
   - Professional contact information
   - Social media links
   - Location and availability

### AI Chat Integration

- **Floating Chat Widget**: Bottom-right positioned chat interface
- **AI-Powered Responses**: Integration with Ollama and Mistral 7B model
- **Professional Context**: Chat responses tailored to portfolio content
- **Smooth Animations**: Modern UI/UX with glass morphism effects

## 🎨 Design System

### AI Theme
- **Neural Gradients**: Subtle, professional color schemes
- **Glass Morphism**: Modern translucent effects
- **Dynamic Animations**: Smooth transitions and hover effects
- **Responsive Layout**: Mobile-first design approach

### Color Palette
- **Background**: Deep dark (#0D0D0D) for professional look
- **Text**: High contrast white (#FFFFFF) for readability
- **Accents**: Subtle grays and blues for modern appeal
- **Animations**: Pulsing effects and gradient sweeps

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Fork this repository**
2. **Connect to Vercel**
   - Import project from GitHub
   - Select the `packages/frontend` directory
   - Deploy automatically

3. **Custom Domain** (Optional)
   - Add your custom domain in Vercel dashboard
   - Configure DNS settings

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build:frontend
   ```

2. **Deploy to your hosting provider**
   - Upload `packages/frontend/build` directory
   - Configure web server (nginx/Apache)

### Docker Deployment

```bash
# Build and run with Docker
docker-compose up -d

# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

## � PCustomization

### Personal Information
Update the following files with your information:

1. **Profile Data**: `packages/frontend/src/data/sampleProfile.ts`
2. **Skills**: Update skills categories and proficiency levels
3. **Experience**: Add your work experience and achievements
4. **Certifications**: Replace with your certifications and links
5. **Projects**: Add your personal and professional projects

### Styling
- **Theme Colors**: `packages/frontend/src/styles/aiTheme.ts`
- **Component Styles**: Individual component files
- **Animations**: Framer Motion configurations

### AI Chat (Optional)
- **Backend Configuration**: `packages/backend/src/config/`
- **Chat Responses**: Update knowledge base in backend
- **Model Selection**: Change Ollama model in configuration

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3s

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/enhancement`)
3. Make your changes
4. Test thoroughly (`npm run test`)
5. Commit changes (`git commit -m 'Add enhancement'`)
6. Push to branch (`git push origin feature/enhancement`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/ahmad-ziyad-portfolio/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/ahmad-ziyad-portfolio/discussions)
- **Email**: [your-email@example.com](mailto:your-email@example.com)

## 🙏 Acknowledgments

- **Design Inspiration**: Modern AI/ML portfolio websites
- **Icons**: React Icons library
- **Animations**: Framer Motion
- **Hosting**: Vercel for seamless deployment

---

**Built with ❤️ by Ahmad Ziyad** | **AI Software Engineer/Architect**