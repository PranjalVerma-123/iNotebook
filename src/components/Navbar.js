import React from 'react'
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
    let location = useLocation();
    const logOut=()=>{
        localStorage.clear();
    }
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">iNotebook</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} aria-current="page" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} to="/about">About</Link>
                            </li>

                        </ul>
                        {!localStorage.getItem('token')?
                        <form className="d-flex" role="search">
                            {/* <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" /> */}
                            <Link className="btn btn-outline-light mx-3"to="/login" role="button" >Login</Link>
                            <Link className="btn btn-outline-light" to="/signup" role="button">SignUp</Link>
                        </form>: 
                        <Link className="btn btn-outline-light" to="/login" role="button" onClick={logOut}>LogOut</Link>}
                    </div>
                </div>
            </nav>
        </div>
    )
}
