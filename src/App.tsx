import {TreeChart} from './components/TreeChart';
import data from './data/data.json';

import './App.css';

function App() {
  return (
    <div className="App">
      <TreeChart data={data} />
    </div>
  );
}

export default App;
