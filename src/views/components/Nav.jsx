import { Link, useNavigate  } from "react-router-dom"
import useAuthContext from "../../context/AuthContext"
import { useState, useEffect } from 'react';

const Nav = () => {
    const [username, setUsername] = useState('');
    const { user, getUser, logOutUser} = useAuthContext();
    const [loading ] = useState(false);
    const navigate = useNavigate();
    const logout = () => {
      logOutUser();
    }
  // set header title
  useEffect(() => {
    document.title = 'Dashboard';
  }, []);

  const redirectAUTH = () => {
    navigate('auth/login')
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        getUser();
      } else {
       setUsername(user);   
      }
      // If a request is already in progress, return to avoid duplicate requests
      if (loading) {
        return;
      }
      
    }
    // Fetch data on mount
    fetchData();
    return () => {
      // Cancel the Axios request (if it's still ongoing)
      // This requires creating a cancel token, check Axios documentation for details
    };
  }, [loading, getUser, user]);
   
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link className="navbar-brand" to={"#"}>Employee Management System</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <Link className="nav-link" to={"/"}>Home <span className="sr-only">(current)</span></Link>
              </li>
            </ul>
            {username ? (
            <>
              <div style={{ display: 'flex', gap: "20px" }}>
                <p className="text" style={{ color: '#fff' }}><span style={{ marginTop: '60px' }}> Welcome, {username}!</span></p>
                <button onClick={logout} className="btn btn-xs btn-danger">Logout</button>
              </div>
              <div className="searchInput">
                <form className="form-inline my-2 my-lg-0">
                  <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                  <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
              </form>
              </div>
            </>
            ) : (
              <>
              <button type="button" className="btn-xs btn btn-success" onClick={redirectAUTH}>Login</button>
              </>
          )}
            
        </div>
        </nav>
    </>
  )
}

export default Nav
