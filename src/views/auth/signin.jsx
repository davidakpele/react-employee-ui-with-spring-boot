/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect, useRef } from 'react';
import "../../assets/dist/css/occ.css"
import "../../assets/fonts/font-awesome/css/all.css"
import Instyle from "./signin.module.css";
import "../../assets/dist/css/style.css"
import UseAuthContext from "../../context/AuthContext"
import { useForm } from "react-hook-form"
import $ from "jquery"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/fontawesome-free-regular';

const signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Create a ref for the email input
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const ValidateEmailFilter = (/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
 
  const { login } = UseAuthContext()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // set header title
  useEffect(() => {
    document.title = 'Login Account';
  }, []);

  const processData = async () => {

    if (email.trim() == "") {
      emailRef.current.focus();
      $('.base_error_msg_container').show();
      $('#alert__message').show().html("<span style='font-size:14px'>Provide your email address.*</span>");
      return false;
    } else if (email != "" || email != null) {
      if (!ValidateEmailFilter.test(email)) {
        emailRef.current.focus();
        $('.base_error_msg_container').show();
        $('#alert__message').show().html("<span style='font-size:14px'>Invalid email address..! Please enter a valid email address.*</span>");
        return false;
      }
    }
    if (password == "") {
      passwordRef.current.focus();
      $('.base_error_msg_container').show();
      $('#alert__message').show().html("<span style='font-size:14px'>Provide your password.*</span>");
      return false;
    }
    if (email != "" || email != null && password != "" && password != null) {
      $('.loader').show()
      $(".text").text("Processing...");
      login({ "email": email, "password": password })
    }
    
  }

  const handleTogglePassword  = () => {
    setIsPasswordVisible(!isPasswordVisible);
  }

  const {
    register,
    handleSubmit,
  } = useForm();

  return (
    <>
      <div className={ `${Instyle.topform}` }>
        <div className={Instyle.minicontainer}>
        <div className={Instyle.formWidget}>
          <div className="container">
            <div className="panel">
              <div className="card">
                <div className="panel-default">
                  <div className="panel-group">
                    <div className="panel-heading">
                      <div className="card-header">
                        <div className="panel-title">
                          <span>Login Account</span>
                        </div>
                      </div>
                    </div>
                    <div className="panel-body">
                      <div className="card-body">
                        <form method="POST" autoComplete='off' className="form-group" onSubmit={handleSubmit((data) => processData(data))}>
                          <div className="form-group">
                            <label htmlFor="exampleInputEmail1" className={`${Instyle.mutedLabel}`}>Email address</label>
                            <input {...register('email')} ref={emailRef} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <small id="emailHelp" className="form-text text-muted">We`ll never share your email with anyone else.</small>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Password:*</label>
                            <div className="form-input-group ">
                              <input autoComplete='off' type={isPasswordVisible ? 'text' : 'password'} className="form-control" id="exampleInputPassword1" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}  ref={passwordRef}/>
                                <FontAwesomeIcon
                                  icon={isPasswordVisible ? faEye : faEyeSlash}
                                  className={`${Instyle.Icon} fa fa-eye-slash`}
                                  onClick={handleTogglePassword}
                                />
                            </div>
                          </div>
                          <button type="submit" id="loginButton" className={`${Instyle.btnLog} ${Instyle.btnPrimary} btn`}>
                            <span className="loader"></span>
                            <span className="text">Login</span>
                          </button>
                        </form>
                      </div>
                    </div>
                    <div className="panel-footer">
                      <div className="card-footer">
                        <div className="panel-danger">
                          <div className="base_error_msg_container" style={{display:'none'}}>
                            <div className="alert__container alert--warning alert--dark" id="darkerror_resp">
                              <div className="alert__icon-box text-center" style={{  textAlign:'center', display:'flex', color:'#b92d2da9' }}>
                                <i className="fa fa-exclamation-circle" aria-hidden="true" style={{ marginTop:'5px', fontSize:'13px'}}>&nbsp;</i><div id="alert__message"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  )
}

export default signin
