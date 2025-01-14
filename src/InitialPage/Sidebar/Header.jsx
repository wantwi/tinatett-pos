import React, { useState, useEffect, useContext } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import {
  Logo,
  SmallLogo,
  Closes,
  HeaderSearch,
  Flag,
  FlagUS,
  FlagFR,
  FlagES,
  FlagDE,
  Notification,
  Avatar,
  Logout,
} from "../../EntryFile/imagePath";
import { Link } from "react-router-dom";
import { io } from 'socket.io-client';
import { SOCKET_BASE_URL } from "../../api/CustomAxios";
export const socket = io.connect(SOCKET_BASE_URL)
import { AppContext } from "./DefaultLayout";
import { timeAgo } from "../../utility";
import Select from "react-select";
import { useGet } from "../../hooks/useGet";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
// import { useIdleTimer } from "react-idle-timer"



const Header = (props) => {
  const [searchBar, SetSearchBar] = useState(false);
  const [toggle, SetToggle] = useState(false);
  const [dateState, setDateState] = useState(new Date());
  const [loggedInUser, setLoggedInUser] = useState({})
  const [branchesList, setBranchesList] = useState()
  const [userType, setUserType] = useState('')
  const [loggedIn, setLoggedIn] = useState(true)


  const { notifications, setNotifications, selectedBranch, setSelectedBranch, setIsRefreshing } = useContext(AppContext)
  const { data: branches, isLoading } = useGet("branches", "/branch");


  useEffect(() => {
    let userRole = localStorage.getItem('auth')
    let obj = JSON.parse(userRole)
    //console.log("Role:", obj.role)
    setUserType(obj.role)
  }, [])


  useEffect(() => {
    let userRole = localStorage.getItem('auth')
    let obj = JSON.parse(userRole)
    //console.log("branches", branchesList)
    setTimeout(() => {
      if(obj.branchId && !isLoading){
        let branch = branchesList.find((branch) => branch.value == obj?.branchId)
        setSelectedBranch(branch)
      }
    }, 2000)
    
   
  },[branchesList])

  useEffect(() => {
    if (!isLoading) {
     // console.log("Branches", branches)
      let mappedData = branches?.data.map((branch) => {
        return {
          value: branch?.id,
          label: branch?.name,
        }
      })
      setBranchesList(mappedData)
    }
  }, [isLoading])

  useEffect(() => {
    let userDetails = localStorage.getItem('auth')
    let user = JSON.parse(userDetails)
    setLoggedInUser(user)
    if (user) {
      socket.emit("join_room", user?.branchId)
    }
  }, [])

  const handlesidebar = () => {
    document.body.classList.toggle("mini-sidebar");
    SetToggle((current) => !current);
  };
  const expandMenu = () => {
    document.body.classList.remove("expand-menu");
  };
  const expandMenuOpen = () => {
    document.body.classList.add("expand-menu");
  };
  const sidebarOverlay = () => {
    document.querySelector(".main-wrapper").classList.toggle("slide-nav");
    document.querySelector(".sidebar-overlay").classList.toggle("opened");
    document.querySelector("html").classList.toggle("menu-opened");
  };

  const checkForInactivity = () => {
    const expireTime = localStorage.getItem('expireTime')
    if(expireTime < Date.now()){
      console.log('Log out')
      setOpenModal(true)
      setLoggedIn(false)
    }
  }

  const updateExpireTime = () => {
    const expireTime = Date.now() + 600000

    //set expire time in local storage
    localStorage.setItem("expireTime", expireTime)
  }

  useEffect(() => {

    //set initial expire time
    updateExpireTime()

    //set eventListeners
    window.addEventListener("click", updateExpireTime)
    window.addEventListener("keypress", updateExpireTime)
    window.addEventListener("scroll", updateExpireTime)
    window.addEventListener("mousemove", updateExpireTime)


    //clean up
    return () => {
      window.removeEventListener("click", updateExpireTime)
      window.removeEventListener("keypress", updateExpireTime)
      window.removeEventListener("scroll", updateExpireTime)
      window.removeEventListener("mousemove", updateExpireTime)
    }
  }, [])

  let pathname = location.pathname;

  useEffect(() => {
    setInterval(() => setDateState(new Date()), 1000);

    const interval = setInterval(() => {
      checkForInactivity()
    }, 5000)

    return () => clearInterval(interval)
  }, []);


  const [openModal, setOpenModal] = useState(false)

  const handleIdle = () => {
    setOpenModal(true);
  }

  const history = useHistory()

  const handleLogout = () => {
    //logout()
    console.log('...loggin out')
    setOpenModal(false)
    localStorage.removeItem('auth')
    setTimeout(() => {
      history.push('/')
    }, 1000)
  }

  const handleContinue = () => {
    updateExpireTime()
    setOpenModal(false)
  }


  // useEffect(() => {
  //   console.log(selectedBranch)
  // }, [selectedBranch])

  return (
    <>
      <div className="header">
        {/* Logo */}
        <div
          className={`header-left ${toggle ? "" : "active"}`}
          onMouseLeave={expandMenu}
          onMouseOver={expandMenuOpen}
        >
          <Link to="/tinatett-pos/dashboard" className="logo" style={{ fontSize: '18px', fontWeight: 900, display: 'flex', alignItems: 'center' }}>
            <img src={Logo} alt="" style={{ height: 40, width: 50 }} /> Stock Manager
          </Link>
          <Link to="/tinatett-pos/dashboard" className="logo-small">
            <img src={SmallLogo} alt="" />
          </Link>
          <Link
            id="toggle_btn"
            to="#"
            style={{
              display: pathname.includes("tasks")
                ? "none"
                : pathname.includes("compose")
                  ? "none"
                  : "",
            }}
            onClick={handlesidebar}
          ></Link>{" "}
        </div>
        {/* /Logo */}
        <Link
          id="mobile_btn"
          className="mobile_btn"
          to="#"
          onClick={sidebarOverlay}
        >
          <span className="bar-icon">
            <span />
            <span />
            <span />
          </span>
        </Link>
        {/* Header Menu */}
        <ul className="nav user-menu">
         
          <li className="nav-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginRight: 50 }}>
            <span style={{marginRight:10}}>Branch:</span>  <Select isDisabled={userType !== 'admin'} id="selectedBranch" className="select form-control" options={branchesList} value={selectedBranch} onChange={(e) => { setSelectedBranch(e), setIsRefreshing(true) }}/>
          </li>
         

          <li className="nav-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>

            {dateState.toUTCString('en-GB', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })}
          </li>
          {/* Search */}
          {/* <li className="nav-item">
            <div className="top-nav-search">
              <Link to="#" className="responsive-search">
                <i className="fa fa-search" />
              </Link>
              <form action="#">
                <div className={`searchinputs ${searchBar ? "show" : ""}`}>
                  <input type="text" placeholder="Search Here ..." />
                  <div
                    className="search-addon"
                    onClick={() => SetSearchBar(false)}
                  >
                    <span>
                      <img src={Closes} alt="img" />
                    </span>
                  </div>
                </div>
                <Link
                  to="#"
                  className="btn"
                  id="searchdiv"
                  onClick={() => SetSearchBar(true)}
                >
                  <img src={HeaderSearch} alt="img" />
                </Link>
              </form>
            </div>
          </li> */}
          {/* /Search */}
          {/* Flag */}
          <li className="nav-item dropdown has-arrow flag-nav">
            <Link
              to="#"
              className="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
              role="button"
            >
              <img src={Flag} alt="" height={20} />
            </Link>
            <div className="dropdown-menu dropdown-menu-right">
              <Link to="#" className="dropdown-item">
                <img src={FlagUS} alt="" height={16} /> English
              </Link>
              {/* <Link to="#" className="dropdown-item">
                <img src={FlagFR} alt="" height={16} /> French
              </Link>
              <Link to="#" className="dropdown-item">
                <img src={FlagES} alt="" height={16} /> Spanish
              </Link>
              <Link to="#" className="dropdown-item">
                <img src={FlagDE} alt="" height={16} /> German
              </Link> */}
            </div>
          </li>
          {/* /Flag */}
          {/* Notifications */}
          <li className="nav-item dropdown">
            <Link
              to="#"
              className="dropdown-toggle nav-link"
              data-bs-toggle="dropdown"
            >
              <img src={Notification} alt="img" className="noti-image" />
              <span className="badge rounded-pill">{notifications.length}</span>
            </Link>
            <div className="dropdown-menu notifications">
              <div className="topnav-dropdown-header">
                <span className="notification-title">Notifications</span>
                <Link to="#" className="clear-noti" onClick={() => setNotifications([])}>
                  {" "}
                  Clear All{" "}
                </Link>
              </div>
              <div className="noti-content">
                <ul className="notification-list">
                  {notifications.map((notification, idx) => {
                    return (
                      <li className="notification-message" key={idx} onClick={() => {
                        let data = [...notifications]
                        let filtered = data.filter((item) => item.message != notification.message)
                        //data.forEach(item => console.log(item, notification))
                        setNotifications(filtered)
                      }}>
                        <Link to="#">
                          <div className="media d-flex">
                            <span className="avatar flex-shrink-0" style={{ background: notification.type == 'success' ? '#008179' : notification.type == 'warning' ? 'orange' : notification.type == 'error' ? 'darkred' : '#45b6fe' }}>
                              <i className="far fa-bell" />
                            </span>
                            <div className="media-body flex-grow-1">
                              <p className="noti-details">
                                <span className="noti-title">{notification.message.split(' ').slice(0, 2)}</span> {notification.message.split(' ').slice(2).join(' ')}
                                {" "}
                                {/* <span className="noti-title">
                            successfully
                            </span> */}
                              </p>
                              <p className="noti-time">
                                <span className="notification-time">
                                  {timeAgo(notification.time)}
                                </span>
                              </p>
                            </div>
                          </div>
                        </Link>
                      </li>
                    )
                  })}



                </ul>
              </div>
              <div className="topnav-dropdown-footer">
                <Link to="/tinatett-pos/activities">View all Notifications</Link>
              </div>
            </div>
          </li>
          {/* /Notifications */}
          <li className="nav-item dropdown has-arrow main-drop">
            <Link
              to="#"
              className="dropdown-toggle nav-link userset"
              data-bs-toggle="dropdown"
            >
              <span className="user-img">
                <img src={Avatar} alt="" />
                <span className="status online" />
              </span>
            </Link>
            <div className="dropdown-menu menu-drop-user">
              <div className="profilename">
                <div className="profileset">
                  <span className="user-img">
                    <img src={Avatar} alt="" />
                    <span className="status online" />
                  </span>
                  <div className="profilesets">
                    <h6>{loggedInUser?.name}</h6>
                    <h5>{loggedInUser?.groupName}</h5>
                  </div>
                </div>
                <hr className="m-0" />
                {/* <Link className="dropdown-item" to="/tinatett-pos/profile/user-profile">
                  <i className="me-2" data-feather="user" /> My Profile
                </Link> */}
                {/* <Link
                  className="dropdown-item"
                  to="/tinatett-pos/settings/generalsettings"
                >
                  <i className="me-2" data-feather="settings" />
                  Settings
                </Link> */}
                <hr className="m-0" />
                <Link className="dropdown-item logout pb-0" to="/signIn" onClick={() => localStorage.removeItem('auth')}>
                  <img src={Logout} className="me-2" alt="img" />
                  Logout
                </Link>
              </div>
            </div>
          </li>
        </ul>
        {/* /Header Menu */}
        {/* Mobile Menu */}
        <div className="dropdown mobile-user-menu">
          <Link
            to="#"
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-ellipsis-v" />
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link className="dropdown-item" to="/tinatett-pos/profile/user-profile">
              My Profile
            </Link>
            <Link className="dropdown-item" to="/tinatett-pos/settings/generalsettings">
              Settings
            </Link>
            <Link className="dropdown-item" to="/signIn">
              Logout
            </Link>
          </div>
        </div>
        {/* /Mobile Menu */}
      </div>

      <Modal isOpen={openModal} onHide={updateExpireTime}>
        <ModalHeader>You Have Been Idle!</ModalHeader>
        <ModalBody>
          Your session has been timed Out. Do you want to stay? 
        </ModalBody>
        <ModalFooter>
          <Button variant='danger' onClick={handleLogout}>
            {' '}
            Logout
          </Button>{' '}
          <Button variant='primary' onClick={handleContinue}>
            Continue Session
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Header;
