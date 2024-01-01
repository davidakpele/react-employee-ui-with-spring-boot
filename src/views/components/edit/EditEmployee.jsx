import style from "../AddEmployee.module.css";
import { useParams } from "react-router-dom"
import { useRef } from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import Nav from '../Nav';
import UseAuthContext from "../../../context/AuthContext";
import $ from "jquery"
import { toast } from 'react-toastify';
import API from "../../../api/axios";
import { ToastContainer } from 'react-toastify';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 

   
  const emailRef = useRef(null);
  const fname = useRef(null);
  const lname = useRef(null);
  const { updateEmployee } = UseAuthContext()
  const ValidateEmailFilter = (/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
 
  
  const [employee, setEmployee] = useState(
    {
      id: id,
      firstname: '',
      lastname: '',
      emailId: '',
    }
  );

  const cancelUpdate = () => {
    navigate(`/list`)
  }

  const HandleUpdateValidation = async(e) => {
    e.preventDefault()
    console.log(employee.lastname);
    if (employee.firstname== "" || employee.firstname ==null) {
        fname.current.focus();
        $('.base_error_msg_container').show();
        $('#alert__message').show().html("<span style='font-size:14px'>Provide Employee firstname.*</span>");
        return false;
    }
    if (employee.lastname== "" || employee.lastname ==null) {
        lname.current.focus();
        $('.base_error_msg_container').show();
        $('#alert__message').show().html("<span style='font-size:14px'>Provide Employee lastname.*</span>");
        return false;
    }
    if (employee.emailId== "" || employee.emailId ==null) {
        emailRef.current.focus();
        $('.base_error_msg_container').show();
        $('#alert__message').show().html("<span style='font-size:14px'>Provide Employee Email Address.*</span>");
        return false;
    }else if (employee.emailId!= "" || employee.emailId!= null) {
      if (!ValidateEmailFilter.test(employee.emailId)) {
        emailRef.current.focus();
        $('.base_error_msg_container').show();
        $('#alert__message').show().html("<span style='font-size:14px'>Invalid email address..! Please enter a valid email address.*</span>");
        return false;
      }
    }
    if (employee.firstname !="" || employee.firstname !=null && employee.lastname !="" || employee.lastname !=null && employee.emailId !="" || employee.emailId!= null) {
        await updateEmployee({ "firstname": employee.firstname, "lastname": employee.lastname, "emailId": employee.emailId, "id":employee.id})
      
    } else {
        toast.error("Something went wrong with the validation.");
        return false;
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value;
    setEmployee({...employee, [e.target.name] : value});
  };
 
   useEffect(() => {
    const fetchData = async () => {
      
      try {
        API.get("/employee/"+id, {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        })
        .then((rep) => {
            // Check if data is found before logging
           setEmployee(rep.data)
        })
        .catch((error) => {
          console.error(error);
          navigate(`/list`)
        });
      } catch (error) {
        navigate(`/list`)
      }
    }
    fetchData();
  }, []);
 
  return (
    <>
      <Nav />
      <ToastContainer/>
      <div className="container  mt-5 pt-10 pr-5 pl-5 pb-10">
        <div className="card">
          <div className="card-header">Edit Employee</div>
              <div className="card-body">
                <div className="form-group">
                  <form method="post"  autoComplete="off">
                    <div className="form-group">
                      <label htmlFor="firstnameInput" className={`${style.mutedLabel}`}>firstname:*</label>
                      <input type="text" ref={fname} 
                      name="firstname" className="form-control" 
                      placeholder="Provide Employee firstname"
                       defaultValue={employee.firstname}  onChange={(e)=>handleInputChange(e)}/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastnameInput" className={`${style.mutedLabel}`}>lastname:*</label>
                      <input type="text" ref={lname} name="lastname"
                       className="form-control" placeholder="Provide Employee lastname" 
                       defaultValue={employee.lastname} onChange={(e)=> handleInputChange(e)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1" className={`${style.mutedLabel}`}>Email address</label>
                        <input type="email" ref={emailRef} name="emailId" 
                        className="form-control" placeholder="Provide Employee Email Address" 
                        defaultValue={employee.emailId}  onChange={(e)=> handleInputChange(e)} />
                    </div>
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
              <div className="modal-footer">
                  <button type="button" className={`${style.btnLog} ${style.cancel} btn `} onClick={cancelUpdate} data-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary" onClick={HandleUpdateValidation}> <span className="loader"></span> Save changes</button>
              </div>
            </div>
        </div>
    </>
  )
}

export default EditEmployee
