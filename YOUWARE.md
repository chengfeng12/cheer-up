# YOUWARE - Life Log Web App

A mobile-first web application for daily life logging, habit tracking, and task management. Built with React, TypeScript, and Tailwind CSS.

## Project Overview

- **Type**: Mobile-First Web Application (PWA-ready)
- **Style**: Clean, Minimalist, Pastel Colors
- **Language**: Chinese (Simplified)
- **Core Features**:
  - Daily Check-in with Mood Tracking
  - Task Management (Add, Toggle, Delete)
  - **Task History View** (List of past tasks grouped by date)
  - Monthly Calendar View with History & Details
  - **Retroactive Check-in** (补卡)
  - Local Data Persistence (Offline First)
  - Mock Login System (Guest/User Mode)
  - Dark Mode Support
  - Enhanced UX: Animations & Haptic Feedback

## Architecture

### Directory Structure

```
src/
├── components/
│   ├── Auth/           # Authentication components (LoginModal)
│   ├── Calendar/       # Calendar grid and logic
│   ├── Layout/         # Mobile-constrained layout wrapper
│   ├── Navigation/     # Bottom tab bar navigation
│   └── Task/           # Task list components
├── pages/
│   ├── HomePage.tsx       # Daily dashboard (Index route)
│   ├── CalendarPage.tsx   # History view (/calendar)
│   ├── ProfilePage.tsx    # Settings and stats (/profile)
│   └── TaskHistoryPage.tsx # List of historical tasks (/history)
├── store/
│   └── useStore.ts     # Zustand store with localStorage persistence
└── types/              # TypeScript definitions
```

### Key Technologies

- **Framework**: React 18 + Vite
- **Routing**: React Router DOM v6
- **State Management**: Zustand (with `persist` middleware for localStorage)
- **Styling**: Tailwind CSS (Utility-first, Dark Mode support)
- **Animations**: Framer Motion (Page transitions, micro-interactions)
- **Icons**: Lucide React
- **Date Handling**: date-fns (zh-CN locale)

## Development Guide

### Commands

- `npm install`: Install dependencies
- `npm run dev`: Start development server
- `npm run build`: Build for production (Required after changes)
- `npm run preview`: Preview production build

### Design System

- **Colors**:
  - Primary: Emerald (`text-emerald-500`, `bg-emerald-50`)
  - Text: Slate (`text-slate-800`, `text-gray-400`)
  - Background: Gray/White (`bg-gray-50`, `bg-white`)
- **Typography**: Sans-serif, clean, readable.
- **Layout**: Constrained to `max-w-md` and centered to simulate a mobile app experience on desktop. Uses `h-[100dvh]` to ensure correct viewport height on mobile browsers.

### Data Model

- **Tasks**: `{ id, title, completed, date }`
- **CheckIns**: `{ date, mood, note }`
- **Storage**: `life-log-storage` key in localStorage.

## Future Roadmap

1. **Backend Integration**: Connect to Youware Backend (Cloudflare Workers + D1) for cloud sync.
2. **Data Export**: Allow users to export data as JSON/CSV.
3. **Social Features**: Share daily summaries.
