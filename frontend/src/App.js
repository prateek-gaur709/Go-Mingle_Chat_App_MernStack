import './App.css';
import { Route } from 'react-router-dom';
import HomePage from './Components/HomePage';
import ChatPage from './Components/ChatPage';

function App() {
  return (
    <>
      <Route path='/' component={HomePage} exact />
      <Route path='/chats' component={ChatPage} />
    </>
  );
}

export default App;
