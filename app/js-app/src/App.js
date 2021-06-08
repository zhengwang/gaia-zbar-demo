import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { MsgPack } from "./MsgPack";
import { CvCanny } from "./CvCanny";
import { Zbar } from "./Zbar";

function App() {
  return (
    <div>
      <Router>
        <Route exact path="/" component={MsgPack} />        
        <Route path="/canny" component={CvCanny} />
        <Route path="/zbar" component={Zbar} />
      </Router>
    </div>
  );
}

export default App;
