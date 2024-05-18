import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Createpost from "./pages/Createpost";
import Updatepost from "./pages/Updatepost";
import CreateSchedul from "./pages/CreateSchedul";
import Myschedul from "./pages/Myschedul";
import UpdateSchedul from "./pages/UpdateSchedul";




export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      
       
        <Route path="/updatepost/:postId" element={<Updatepost/>} />
        <Route path="/create" element={<Createpost/>} />
        <Route path="/createschedul" element={<CreateSchedul/>} />
        <Route path="/Myschedul" element={<Myschedul/>} />
        <Route path="/updateworkout/:workId" element={<UpdateSchedul/>} />
       

       

       
         
        
       
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
