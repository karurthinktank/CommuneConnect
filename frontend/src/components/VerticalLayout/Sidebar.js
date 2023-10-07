import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import withRouter from "components/Common/withRouter";

//i18n
import { withTranslation } from "react-i18next";
import SidebarContent from "./SidebarContent";

import { Link } from "react-router-dom";

import logo from "../../assets/images/logo.svg";
import logoLightPng from "../../assets/images/logo-light.png";
import logoLightSvg from "../../assets/images/logo-light.svg";
import logoDark from "../../assets/images/logo-dark.png";
import sidebarlogo from "../../assets/images/sidelogodark.png";
const Sidebar = props => {

  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div className="navbar-brand-box mb-4">
          <Link to="/" className="logo logo-dark">
            <span className="logo-sm">
              {/* <img src={sidebarlogo} alt="" height="22" /> */}
              <p>Temple</p>
            </span>
            <span className="logo-lg">
              {/* <img src={logoDark} alt="" height="17" /> */}
              <p>Temple</p>
            </span>
          </Link>

          <Link to="/" className="logo logo-light">
            <span className="logo-sm">
              <img src={sidebarlogo} alt="" style={{height:"38px"}}/>
              
            </span>
            <span className="logo-lg ms-4">
              <img src={sidebarlogo} alt="" style={{height:"97px"}}/>
            </span>
          </Link>
        </div>
        <div data-simplebar className="h-100 mt-1">
          {props.type !== "condensed" ? <SidebarContent /> : <SidebarContent />}
        </div>
        <div className="sidebar-background"></div>
      </div>
    </React.Fragment>
  );
};

Sidebar.propTypes = {
  type: PropTypes.string,
};

const mapStatetoProps = state => {
  return {
    layout: state.Layout,
  };
};
export default connect(
  mapStatetoProps,
  {}
)(withRouter(withTranslation()(Sidebar)));
