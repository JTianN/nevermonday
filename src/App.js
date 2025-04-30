
import './App.css';
import BodyMain from './components/body';
import Header from './components/header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PageLogin from './pages/loginpage';
import PageHome from './pages/homepage';
import PagePublic from './pages/public';
import PageRegister from './pages/registerSystem';
import PageRegisMember from './pages/regisMember';

function App() {
  return (
    // <div>
    //   <Header></Header>
    //   <BodyMain></BodyMain>

    // </div>
    <BrowserRouter>
    <Routes>
      <Route path='/' element = {<PageLogin></PageLogin>}></Route>
      <Route path='/home' element = {<PageHome></PageHome>}></Route>
      <Route path='/public' element = {<PagePublic></PagePublic>}></Route>
      <Route path='/register' element = {<PageRegister></PageRegister>}></Route>
      <Route path='/remember' element = {<PageRegisMember></PageRegisMember>}></Route>
      

    </Routes>
    </BrowserRouter>
  );
}

export default App;
