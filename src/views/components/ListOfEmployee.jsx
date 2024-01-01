/* eslint-disable react/prop-types */

import Nav from './Nav';
import { useMemo, useEffect, useState } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import API from '../../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faTimesCircle } from '@fortawesome/fontawesome-free-regular';
import { ToastContainer } from 'react-toastify';
import UseAuthContext from "../../context/AuthContext";
import { useForm } from "react-hook-form"
import { useNavigate  } from "react-router-dom"
import { useRef } from 'react';
import $ from "jquery"
import style from "./AddEmployee.module.css";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

const ListOfEmployee = () => {
    const [loading, setLoading] = useState(false);
  
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [data, setData] = useState([]);
    const { register, deleteEmployee } = UseAuthContext()
    const [mode, setMode] = useState('add'); // 'add' or 'edit'
    const [hasId, setHasId] = useState(false);
    const navigate = useNavigate(); 

    const emailRef = useRef(null);
    const fname = useRef(null);
    const lname = useRef(null);
    const ValidateEmailFilter = (/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
 
    const fetchData = async () => {
        if (loading) {
            return;
        }
        try {
            setLoading(true);
            API.get("/list").then(response => {
                setData(response.data);
            }).catch(error => {
                console.error("Error fetching data:", error);
            });
        } catch (error) {
            console.log(error);
        }finally {
            setLoading(false);
        }
    };

    const {
        handleSubmit,
    } = useForm();
 
    const ReFormatData = () => {
        $('#alert__message').empty();
        $('.base_error_msg_container').hide()
        setEmail('');
        setFirstName('');
        setLastName('');
    }
    const validate = async () => {
        if (firstname.trim() == "") {
            fname.current.focus();
            $('.base_error_msg_container').show();
            $('#alert__message').show().html("<span style='font-size:14px'>Provide Employee FirstName.*</span>");
            return false;
        }
        if (lastname.trim() == "") {
            lname.current.focus();
            $('.base_error_msg_container').show();
            $('#alert__message').show().html("<span style='font-size:14px'>Provide Employee LastName.*</span>");
            return false;
        }
        if (email.trim() == "") {
            emailRef.current.focus();
            $('.base_error_msg_container').show();
            $('#alert__message').show().html("<span style='font-size:14px'>Provide Employee Email Address.*</span>");
            return false;
        }else if (email.trim() != "" || email.trim() != null) {
        if (!ValidateEmailFilter.test(email)) {
            emailRef.current.focus();
            $('.base_error_msg_container').show();
            $('#alert__message').show().html("<span style='font-size:14px'>Invalid email address..! Please enter a valid email address.*</span>");
            return false;
        }
        }
        if (firstname !="" && lastname !="" && email !="") {
            await register({ "firstname": firstname, "lastname": lastname, "emailId": email })
            ReFormatData();
            // Fetch data again to update the table
            await fetchData();
        } else {
            toast.error("Something went wrong with the validation.");
            return false;
        }
        
    }

    useEffect(() => {
    // Fetch data from the backend
        fetchData();
    }, []);
    
    const columns = useMemo(
        () => [
        {
        id: "rowNumber",
        header: "S/N",
        Cell: ({ row }) => <div>{row.index + 1}</div>
      },
      {
        accessorKey: "firstname",
        header: "First Name"
      },
      {
        accessorKey: "lastname",
        header: "Last Name"
      },
      {
        accessorKey: "emailId",
        header: "Email"
      },
      {
        id: "actions",
        header: "Actions",
        Cell: ({ row }) => (
            <div style={{ display: 'flex', gap: '10%' }}>
            <FontAwesomeIcon className='btn btn-secondary btn-sm' icon={faEdit} onClick={() => getEmployeeId(row.original)} />
            <FontAwesomeIcon className='btn btn-danger btn-sm' icon={faTrashAlt} onClick={() => handleDelete(row.original)}/>
        </div>
        )
      }
    ],
    []
    );
    
    const table = useMaterialReactTable({
        data,
        columns
    });

    const getEmployeeId = (row) => {
        API.get("/employee/" + row.id, {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        })
        .then((rep) => {
            navigate(`/employee/edit/${rep.data.id}`)
            setMode('edit')
        })
        .catch((error) => {
            console.error(error);
        });
    };

    const ShowAddModel = () => {
        setHasId(true);
    }

    const handleDelete = async (row) => {
        // Handle delete action
        await deleteEmployee(row.id)
        if (data) {
            setData((prevElement) => {
                return prevElement.filter((data) => data.id !== row.id);
            });
            await fetchData();
        }
        
    };
    

    return (
    <>
        <Nav />
        <ToastContainer/>
            <div className="container mt-5 pt-10 pr-5 pl-5 pb-10">
                <div className="panel">
                    <div className="card">
                    <div className="panel-default">
                        <div className="panel-group">
                            <div className="panel-heading">
                                <div className="card-header">
                                    <div className="panel-title">
                                        <span>List of all our employee </span>
                                    </div>
                                </div>
                            </div>
                            <div className="panel-body">
                                <div className="card-body">
                                    <div className="addEmployeeSection pb-3">
                                        <button type="button" className='btn btn-success btn-sm' data-toggle="modal" data-target="#exampleModal" onClick={ShowAddModel}>Add new employee</button>
                                    </div>
                                    {loading ? (
                                        <div>Loading...</div>
                                    ) : (
                                        <MaterialReactTable table={table} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal Open*/}
            <div className={`modal fade ${hasId ? 'with-id' : ''}`} id={hasId ? 'exampleModal' : ''}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                      <FontAwesomeIcon icon={faTimesCircle}  className="close" data-dismiss="modal" aria-label="Close" style={{width:'18px'}} onClick={ReFormatData}/>
                    </div>
                    <div className="modal-body">
                        <div className="card">
                            <div className="card-header">
                                {mode === 'add' ? 'Add New Employee' : 'Edit Employee'}
                            </div>
                            <div className="card-body">
                            <div className="form-group">
                                <form method="post"  autoComplete="off">
                                    <div className="form-group">
                                      <label htmlFor="FirstNameInput" className={`${style.mutedLabel}`}>Firstname:*</label>
                                      <input type="text" ref={fname} className="form-control" id="exampleInputFirstName" placeholder="Provide Employee FirstName" value={firstname} onChange={(e) => setFirstName(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                      <label htmlFor="LastNameInput" className={`${style.mutedLabel}`}>LastName:*</label>
                                      <input type="text" ref={lname} className="form-control" id="exampleInputLastName" placeholder="Provide Employee LastName" value={lastname} onChange={(e) => setLastName(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1" className={`${style.mutedLabel}`}>Email address</label>
                                        <input type="email" ref={emailRef} className="form-control" id="exampleInputEmail1" placeholder="Provide Employee Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
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
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" id="loginButton" className={`${style.btnLog} ${style.cancel} btn `} onClick={ReFormatData} data-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit((data) => validate(data))}> <span className="loader"></span> Save new</button>
                    </div>
                </div>
            </div>
        </div> 
            {/* Modal Closed */}
        </div>
    </>
     
    
  )
}

export default ListOfEmployee
