# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

Todo List — React App
An interactive task management application built with React and TypeScript. Features include drag-and-drop columns and tasks, multi-selection, filtering, task editing, and persistent local storage.

Technologies Used
React 18 + TypeScript

Zustand — lightweight state management

react-dnd — drag-and-drop logic

styled-components — component-level styling

react-dnd-html5-backend — desktop drag-and-drop support

Features
Drag and drop columns and tasks

Create, edit, and delete tasks

Multi-task selection and group actions (mark as complete/incomplete)

Real-time filtering (all / completed / incomplete)

Task search with live highlighting

Responsive layout for desktop, tablet, and mobile

State persistence via localStorage (powered by zustand/persist)

📁 Project Structure
bash
Copy
Edit
src/
├── components/
│ ├── Column.tsx # Single column component with DnD logic
│ ├── Task.tsx # Task card component
│ ├── TaskSearch.tsx # Live search bar
│ ├── ColumnManager.tsx # Add new columns
│ ├── FilterManager.tsx # Filter tasks by status
│ └── SelectManager.tsx # Group task actions
├── styles/ # Styled UI elements (Button, Input)
├── store/
│ └── useTodoStore.ts # Zustand state store (columns, tasks, filters)
├── types.ts # Type definitions for tasks and columns
└── App.tsx # Main application component
⚙️ Getting Started
bash
Copy
Edit
git clone https://github.com/your-username/todo-list.git
cd todo-list
npm install
npm start
⚠️ Note for Node.js v17+ or later: add this flag to avoid Webpack errors:

bash
Copy
Edit
set NODE_OPTIONS=--openssl-legacy-provider && npm start
📦 Key Dependencies
json
Copy
Edit
{
"zustand": "^4.x",
"react-dnd": "^16.x",
"react-dnd-html5-backend": "^16.x",
"styled-components": "^5.x",
"typescript": ">=4.9",
"react": "^18.x",
"react-scripts": "5.x"
}
✅ Planned Improvements
Touch & mobile drag-and-drop support (react-dnd-multi-backend)

Task import/export as JSON or CSV

Trello-style timeline view

Authentication and cloud syncing

👤 Author
Built by Lazzyend for learning, practicing, and extending task management interfaces.
Can be extended into a kanban board, mini CRM, or collaboration tool.
