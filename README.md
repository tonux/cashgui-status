# CashGUI Status Page

A real-time status page for monitoring CashGUI's backoffice services and incidents.

## Features

- Real-time service status monitoring
- Incident reporting and tracking
- Status history and uptime tracking
- Email notifications for subscribers
- Beautiful and responsive UI

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Prisma (PostgreSQL)
- TailwindCSS
- Tremor for UI components
- Server-Sent Events for real-time updates

## Prerequisites

- Node.js 18+ 
- PostgreSQL
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cashgui-status.git
cd cashgui-status
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```bash
cp .env.example .env
```

Edit the `.env` file with your PostgreSQL connection string.

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Database Schema

The application uses the following main models:

- `Service`: Represents a monitored service
- `Incident`: Tracks service incidents
- `IncidentUpdate`: Updates for ongoing incidents
- `StatusHistory`: Historical status data
- `Subscriber`: Email subscribers for notifications

## API Routes

- `GET /api/services`: Get all services and their current status
- `POST /api/services`: Create a new service
- `GET /api/incidents`: Get recent incidents
- `POST /api/incidents`: Create a new incident

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 