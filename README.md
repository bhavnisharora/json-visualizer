# JSON Tree Visualizer

An interactive web application that visualizes JSON data as a hierarchical tree structure with search and highlighting functionality. Built with React, React Flow, and Tailwind CSS.

## Features

### Core Functionality
- **JSON Input & Validation** - Paste or type JSON with real-time validation
- **Interactive Tree Visualization** - Hierarchical node-based visualization using React Flow
- **Smart Search** - Search nodes by JSON path with highlighting
- **Color-Coded Nodes** - Different colors for objects, arrays, and primitives
- **Interactive Controls** - Zoom, pan, and navigate through your JSON structure

### Visualization Features
- **Object Nodes** (Purple) - Display object keys with {} indicator
- **Array Nodes** (Green) - Display array indices with [] indicator
- **Primitive Nodes** (Orange) - Display key-value pairs (strings, numbers, booleans, null)
- **Animated Connections** - Smooth lines connecting parent-child relationships
- **Hover Tooltips** - View path and value information on hover

### Search Capabilities
- Search by JSON path (e.g., `$.user.address.city`, `orders[0].total`)
- Automatic node highlighting with pulse animation
- Visual feedback for match found/not found

### Interactive Controls
- **Zoom Controls** - Zoom in/out and fit view
- **Pan Canvas** - Drag to navigate large JSON structures
- **Mini Map** - Bird's eye view for easy navigation

### Installation

1. **Clone the repository** (or create a new React project)
```bash
npx create-vite@latest json-tree-visualizer --template react
cd json-tree-visualizer
```

2. **Install dependencies**
```bash
npm install reactflow lucide-react
```

3. **Install and configure Tailwind CSS**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

4. **Configure Tailwind CSS**

Update `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

5. **Add Tailwind directives to CSS**

Update `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

6. **Copy the application code**

Replace the content of `src/App.jsx` with the provided application code.

7. **Start the development server**
```bash
npm run dev
```

8. **Open your browser**

Navigate to `http://localhost:5173` (or the port shown in your terminal)


## 🛠️ Tech Stack

- **React 18.x** - UI framework
- **React Flow 11.x** - Graph visualization library
- **Tailwind CSS 3.x** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Vite** - Build tool and dev server

## 📄 License

This project is open source and available under the MIT License.

## Acknowledgments

- [React Flow](https://reactflow.dev/) - Amazing graph visualization library
- [Tailwind CSS](https://tailwindcss.com/) - Excellent utility-first CSS framework
- [Lucide](https://lucide.dev/) - Beautiful icon set

