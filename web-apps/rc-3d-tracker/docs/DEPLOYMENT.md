# RC 3D Tracker Deployment Guide

## Overview

This guide covers different deployment options for the RC 3D Tracker application, from local development to production deployment.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 16+ (for manual setup)
- Git

## Quick Start with Docker

### Development Environment

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd web-apps/rc-3d-tracker
   ```

2. **Start the application:**
   ```bash
   docker-compose up -d
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

4. **Stop the application:**
   ```bash
   docker-compose down
   ```

### Production Environment

1. **Build for production:**
   ```bash
   # Build frontend
   cd frontend
   npm run build
   cd ..
   
   # Start production services
   docker-compose -f docker-compose.prod.yml up -d
   ```

2. **Access the application:**
   - Application: http://localhost
   - API: http://localhost/api

## Manual Setup

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. **Initialize database:**
   ```bash
   npm run db:init
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment:**
   ```bash
   # Create .env file
   echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
   ```

4. **Start development server:**
   ```bash
   npm start
   ```

## Environment Configuration

### Backend Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend Configuration
FRONTEND_URL=http://localhost:3000

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
```

### Frontend Environment Variables

Create a `.env` file in the frontend directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Other configuration
GENERATE_SOURCEMAP=false
```

## Production Deployment

### Using Docker Compose (Recommended)

1. **Prepare production environment:**
   ```bash
   # Create data directory for persistent storage
   mkdir -p data
   
   # Set proper permissions
   chmod 755 data
   ```

2. **Configure environment:**
   ```bash
   # Backend production environment
   cat > backend/.env.production << EOF
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=http://your-domain.com
   EOF
   
   # Frontend production environment
   cat > frontend/.env.production << EOF
   REACT_APP_API_URL=http://your-domain.com/api
   GENERATE_SOURCEMAP=false
   EOF
   ```

3. **Build and deploy:**
   ```bash
   # Build frontend
   cd frontend
   npm run build
   cd ..
   
   # Start production services
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Manual Production Deployment

1. **Build frontend:**
   ```bash
   cd frontend
   npm run build
   cd ..
   ```

2. **Configure backend for production:**
   ```bash
   cd backend
   NODE_ENV=production npm start
   ```

3. **Serve frontend with a web server (nginx example):**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       # Serve frontend
       location / {
           root /path/to/frontend/build;
           try_files $uri $uri/ /index.html;
       }
       
       # Proxy API requests
       location /api {
           proxy_pass http://localhost:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

## Database Management

### SQLite Database

The application uses SQLite for data storage. The database file is created automatically.

**Development:**
- Location: `backend/database.sqlite`
- Initialization: `npm run db:init`
- Reset: `npm run db:reset`

**Production:**
- Location: `data/database.sqlite` (mounted volume)
- Backup: Copy the SQLite file
- Restore: Replace the SQLite file

### Database Backup

```bash
# Create backup
cp backend/database.sqlite backup-$(date +%Y%m%d-%H%M%S).sqlite

# Restore backup
cp backup-20240101-120000.sqlite backend/database.sqlite
```

## Monitoring and Logging

### Health Checks

The application includes health check endpoints:

- **Backend Health:** `GET /health`
- **Docker Health:** Built into containers

### Logging

**Development:**
- Console output with detailed information
- Request logging via Morgan

**Production:**
- Structured logging
- Log rotation recommended
- Consider external log aggregation

### Monitoring

Consider implementing:
- Application performance monitoring (APM)
- Error tracking (e.g., Sentry)
- Uptime monitoring
- Database monitoring

## Security Considerations

### Development
- CORS configured for localhost
- Basic security headers via Helmet
- Input validation on all endpoints

### Production
- Configure CORS for your domain
- Use HTTPS (SSL/TLS certificates)
- Implement rate limiting
- Regular security updates
- Database access restrictions
- Environment variable security

## Troubleshooting

### Common Issues

1. **Port conflicts:**
   ```bash
   # Check what's using the port
   lsof -i :3000
   lsof -i :5000
   
   # Change ports in docker-compose.yml or .env files
   ```

2. **Database initialization fails:**
   ```bash
   # Reset database
   cd backend
   npm run db:reset
   ```

3. **Frontend can't connect to backend:**
   - Check `REACT_APP_API_URL` in frontend `.env`
   - Verify backend is running on correct port
   - Check CORS configuration

4. **Docker build fails:**
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

### Logs

**View Docker logs:**
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend

# Follow logs
docker-compose logs -f
```

**View application logs:**
```bash
# Backend logs
cd backend
npm run dev

# Frontend logs
cd frontend
npm start
```

## Performance Optimization

### Production Optimizations

1. **Frontend:**
   - Build optimization enabled
   - Code splitting
   - Asset compression
   - CDN for static assets

2. **Backend:**
   - Database indexing
   - Response compression
   - Caching headers
   - Connection pooling

3. **Infrastructure:**
   - Load balancing
   - Database optimization
   - CDN implementation
   - Monitoring and alerting

## Scaling

### Horizontal Scaling

- Multiple backend instances behind load balancer
- Shared database (consider PostgreSQL for production)
- Session management (if authentication added)
- Static asset CDN

### Vertical Scaling

- Increase container resources
- Database performance tuning
- Memory optimization
- CPU optimization

## Backup and Recovery

### Automated Backups

```bash
#!/bin/bash
# backup-script.sh
DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="/backups"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
cp data/database.sqlite $BACKUP_DIR/database-$DATE.sqlite

# Cleanup old backups (keep last 30 days)
find $BACKUP_DIR -name "database-*.sqlite" -mtime +30 -delete
```

### Recovery Process

1. Stop the application
2. Replace database file with backup
3. Restart the application
4. Verify data integrity

## Support

For issues and questions:
- Check the troubleshooting section
- Review application logs
- Create an issue in the repository
- Contact the development team

