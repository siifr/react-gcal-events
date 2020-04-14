import React from 'react';
import EventsHandler from './Components/EventsHandler';
import AppNav from './Components/AppNav';
import './styles/App.css';

function App() {
  return (
    <div>
      <AppNav />
      <EventsHandler />
    </div>
  );
}

export default App;
