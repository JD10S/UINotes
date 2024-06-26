import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Loguin from './Loguin';
import Register from './Register';
import Notes from './Notes';

function App() {
  

  return (
    <Router>
      <div className='app-container'>
        <Routes>
          <Route exact path="/"  element={<Loguin/>} /> 
          <Route exact path="/Register"  element={<Register/>} /> 
          <Route exact path='/Loguin' element={<Loguin/>}/>
          <Route exact path='/Notes' element={<Notes/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App
