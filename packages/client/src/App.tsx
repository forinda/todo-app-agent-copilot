import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

import { router } from './router';

// Create a query client
const queryClient = new QueryClient();

// Router configuration
const Router = () => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster 
          position="top-right"
          toastOptions={{
            success: {
              duration: 3000,
              style: {
                background: '#E9F7EF',
                border: '1px solid #82E0AA',
                color: '#145A32',
              },
            },
            error: {
              duration: 4000,
              style: {
                background: '#FDEDEC',
                border: '1px solid #F5B7B1',
                color: '#641E16',
              },
            },
            loading: {
              style: {
                background: '#EBF5FB',
                border: '1px solid #AED6F1',
                color: '#1B4F72',
              },
            },
          }}
        />
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default Router;