import 'materialize-css/dist/css/materialize.min.css';

import { Route, Routes } from 'react-router-dom';

import ShowCards from './components/showCards/ShowCards';
import Card from './components/card/Card';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ShowCards />}/>
      <Route path="/Card/:name" element={<Card />}/>
    </Routes>
  );
}

export default App;
