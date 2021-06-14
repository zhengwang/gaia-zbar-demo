import { HashRouter as Router, Route } from "react-router-dom";
import {ZbarImage} from "./Zbar/ZbarImage.jsx";
import { ZbarScanner } from "./Zbar/ZbarScanner.jsx";

function App() {
  return (
    <div>
      <Router>    
        <Route exact path="/" component={ZbarScanner} />
        <Route path="/zbar" component={ZbarImage} /> 
      </Router>
    </div>
  );
}

export default App;
