import React from "react";
import {TreeChart} from './components/TreeChart';
import data from './data/data.json';
import './App.css';
import {Dialog} from "./components/Dialog";

function App() {
  return (
    <div className="App">
      <TreeChart data={data} />
    </div>
  );
}

export default App;
