import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Support from "../pages/Support";
import Error from "../pages/Error";
const Navlinks = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/support" element={<Support />} />
        <Route path="/login" element={<Login />} />
        <Route path="/error" element={<Error/>}></Route>
      </Routes>
    </>
  );
};

export default Navlinks;
