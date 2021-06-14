import { HashRouter as Router, Route } from "react-router-dom";
// import { MsgPack } from "./MsgPack";
// import { CvCanny } from "./CvCanny";
// import { Zbar } from "./Zbar";
// import {ZbarImage} from "./Zbar/ZbarImage.jsx";
import { ZbarScanner } from "./Zbar/ZbarScanner.jsx";

function App() {
  return (
    <div>
      <Router>
        {/* <Route exact path="/" component={MsgPack} />        
        <Route path="/canny" component={CvCanny} />
        <Route path="/zbar" component={ZbarImage} /> */}
        <Route exact path="/" component={ZbarScanner} />
      </Router>
    </div>
  );
}

export default App;
