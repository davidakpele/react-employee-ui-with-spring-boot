/* eslint-disable react/prop-types */
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '../views/auth/signin';
import Registration from '../views/auth/signup';
import Default from '../views/Dashboard/Home';
import ListOfEmployee from './../views/components/ListOfEmployee';
import EditEmployee from '../views/components/edit/EditEmployee';

const GetUserInfo = localStorage.getItem('appData');
// Parse the JSON string to an object
const ParseUserDataInfo = JSON.parse(GetUserInfo)
var setVerification, UserProperty;
// Check if the "app" property exists in the parsed object
const AuthUser = () => {
  if (ParseUserDataInfo && Object.prototype.hasOwnProperty.call(ParseUserDataInfo, 'app')) {
    // Access the "app" property
    UserProperty = ParseUserDataInfo.user;
    return UserProperty;
  } else {
    return null;
  }
}

let UserAuthContext = AuthUser();
setVerification =(UserAuthContext !=null || UserAuthContext !="" && UserAuthContext =='visitor' ? "ACTIVATE_PUBLIC" : (UserAuthContext !=null || UserAuthContext !="" && UserAuthContext =='admin') ? "ACTIVATE_PRIVATE" : "UNAUTHORIZE_USER");

const USER_TYPES = {
  PUBLIC : 'ACTIVATE_PUBLIC',
  ADMIN: 'ACTIVATE_PRIVATE',
  UNAUTHORIZE: 'UNAUTHORIZE_USER',
  AUTHENTICATION_USER_LOGIN:setVerification
}

const CURRENT_USER_TYPE = USER_TYPES.AUTHENTICATION_USER_LOGIN

const App = () => {
  return (
    <>
      <Routes>
        <Route path='*' element={<PublicElement><Default /></PublicElement>}> </Route>
        <Route path='/' element={<PublicElement><Default /></PublicElement>}></Route>
        <Route path='/default' element={<PublicElement><Default /></PublicElement>}></Route>
        <Route path='/auth/login' element={<UNAUTHORIZE><Login /></UNAUTHORIZE>}> </Route>
        <Route path='/auth/register' element={<UNAUTHORIZE><Registration /></UNAUTHORIZE>}> </Route>
        <Route path='/home' element={<PrivateElement><Default /></PrivateElement>}> </Route>
        <Route path='/list' element={<UNAUTHORIZE><ListOfEmployee /></UNAUTHORIZE>}> </Route>
        <Route path='/employee/edit/:id' element={<UNAUTHORIZE><EditEmployee /></UNAUTHORIZE>}> </Route>
      </Routes>
    </>
  )
}

function PublicElement({ children }) {
  if (CURRENT_USER_TYPE == USER_TYPES.PUBLIC) {
    return <>
      {children}
    </>
  } else {
    return <Navigate to={'../auth/login'}/>
  }
}

function UNAUTHORIZE({ children }) {
  if (CURRENT_USER_TYPE == USER_TYPES.UNAUTHORIZE) {
    return <>
      {children}
    </>
  } else {
    return <Navigate to={'/'}/>
  }
}
function PrivateElement({ children }) {
  if (CURRENT_USER_TYPE == USER_TYPES.UNAUTHORIZE) {
    return <Navigate to={'../auth/login'}/>
  } else {
    return <>
      {children}
    </>
  }
}

export default App