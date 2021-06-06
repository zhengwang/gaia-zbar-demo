import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { MsgPack } from "./MsgPack";

function App() {
  return (
    <div>
      <Router>
        <Route exact path="/" component={MsgPack} />        
      </Router>
    </div>
  );
}

export default App;
