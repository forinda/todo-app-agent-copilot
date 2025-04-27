import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CheckSquare, ArrowRight, Shield, Clock, Calendar } from 'lucide-react';

// Login modal component
import LoginModal from '../components/LoginModal';

const LandingPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // If authenticated, redirect to dashboard
  if (isAuthenticated && !loading) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleOpenLogin = (register: boolean = false) => {
    setIsRegistering(register);
    setShowLoginModal(true);
  };

  const features = [
    {
      icon: <CheckSquare className="w-8 h-8 text-indigo-600" />,
      title: 'Task Management',
      description: 'Create, organize, and track your tasks with ease.',
    },
    {
      icon: <Shield className="w-8 h-8 text-indigo-600" />,
      title: 'Team Collaboration',
      description: 'Assign tasks to team members and track progress together.',
    },
    {
      icon: <Calendar className="w-8 h-8 text-indigo-600" />,
      title: 'Due Dates & Reminders',
      description: 'Never miss a deadline with our reminder system.',
    },
    {
      icon: <Clock className="w-8 h-8 text-indigo-600" />,
      title: 'Time Tracking',
      description: 'Track how much time you spend on each task.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section with login */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
        {/* Navigation */}
        <header className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6" />
            <span className="font-bold text-xl">TaskMaster</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => handleOpenLogin(false)} 
              className="px-4 py-2 rounded-md hover:bg-white/10 transition-colors"
            >
              Log in
            </button>
            <button 
              onClick={() => handleOpenLogin(true)}
              className="btn bg-white text-indigo-700 hover:bg-indigo-50"
            >
              Sign up
            </button>
          </div>
        </header>

        {/* Hero content */}
        <div className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Task Management Made Simple
            </h1>
            <p className="text-xl mb-8 text-indigo-100">
              Organize, track, and manage your tasks efficiently. Boost your productivity with TaskMaster.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => handleOpenLogin(true)}
                className="btn bg-white text-indigo-700 hover:bg-indigo-50 px-8 py-3 font-medium text-lg"
              >
                Get Started Free
              </button>
              <button className="btn bg-transparent border border-white hover:bg-white/10 px-8 py-3 font-medium text-lg">
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="/task-dashboard-preview.svg" 
              alt="Task Dashboard" 
              className="w-full max-w-lg rounded-lg shadow-2xl"
              onError={(e) => {
                // Fallback if image doesn't exist
                e.currentTarget.style.display = 'none';
              }} 
            />
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Features to Boost Your Productivity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-6 hover:shadow-md animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="mb-4 p-3 bg-indigo-50 rounded-lg inline-block">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already improving their productivity with TaskMaster.
          </p>
          <button 
            onClick={() => handleOpenLogin(true)}
            className="btn btn-primary px-8 py-3 text-lg"
          >
            Create Your Free Account <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <CheckSquare className="h-6 w-6" />
                <span className="font-bold text-xl">TaskMaster</span>
              </div>
              <p className="text-gray-400 max-w-xs">
                Task management application for individuals and teams. Organize your work and life.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-bold mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Tutorials</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Support</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Privacy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} TaskMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login/Register Modal */}
      {showLoginModal && (
        <LoginModal 
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          isRegistering={isRegistering}
          toggleMode={() => setIsRegistering(!isRegistering)}
        />
      )}
    </div>
  );
};

export default LandingPage;