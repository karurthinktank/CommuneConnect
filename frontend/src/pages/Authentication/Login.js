import PropTypes from "prop-types";
import React, { useState } from "react";

import { Input, FormFeedback, Label } from "reactstrap";

//redux
import { Link, useNavigate } from "react-router-dom";
import withRouter from "components/Common/withRouter";


// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

// import css
import "../../assets/scss/_login.scss"
// import images
import logo from "assets/images/logo.svg";
import bgbanner from "assets/images/Sri-Ranganathaswamy-Temple.jpeg"
import { GET, POST } from "../../helpers/api_helper";
import { LOGIN_URL, USER } from "../../helpers/url_helper";
// import { setUser } from "../../helpers/jwt-token-access/accessToken";

function Login() {
  const navigate = useNavigate();
  //meta title
  document.title = "Login | Temple";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Please Enter your username"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      var res = await POST(LOGIN_URL, values);
      console.log(res);
      if (res.status == 200) {
        localStorage.setItem("access_token", res.data.access);
        setLoading(false);
        setError('');
        get_user(res.data.access);
      }
      else {
        setLoading(false);
        setError(res.message);
      }
    }
  });

  const get_user = async (token) => {
    var res = await GET(USER, { headers: { Authorization: `Bearer ${token}` } });
    if (res.status == 200) {
      localStorage.setItem("auth_user", JSON.stringify(res.data));
      navigate('/home');
    }
    else {
      // toast msg
    }
  }

  return (
    <>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="bx bx-home h2" />
        </Link>
      </div>

      <div className="account-pages my-5 pt-sm-5">

        <div class="container">
          <div class="row m-5 no-gutters shadow-lg">
            <div class="col-md-8 d-none d-md-block">
              {/* <img src="https://images.unsplash.com/photo-1566888596782-c7f41cc184c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=2134&q=80" class="img-fluid"/> */}
              <img src={bgbanner} class="img-fluid" style={{ minHeight: "100%" }} />

            </div>
            <div class="col-md-4 bg-white p-5">
              <h3 class="pb-3">Login Form</h3>
              <div class="form-style">
                <form  className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}>

                  <div className="mb-3">
                    <Label className="form-label">Username</Label>
                    <Input
                      name="username"
                      className="form-control"
                      placeholder="Enter username"
                      type="text"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.username || ""}
                      invalid={
                        validation.touched.username && validation.errors.username ? true : false
                      }
                    />
                    {validation.touched.username && validation.errors.username ? (
                      <FormFeedback type="invalid">{validation.errors.username}</FormFeedback>
                    ) : null}
                  </div>

                  <div className="mb-3">
                    <Label className="form-label">Password</Label>
                    <Input
                      name="password"
                      value={validation.values.password || ""}
                      type="password"
                      placeholder="Enter Password"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={
                        validation.touched.password && validation.errors.password ? true : false
                      }
                    />
                    {validation.touched.password && validation.errors.password ? (
                      <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                    ) : null}
                  </div>
                  {/* <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center"><input name="" type="checkbox" value="" /> <span class="pl-2 font-weight-bold">Remember Me</span></div>
                  </div> */}
                  <div class="pb-2">
                    <button type="submit" class="btn btn-dark w-100 font-weight-bold mt-2">Submit</button>
                  </div>
                </form>

              
                <div>

                </div>
                
              </div>

            </div>
          </div>
        </div>
      
      </div>
    </>
  );
};

export default withRouter(Login);

Login.propTypes = {
  history: PropTypes.object,
};
