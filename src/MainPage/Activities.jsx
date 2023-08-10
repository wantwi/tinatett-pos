import React, { useContext } from "react";
import { Link } from 'react-router-dom'
import {Bruklin,Profile3,Profile4,Profile5} from "../EntryFile/imagePath";
import { NotificationsContext } from "../InitialPage/Sidebar/DefaultLayout";
import { timeAgo } from "../utility";

const Activities = () => {
  const { notifications, setNotifications } = useContext(NotificationsContext)
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>All Notifications</h4>
            <h6>View your all activities</h6>
          </div>
        </div>
        {/* /product list */}
        <div className="activity">
          <div className="activity-box">
            <ul className="activity-list">
              {notifications.map((notification, idx) => 
              (<li>
                <div className="activity-user">
                  <Link
                    to="#"
                    title=""
                    data-toggle="tooltip"
                    data-original-title="Lesley Grauer"
                  >
                    <img
                      alt="Lesley Grauer"
                      src={Profile3}
                      className=" img-fluid"
                    />
                  </Link>
                </div>
                <div className="activity-content">
                  <div className="timeline-content">
                    {notification.message}
                    <span className="time">{timeAgo(notification.time)} ago</span>
                  </div>
                </div>
              </li>)
              )}
              
             
            </ul>
          </div>
        </div>
        {/* /product list */}
      </div>
    </div>
  );
};

export default Activities;
