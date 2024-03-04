import logo from './logo.svg';
import './App.css';
import TodoApp from "./components/TodoBase";
import OnlineStatus from "./components/OnlineStatus";
import { GoogleLogin } from './components/GoogleLogin';

function App() {
  return (
      <div className="App">

          <TodoApp/>
          <OnlineStatus/>
          <GoogleLogin/>
      </div>
  );
}

export default App;
