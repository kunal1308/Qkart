import Register from "./components/Register";
import Login from "./components/Login";
import Products from "./components/Products";
import ipConfig from "./ipConfig.json";
import { Switch, Route } from "react-router-dom";
import Thanks from "./components/Thanks";
import Checkout from "./components/Checkout";


export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    <div className="App">
      <Switch>

        <Route path="/register"><Register /></Route>
        <Route path="/login"><Login /></Route>
        <Route path="/checkout"><Checkout /></Route>
        <Route path="/thanks"><Thanks /></Route>
        <Route path="/"><Products /></Route>
      </Switch>
    </div>
  );
}

export default App;
