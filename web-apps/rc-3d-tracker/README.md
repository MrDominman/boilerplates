# RC 3D Printing Project Tracker

A comprehensive web-based tool for managing RC aircraft 3D printing projects, tracking components, and monitoring printing progress.

## Features

- **Project Management**: Create and organize 3D printing projects with aircraft model specifications
- **Component Tracking**: Track required components with purchase status and quantities
- **Parts Management**: Monitor printable parts with estimated print times and weights
- **Progress Visualization**: View project completion status with interactive dashboards
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## User Stories

### ✅ User Story 1: Project Creation
As a user, I want to create a new 3D printing project so I can organize my build.
- Input project name, aircraft model (F-35, A330-300, etc.), and description
- Organize multiple projects in a centralized dashboard

### ✅ User Story 2: Component Management
As a user, I want to add components to my project so I know what to buy.
- Add component details (name, quantity, purchase status)
- Track items like "XFly 50mm EDF" and "6S 5000mAh battery"
- Mark components as purchased with checkbox functionality

### ✅ User Story 3: Parts Tracking
As a user, I want to add printable parts to my project so I can track printing progress.
- Add part specifications (name, print time, weight, status)
- Track files like "Wing_L_OnePiece.stl" and "Fuselage1"
- Monitor printing progress with completion checkboxes

### ✅ User Story 4: Project Summary
As a user, I want to view a summary of my project so I can see overall progress.
- Display total components and parts counts
- Show progress bars for purchased and printed items
- Calculate completion percentages and project metrics

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Backend**: Node.js with Express.js
- **Database**: SQLite for local data persistence
- **Styling**: CSS Modules with responsive design
- **Deployment**: Docker containers for easy setup

## Quick Start

### Using Docker (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd web-apps/rc-3d-tracker

# Start the application
docker-compose up -d

# Access the application
open http://localhost:3000
```

### Manual Setup
```bash
# Install backend dependencies
cd backend
npm install
npm run dev

# Install frontend dependencies (in new terminal)
cd frontend
npm install
npm start
```

## Project Structure

```
rc-3d-tracker/
├── frontend/           # React TypeScript application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Main application pages
│   │   ├── hooks/      # Custom React hooks
│   │   ├── utils/      # Utility functions
│   │   └── styles/     # CSS modules and styling
│   └── package.json
├── backend/            # Express.js API server
│   ├── routes/         # API route handlers
│   ├── models/         # Database models
│   ├── database/       # Database schema and initialization
│   └── package.json
├── docs/               # Documentation
└── docker-compose.yml  # Container orchestration
```

## API Endpoints

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Components
- `GET /api/projects/:id/components` - List project components
- `POST /api/projects/:id/components` - Add component
- `PUT /api/components/:id` - Update component
- `DELETE /api/components/:id` - Delete component

### Parts
- `GET /api/projects/:id/parts` - List project parts
- `POST /api/projects/:id/parts` - Add part
- `PUT /api/parts/:id` - Update part
- `DELETE /api/parts/:id` - Delete part

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues, please create an issue in the repository or contact the development team.

