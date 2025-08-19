import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Home, Bookmark, Search, MessageCircle, User } from 'lucide-react';

export default function BottomNav({ setCurrentScreen, currentScreen }) {
  const { t } = useTranslation();
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around items-center">
        <button 
          onClick={() => setCurrentScreen('search')}
          className={`flex flex-col items-center p-2 ${currentScreen === 'search' ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <Home size={20} />
          <span className="text-xs mt-1">{t('bottomNav.home', 'Home')}</span>
        </button>
        <button 
          onClick={() => setCurrentScreen('saved')}
          className={`flex flex-col items-center p-2 ${currentScreen === 'saved' ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <Bookmark size={20} />
          <span className="text-xs mt-1">{t('bottomNav.saved', 'Saved')}</span>
        </button>
        <button 
          onClick={() => setCurrentScreen('tutorList')}
          className={`flex flex-col items-center p-2 ${currentScreen === 'tutorList' ? 'text-pink-600' : 'text-gray-600'}`}
        >
          <Search size={20} />
          <span className="text-xs mt-1">{t('bottomNav.searchTutors', 'Search Tutors')}</span>
        </button>
        <button 
          onClick={() => setCurrentScreen('messages')}
          className={`flex flex-col items-center p-2 ${currentScreen === 'messages' ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <MessageCircle size={20} />
          <span className="text-xs mt-1">{t('bottomNav.messages', 'Messages')}</span>
        </button>
        <button 
          onClick={() => setCurrentScreen('profile')}
          className={`flex flex-col items-center p-2 ${currentScreen === 'profile' ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <User size={20} />
          <span className="text-xs mt-1">{t('bottomNav.profile', 'Profile')}</span>
        </button>
      </div>
    </div>
  );
}