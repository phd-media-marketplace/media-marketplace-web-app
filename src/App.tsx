import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './Router';
import { Toaster } from 'sonner';


function App() {
    return (
        <>
            <RouterProvider router={router} />
            <Toaster 
                position="top-center"
                toastOptions={{
                    unstyled: false,
                    classNames: {
                        toast: 'bg-white border-gray-200',
                        success: '!border-green-500 !text-green-500',
                        error: '!border-red-500 !text-red-500',
                        title: 'text-gray-900',
                        description: 'text-gray-600',
                    },
                }}
            />
        </>
    )
}

export default App;
