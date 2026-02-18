/**
 * Frontend README
 *
 * Production-ready React CRM Frontend using Vite + React Router
 */

# CRM Frontend - Production Grade React SPA

A scalable, enterprise-ready frontend for a multi-tenant SaaS CRM platform built with React, Vite, and React Router.

## Features

- ✅ Modern React 18 with Vite
- ✅ React Router for client-side navigation
- ✅ JWT Authentication with token refresh
- ✅ Context API for state management
- ✅ Custom hooks for common operations
- ✅ Axios interceptors for API calls
- ✅ Multi-tenant organization support
- ✅ Role-based access control
- ✅ Protected routes with authentication
- ✅ Clean, scalable folder structure
- ✅ Reusable UI components
- ✅ Error handling and loading states

## Project Structure

```
src/
├── api/                      # API client & endpoints
│   ├── axiosConfig.js       # Axios instance with interceptors
│   ├── authApi.js           # Authentication endpoints
│   ├── leads.js             # Leads service
│   ├── clients.js           # Clients service
│   └── organizations.js     # Organizations service
│
├── components/              # Reusable components
│   ├── common/             # Layout components
│   │   ├── Navbar.jsx
│   │   ├── Navbar.css
│   │   ├── Sidebar.jsx
│   │   └── Sidebar.css
│   └── ui/                 # UI components
│       ├── Alert.jsx
│       ├── Alert.css
│       ├── Loading.jsx
│       └── Loading.css
│
├── context/                 # Context providers
│   ├── AuthContext.jsx      # Authentication state
│   └── OrganizationContext.jsx # Organization selection
│
├── hooks/                   # Custom hooks
│   ├── useAuth.js          # Auth context hook
│   ├── useOrganization.js  # Organization context hook
│   ├── useAsync.js         # Async operations hook
│   ├── useForm.js          # Form state hook
│   └── index.js            # Hooks exports
│
├── layouts/                 # Page layouts
│   ├── MainLayout.jsx      # App layout (sidebar + navbar)
│   ├── MainLayout.css
│   ├── AuthLayout.jsx      # Auth page layout
│   └── AuthLayout.css
│
├── pages/                   # Feature pages
│   ├── auth/               # Authentication
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── index.js
│   ├── dashboard/          # Dashboard
│   │   └── Dashboard.jsx
│   ├── leads/              # Leads management
│   │   └── Leads.jsx
│   ├── clients/            # Clients management
│   │   └── Clients.jsx
│   ├── teams/              # Teams management
│   │   └── Teams.jsx
│   ├── subscriptions/      # Subscriptions
│   │   └── Subscriptions.jsx
│   └── settings/           # Settings
│       └── Settings.jsx
│
├── routes/                  # Route configuration
│   └── routes.jsx          # Route definitions
│
├── constants/              # Application constants
│   └── index.js            # Roles, statuses, etc.
│
├── types/                  # Type definitions (JSDoc)
│   └── index.js
│
├── utils/                  # Utility functions
│   ├── helpers.js          # Format, validation helpers
│   ├── errorHandler.js     # Error handling
│   ├── queryHelpers.js     # Query string helpers
│   └── index.js            # Utilities exports
│
├── styles/                 # Global styles
│   └── (optional global CSS)
│
├── App.jsx                 # Main app component
├── App.css                 # App styles
├── main.jsx                # Entry point
└── index.css               # Global styles
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Configuration

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### Development Server

```bash
npm run dev
```

Visit http://localhost:5173

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Key Components

### Authentication Flow

1. User logs in on `/login`
2. API returns access + refresh tokens
3. Tokens stored in localStorage
4. Axios interceptor adds token to requests
5. Protected routes check authentication status
6. 401 responses redirect to login

```jsx
// Using authentication
const { login, logout, user, isAuthenticated } = useAuth();
```

### API Calls

All API calls go through Axios with interceptors:

```jsx
// Example: Fetch leads
import { leadsApi } from '@/api/leads';

const handleFetchLeads = async () => {
  try {
    const response = await leadsApi.getLeads({ page: 1, limit: 20 });
    setLeads(response.data);
  } catch (error) {
    handleApiError(error);
  }
};
```

### Custom Hooks

```jsx
// useForm - Form state management
const form = useForm(initialValues, onSubmit);

// useAsync - Async operation handling
const { data, loading, error, execute } = useAsync(myAsyncFunction);

// useOrganization - Organization context
const { currentOrganization, selectOrganization } = useOrganization();
```

### Protected Routes

Routes automatically protect against unauthorized access:

```jsx
// In routes.jsx
{
  path: '/leads',
  element: <Leads />,
  // Automatically protected - redirects to /login if not authenticated
}
```

## Configuration

### Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL

### API Configuration

Edit `src/api/axiosConfig.js`:

- Request/response interceptors
- Default headers
- Error handling

### Routes

Add new routes in `src/routes/routes.jsx`:

```jsx
{
  path: '/new-feature',
  element: <NewFeature />,
},
```

## Styling

- Global styles in `App.css`
- Component-level CSS modules or inline styles
- Consistent color scheme (primary: #667eea)
- Mobile-responsive design

## Development Best Practices

1. **Keep components small** - Single responsibility principle
2. **Use custom hooks** - Reuse logic across components
3. **Type with JSDoc** - Document function parameters and returns
4. **Handle errors** - All async operations should have error handling
5. **Secure tokens** - Never expose tokens in code; use environment variables
6. **API layer** - All API calls through `src/api/`
7. **Constants** - Use `src/constants/` for magic strings

## Common Patterns

### Fetching Data in a Page

```jsx
import { useEffect, useState } from 'react';
import { leadsApi } from '@/api/leads';
import { useAsync } from '@/hooks';

export function LeadsPage() {
  const { data: leads, loading, error, execute: fetchLeads } = useAsync(
    () => leadsApi.getLeads()
  );

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  if (loading) return <Loading />;
  if (error) return <Alert type="error" message={error.message} />;

  return <div>{/* Render leads */}</div>;
}
```

### Submitting a Form

```jsx
export function CreateLeadForm() {
  const form = useForm(initialValues, async (values) => {
    await leadsApi.createLead(values);
    // Success handling
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <input {...form.values} onChange={form.handleChange} />
      <button type="submit" disabled={form.isSubmitting}>
        Create
      </button>
    </form>
  );
}
```

## Deployment

### Vercel

```bash
npm run build
# Deploy dist/ folder to Vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Environment Setup for Production

```env
VITE_API_BASE_URL=https://api.example.com/api/v1
```

## Troubleshooting

### CORS Issues
- Ensure backend allows requests from frontend origin
- Check `VITE_API_BASE_URL` matches backend URL

### 401 on Page Load
- Token might be expired
- Check localStorage for valid tokens
- Implement refresh token logic

### Routes Not Working
- Check route configuration in `routes.jsx`
- Ensure component is exported correctly
- Verify path matches exactly

## Future Enhancements

- [ ] Redux for complex state management
- [ ] React Query for server state management
- [ ] WebSocket for real-time updates
- [ ] Testing suite (Vitest + React Testing Library)
- [ ] E2E tests (Playwright/Cypress)
- [ ] Component library (Storybook)
- [ ] Dark mode support
- [ ] Progressive Web App (PWA)
- [ ] Internationalization (i18n)

## License

Proprietary - All Rights Reserved

## Support

For issues, contact: support@example.com
