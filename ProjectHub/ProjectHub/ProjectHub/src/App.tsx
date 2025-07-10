import { Routes, Route, HashRouter } from 'react-router-dom';
import { FluentProvider } from '@fluentui/react-components';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { ClientsPage } from './pages/ClientsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectGanttPage } from './pages/ProjectGanttPage';
import { TasksPage } from './pages/TasksPage';
import { ThemeProvider } from './contexts/ThemeProvider';
import { useTheme } from './contexts/useTheme';
import './App.css';

// Separate component to use the theme context
const AppContent = () => {
  const { theme } = useTheme();
  
  return (
    <FluentProvider theme={theme}>
      <HashRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:projectId/gantt" element={<ProjectGanttPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </MainLayout>
      </HashRouter>
    </FluentProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
