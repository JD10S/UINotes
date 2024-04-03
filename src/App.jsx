import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Loguin from './Loguin';
import Register from './Register';

function App() {
  

  return (
    <Router>
      <div className='app-container'>
        <Routes>
          <Route exact path="/"  element={<Loguin/>} /> 
          <Route path="/Register"  element={<Register/>} /> 
          <Route path='/Loguin' element={<Loguin/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App
