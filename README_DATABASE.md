# AVSER+ Database Setup Guide

## Overview
This guide will help you set up and run the PostgreSQL database for the AVSER+ Recruitment Portal.

## Prerequisites

1. **PostgreSQL Installation**
   - PostgreSQL 12 or higher must be installed on your system
   - Download from: https://www.postgresql.org/download/

2. **Database Credentials**
   - Host: `localhost`
   - Port: `5432`
   - User: `postgres`
   - Password: `pgpass`
   - Database: `avserplus`

## Database Schema

The database includes 16 comprehensive tables:

### Core Tables
- **users** - Applicant user accounts
- **admins** - Admin user accounts with role-based access
- **vacancies** - Job vacancy postings (101 fields!)

### Application Management
- **applications** - Job applications with JSONB data
- **application_timeline** - Application status tracking
- **documents** - Uploaded documents
- **payments** - Payment transactions

### Examination & Selection
- **exam_schedules** - Exam scheduling
- **exam_results** - Exam scores and results
- **interview_schedules** - Interview appointments
- **shortlist_results** - Shortlisting data
- **selection_results** - Final selection results

### Support & System
- **objections** - Grievances and objections
- **notifications** - User notifications
- **audit_log** - System audit trail
- **system_settings** - Configuration settings

## Setup Instructions

### Step 1: Verify PostgreSQL is Running

**Windows:**
```powershell
# Check if PostgreSQL service is running
Get-Service -Name postgresql*

# Start PostgreSQL if not running
Start-Service postgresql-x64-14  # Adjust version number
```

**Linux/Mac:**
```bash
# Check status
sudo systemctl status postgresql

# Start if not running
sudo systemctl start postgresql
```

### Step 2: Create Database (if not exists)

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE avserplus;

# Exit
\q
```

### Step 3: Run Database Migration

The schema has already been created! You can verify by running:

```bash
# Connect to avserplus database
psql -U postgres -d avserplus

# List all tables
\dt

# You should see 16 tables listed
```

If you need to recreate the schema, the complete SQL script is available in:
`server/migrations/init.sql`

### Step 4: Install Backend Dependencies

```bash
cd server
npm install
```

### Step 5: Configure Environment Variables

The `.env` file in the `server` directory should contain:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=pgpass
DB_NAME=avserplus

# Server Configuration
PORT=3001
NODE_ENV=development
```

### Step 6: Start the Backend Server

```bash
cd server
npm start
```

You should see:
```
═══════════════════════════════════════════════════════════
  🚀 AVSER+ Recruitment Portal API Server
═══════════════════════════════════════════════════════════
  📡 Server running on: http://localhost:3001
  🗄️  Database: avserplus@localhost:5432
  🌍 Environment: development
═══════════════════════════════════════════════════════════
```

### Step 7: Test the API

Open your browser or use curl:

```bash
# Health check
curl http://localhost:3001/health

# Get all vacancies
curl http://localhost:3001/api/vacancies

# Get all users
curl http://localhost:3001/api/users
```

## API Endpoints

### Users
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `PUT /api/users/:id/verify-email` - Verify email
- `PUT /api/users/:id/verify-mobile` - Verify mobile
- `DELETE /api/users/:id` - Delete user

### Admins
- `GET /api/admins` - List all admins
- `GET /api/admins/:id` - Get admin by ID
- `POST /api/admins` - Create new admin
- `PUT /api/admins/:id` - Update admin
- `DELETE /api/admins/:id` - Delete admin

### Vacancies
- `GET /api/vacancies` - List all vacancies
- `GET /api/vacancies/public/active` - Get active vacancies (public)
- `GET /api/vacancies/:id` - Get vacancy by ID
- `GET /api/vacancies/code/:vacancy_id` - Get vacancy by code
- `POST /api/vacancies` - Create new vacancy
- `PUT /api/vacancies/:id` - Update vacancy
- `PUT /api/vacancies/:id/status` - Update vacancy status
- `DELETE /api/vacancies/:id` - Delete vacancy
- `GET /api/vacancies/:id/stats` - Get vacancy statistics

### Applications
- `GET /api/applications` - List all applications
- `GET /api/applications/:id` - Get application by ID (with timeline, documents, payment)
- `POST /api/applications` - Create new application
- `PUT /api/applications/:id/status` - Update application status
- `PUT /api/applications/:id/verify` - Verify application
- `PUT /api/applications/:id/payment` - Update payment status
- `DELETE /api/applications/:id` - Delete application
- `GET /api/applications/stats/overview` - Get application statistics

### Notifications
- `GET /api/notifications/user/:user_id` - Get user notifications
- `GET /api/notifications/user/:user_id/unread-count` - Get unread count
- `POST /api/notifications` - Create notification
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/user/:user_id/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

## Frontend Integration

The frontend API client is available at `src/lib/api.ts`

### Example Usage:

```typescript
import { vacanciesApi, applicationsApi, usersApi } from '@/lib/api';

// Get all active vacancies
const response = await vacanciesApi.getActive();
if (response.success) {
  console.log(response.data);
}

// Create a new application
const result = await applicationsApi.create({
  user_id: 1,
  vacancy_id: 5,
  personal_details: { ... },
  payment_amount: 500
});

// Get user by ID
const user = await usersApi.getById(1);
```

## Troubleshooting

### Connection Refused
- Ensure PostgreSQL is running
- Check if port 5432 is not blocked by firewall
- Verify credentials in `.env` file

### Database Does Not Exist
```bash
psql -U postgres -c "CREATE DATABASE avserplus;"
```

### Permission Denied
- Check PostgreSQL user permissions
- Ensure password is correct in `.env`

### Port Already in Use
- Change PORT in `server/.env` to a different port
- Update `VITE_API_URL` in frontend `.env` accordingly

## Database Maintenance

### Backup Database
```bash
pg_dump -U postgres avserplus > avserplus_backup.sql
```

### Restore Database
```bash
psql -U postgres avserplus < avserplus_backup.sql
```

### Reset Database
```bash
# Drop and recreate
psql -U postgres -c "DROP DATABASE avserplus;"
psql -U postgres -c "CREATE DATABASE avserplus;"
psql -U postgres -d avserplus -f server/migrations/init.sql
```

## System Settings

Default system settings are automatically inserted:
- Site name: AVSER+ Recruitment Portal
- Max file size: 5 MB
- Allowed file types: PDF, JPG, JPEG, PNG
- Pagination limit: 50
- Support email: support@avserplus.gov.in

## Next Steps

1. ✅ Database schema created
2. ✅ Backend API running
3. 🔄 Connect frontend to backend
4. 🔄 Implement authentication
5. 🔄 Add file upload functionality
6. 🔄 Implement exam and interview modules

## Support

For issues or questions, please refer to the main project README or contact the development team.
