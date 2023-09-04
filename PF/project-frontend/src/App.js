import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from './components/authentication/Signup'
import Login from './components/authentication/Login'
import MainPage from './components/MainPage'
import StudioSearch from './components/Studios/StudioSearch';
import ViewStudio from './components/Studios/ViewStudio';
import ListClasses from './components/Classes/ListClasses';
import ListClassInstances from './components/Classes/ListClassInstances';
import PageNotFound from './components/PageNotFound';
import ListAllSubscriptionsView from './components/User/Subscription/ListAllSubscriptionsView';
import UpdateSubscriptionsView from './components/User/Subscription/UpdateSubscriptionsView';
import { useState } from 'react';
import NavBar from './components/BaseComponents/NavBar';
import ListAllPaymentHistory from './components/User/Profile/ListAllPaymentHistory';
import EditCardInfo from './components/User/Profile/EditCardInfo';
import EditProfile from './components/User/Profile/EditProfile';
import Schedule from './components/User/Profile/Schedule';


function App() {
  const [token, setToken] = useState('')
  const [refresh, setRefresh] = useState('')

  const baseURL = 'http://localhost:8000'

  return (
    <div className="App">
    <BrowserRouter>
      <Routes>
          <Route path="/signup" element={<Signup baseURL={baseURL}/>} ></Route>
          <Route path="/" element={<Login token = {token} setToken = {setToken} setRefresh = {setRefresh} baseURL={baseURL}/>}  ></Route>
          <Route path='/home' element={[<NavBar/>, <MainPage token = {token} baseURL={baseURL}/>]}  ></Route>
          <Route path='/subscriptions' element={[<NavBar/>, <ListAllSubscriptionsView token = {token} baseURL={baseURL}/>]}  ></Route>
          <Route path='/subscriptions/update' element={[<NavBar/>, <UpdateSubscriptionsView token = {token} baseURL={baseURL}/>]}  ></Route>
          <Route path='/search/studios' element={[<NavBar/>, <StudioSearch token = {token} baseURL={baseURL}/>]} ></Route>
          <Route path='/user/profile' element={[<NavBar/>, <EditProfile token = {token} baseURL={baseURL}/>]} ></Route>
          <Route path='/view/studio' element={[<NavBar/>, <ViewStudio token = {token} baseURL={baseURL}/>]} ></Route>
          <Route path='/view_classes' element={[<NavBar/>, <ListClasses baseURL={baseURL} token={token} />]} ></Route>
          <Route path='/view/PaymentHistory' element={[<NavBar/>, <ListAllPaymentHistory token = {token} baseURL={baseURL}/>]} ></Route>
          <Route path='/cardInfo' element={[<NavBar/>, <EditCardInfo token = {token} baseURL={baseURL}/>]} ></Route>
          <Route path='/view/sessions' element={[<NavBar/>, <ListClassInstances  baseURL={baseURL} token={token}/>]} ></Route>
          <Route path='/page-not-found' element={[<NavBar/>, <PageNotFound />]} ></Route>
          <Route path='/user/schedule' element={[<NavBar/>, <Schedule baseURL={baseURL} token={token} />]} ></Route>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
