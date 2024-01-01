/* eslint-disable no-unused-vars */
import { createContext, useContext, useState, useReducer  } from "react"
import { useNavigate } from "react-router-dom";
import $ from 'jquery';
import API from '../api/axios'
import { toast } from 'react-toastify';
const AuthContext = createContext({});

const initialState = {
  isAuthenticated: false,
  // other user-related data can be stored here
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false };
    default:
      return state;
  }
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const Userlogin = () => dispatch({ type: 'LOGIN' });
  const logout = () => dispatch({ type: 'LOGOUT' });
  const [user, setUser] = useState(null) 
  const [errors, setErrors] = useState([]);
  
  const navigate = useNavigate();

  const getUser = async () => {
    const userToken = localStorage.getItem('appData');
     // Parse the JSON string to an object
    const appData = JSON.parse(userToken);
   // Check if the "app" property exists in the parsed object
    if (appData && Object.prototype.hasOwnProperty.call(appData, 'app')) {
      // Access the "app" property
      const username = appData.user.authUser;
      setUser(username)
    } 
  }

  const getJwtTokenStorage = ()=> {
    const userToken = localStorage.getItem('appData');
    // Parse the JSON string to an object
    const UserData = JSON.parse(userToken);
    // Check if the "app" property exists in the parsed object
    if (UserData && Object.prototype.hasOwnProperty.call(UserData, 'user')) {
      // Access the "app" property
      const userContainer = UserData.user._jwt_.iot_pack;
      const userName = UserData.user.authUser;
      const userRole = UserData.user.role;
      // Get a value from sessionStorage
      const storedValue = sessionStorage.getItem('application_');
      return [userContainer, userName, userRole];
    } 
  }
  // Set a Cookie
  const setCookie=(cName, cValue, expDays)=> {
    let date = new Date();
    date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
  }
  // Function to set the entire JSON object to localStorage
  const setAppDataToLocalStorage = (token, name, role)  => {
    // Set an item in localStorage
    sessionStorage.setItem('jwt', token);
    const appData = {
      "app": {
        "alignment": "right",
        "color": "#76a617",
        "customGoogleAnalyticsTrackerId": null,
        "features": {
          "isDeveloperWorkspace": false,
          "isInstantBootEnabled": true,
          "launcherLogoUrl": null,
          "name":"MidTech Softwares Solutions Inc."
        },
        "openConfig": {
          "layout": "default",
          "openTo": "home",
          "spaces": [
            {
            "logo": null,
            "Apptype":"micservice"
            }
          ],
          "userHasLiveNewsfeed": false,
          "userHasReceivedChecklists": false,
          "userHasTickets": false,
          "selfServeSuggestionsMatch":false
        }
      },
      "launcher": {
        "isLauncherEnabled":true
      },
      "launcherDiscoveryMode": {
        "hasDiscoveredLauncher":false,
      },
      "user": {
        "hasConversations": false,
        "locale": "en",
        "role": role,
        "authUser": name,
        "_jwt_": {
          "iot_pack":token,
        }
      },
      "message": {},
      "conversations": {
        "byId": {}
      },
      "openOnBoot": {
        "type": null,
        "metadata": {}
      },
      "operator": {
        "lastComposerEvent": 0
      },
      "router": {
        "location": null,
        "action": null,
        "previousLocations": []
      }
    };

    // Convert the object to a JSON string
    const appDataString = JSON.stringify(appData);
    // Store the string in localStorage
    localStorage.setItem('appData', appDataString);
    localStorage.setItem('jwt', token);
    sessionStorage.setItem('application_', appDataString);
  };
  
  const GenerateStateToken =() => {
      // Generate a random token using the crypto API
      const randomBytes = new Uint8Array(16);
      crypto.getRandomValues(randomBytes);
      const token = Array.from(randomBytes)
          .map(byte => byte.toString(16).padStart(2, '0'))
          .join('');
      return `${token.substr(0, 6)}-${token.substr(8, 8)}-${token.substr(12, 4)}-${token.substr(12, 6)}-${token.substr(20)}`;
    
  }
  
  const RefreshJwtToken = async () => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      var getjwt, response, data, csrf_token;
      csrf_token = GenerateStateToken();
      const JwtContainer = getJwtTokenStorage()
  
      API.get('APIController/refreshToken',{
        headers: {'Authorization': `Bearer ${JwtContainer[0]}`}
      })
        .then(response => {
        // Handle the response
        if (response.status == 200) {
          const token  =  response.data.token;
          const name  =  response.data.username;
          const role  =  response.data.role;
          setAppDataToLocalStorage(token, name, role)
          setCookie('jwt', token, 30);
        } else {
          logOutUser();
        }
      })
      .catch(error => {
        // Handle errors
        logOutUser();
      });
    } catch (error) {
      // Handle error
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  //login process
  const login = async ({ ...data }) => {
    API.post("APIController/loginUser", JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json', }
      })
        // Handle the response from backend here
      .then((response) => {
         //user is logged in successfully in the back-end
        if (response.status == 200) {
          
          // set the user as logged in and store the token in local storage
          const token  =  response.data.token;
          const name  =  response.data.username;
          const role = response.data.role;
          // Apply setCookie
          setCookie('jwt', token, 30);
          setAppDataToLocalStorage(token, name, role)
            setTimeout(function () {
                window.location.replace("/");
            }, 0);
        } else {
          if (response.status == 409 || response.status == 406 || response.status == 403 || response.status == 405 || response.status == 400) {
            $(".text").text("Login");
            $('.base_error_msg_container').show();
            $('.alert__message').show().text(response.error);
            return false;
          }
          $(".loader").hide();
          $(".text").text("Login");
        }
      }).catch((xhr) => {
        if (xhr.response.status == 409 || xhr.response.status == 406 || xhr.response.status == 403 || xhr.response.status == 405 || xhr.response.status == 400) {
            $('.emsg').empty();
            $('.pmsg').hide();
            $(".loader").hide();
            $(".text").text("Login");
            $('.base_error_msg_container').show();
            $('#alert__message').show().text(xhr.response.data.message);
            return false;
        } 
      });
  
  }

  // Register process
  const register = async ({ ...data }) => {
    try {
      await API.post("/employees",JSON.stringify(data),{
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', 
    })
      toast.success('New Employee has been Added.!');
      $('#exampleModal').modal('hide');
    } catch (error) {
      console.log(error);
    }
  };

  const updateEmployee = async ({ ...data }) => {
    var id = data.id;
    console.log(data.emailId);
    try {
      await API.put("/employee/edit/"+id, JSON.stringify(data),{
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', 
    })
      toast.success('Update Successful.');
      $('.base_error_msg_container').hide();
      $('#alert__message').empty();
      setInterval(() => {
        navigate('/list')
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };
  
  const deleteEmployee = async (data) => {
    try {
      await API.delete("/delete/"+data,{
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', 
    })
      toast.success('Employee has been Deleted.!');
    } catch (error) {
      console.log(error);
    }
  }


  const clearCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  };

  const logOutUser = () => {
    API.post("APIController/logout",)
    .then((success) => {
      window.location = '/';  
      localStorage.clear();
      sessionStorage.clear();
      // Call the clearCookie function with the cookie name you want to clear
      clearCookie('jwt');
      // Perform any additional logout logic here

      if ($.cookie("jwt") != null) {
        $.cookie("jwt", null, { path: '/' });
        $.removeCookie('jwt', { path: '/' });
      }
    }).fail((error) => {
      console.log(error);
    })
  }

  return <AuthContext.Provider value={{...state,deleteEmployee,updateEmployee, RefreshJwtToken, logout, Userlogin, AuthProvider, useAuth, user, errors, getUser, login, register, logOutUser }}>
    {children}
  </AuthContext.Provider>

}

// eslint-disable-next-line react-refresh/only-export-components
export default function useAuthContext() {
  return useContext(AuthContext)
}