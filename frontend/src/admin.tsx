// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import { AdminDashboardScreen } from './app/components/AdminDashboardScreen';
// import { LanguageProvider } from './app/contexts/LanguageContext';
// import { UserProvider } from './app/contexts/UserContext';
// import { Toaster } from './app/components/ui/sonner';
// import './styles/index.css';

// function AdminApp() {
//     return (
//         <LanguageProvider>
//             <UserProvider>
//                 <div className="min-h-screen bg-white">
//                     <div className="max-w-4xl mx-auto shadow-xl min-h-screen bg-white">
//                         <AdminDashboardScreen onBack={() => { window.location.href = '/'; }} />
//                     </div>
//                 </div>
//                 <Toaster position="top-center" />
//             </UserProvider>
//         </LanguageProvider>
//     );
// }

// const rootElement = document.getElementById('root');
// if (rootElement) {
//     createRoot(rootElement).render(
//         <React.StrictMode>
//             <AdminApp />
//         </React.StrictMode>
//     );
// }
