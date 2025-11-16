# Emittify Example - Vite + React + Tailwind + Motion

This is a demonstration project showcasing the **Emittify** event emitter library with a modern React stack.

## 🚀 Tech Stack

- **Vite** - Next generation frontend tooling
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Emittify** - Type-safe event emitter

## 🎯 Features Demonstrated

- ✨ **Event Emission**: Send and listen to events across components
- 💾 **Event Caching**: Cached events provide initial values to new listeners
- 🎨 **Event Deduplication**: Prevents redundant emissions when values haven't changed
- ⚛️ **React Hooks**: `useEventListener` hook for reactive state
- 🎭 **Animations**: Framer Motion animations triggered by events
- 🌓 **Theme Switching**: Persistent theme preference using cached events

## 📦 Installation

```bash
# Install dependencies
yarn install

# or with npm
npm install
```

## 🏃 Running the Example

```bash
# Start development server
yarn dev

# or with npm
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## 🏗️ Build for Production

```bash
# Build the project
yarn build

# Preview the production build
yarn preview
```

## 📚 What's Inside

### Event Definitions (`src/emitter.ts`)

The example defines several typed events:
- `counter`: number - A simple counter with caching and deduplication
- `theme`: ThemeData - Theme preferences (light/dark)
- `notification`: NotificationData - Toast notifications

### Main App (`src/App.tsx`)

Demonstrates:
- Using `useEventListener` hook to reactively subscribe to events
- Sending events from user interactions
- Animating UI elements based on event changes
- Toast notifications with auto-dismiss
- Theme persistence with cached events

## 🎓 Learn More

- [Emittify Documentation](../README.md)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

## 📝 License

MIT

