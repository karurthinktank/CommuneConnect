import React, { useEffect, useState } from "react";
import { Row, Col, CardBody, Card, Alert, Container, Input, Label, Form, FormFeedback } from "reactstrap";
import Loader from "../../helpers/spinner";
// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

import { Link, useNavigate } from "react-router-dom";
import { POST} from "../../helpers/api_helper";
import { USER_URL } from "../../helpers/url_helper";

// import images
import profileImg from "../../assets/images/ElawFirm copy.png";
import logoImg from "../../assets/images/logo.svg";


function Register(props){

  //meta title
  document.title = "Register | ElawFirm";
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      first_name:'',
      last_name:'',
      email: '',
      username: '',
      password: '',
      confirmpassword:'',
     
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email format').required('Email is Required'),
      username: Yup.string().required("Username is Required"),
      first_name: Yup.string().required("FirstName is Required"),
      last_name: Yup.string().required("LastName is Required"),
      password: Yup.string().required("Password is Required"),
      confirmpassword:Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
      
    }),
    onSubmit: async (values) => {
      setLoading(true);
      var res = await POST(USER_URL, values);
      console.log(res);
      if(res.status == 200 || res.status == 201){
        setUser(res.data);
        setLoading(false);
        setError('');
        navigate('/login');
      }
      else{
        setUser('');
        setLoading(false);
        setError(res.statusText);
      }
    }
  });
  
  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="bx bx-home h2" />
        </Link>
      </div>
      <div className="account-pages my-2 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col className="col-12">
                      <div className="text-primary p-3 mb-2">
                        <p className="text-primary">START FOR FREE</p>
                        <h2>Sign UP to  ElawFirm </h2>
                      </div>
                    </Col>
                    {/* <Col className="col-5 align-self-end">
                      <img src={profileImg} alt="" className="img-fluid" />
                    </Col> */}
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/">
                      <div className="avatar-md profile-user-wid mb-1">
                        <span className="avatar-title rounded-circle bg-light">
                          <img
                            src={profileImg}
                            alt=""
                            className="rounded-circle"
                            height="97"
                          />
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    <Form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      {user && user ? (
                        <Alert color="success">
                          Register User Successfully
                        </Alert>
                      ) : null}

                      {error && error ? (
                        <Alert color="danger">{error}</Alert>
                      ) : null}
                      <div className="mb-3">
                        <label className="form-label">First Name<span className="text-danger">*</span></label>
                        <Input
                           id="first_name"
                           name="first_name"
                           className="form-control"
                           placeholder="Enter firstname"
                           type="text"
                           onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.first_name}
                          invalid={validation.touched.first_name && validation.errors.first_name ? true:false}
                        />
                        {validation.touched.first_name && validation.errors.first_name ?(
                          <FormFeedback type="invalid">{validation.errors.first_name}
                          </FormFeedback>
                        ):null}
                      </div>
                      <div className="mb-3">
                        <Label className="form-label">Last Name<span className="text-danger">*</span></Label>
                        <Input
                           id="last_name"
                           name="last_name"
                           className="form-control"
                           placeholder="Enter lastname"
                           type="text"
                           onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.last_name}
                          invalid={validation.touched.last_name && validation.errors.last_name ? true :false}
                        />
                        {validation.touched.last_name && validation.errors.last_name ?(
                            <FormFeedback type="invalid">{validation.errors.last_name}
                            </FormFeedback>
                        ) : null}
                      </div>
                      <div className="mb-3">
                        <Label className="form-label d-flex">Email<span className="text-danger">*</span></Label>
                        <Input
                          id="email"
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email && validation.errors.email ? true : false
                          }
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Username<span className="text-danger">*</span></Label>
                        <Input
                          name="username"
                          type="text"
                          placeholder="Enter username"
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
                        <Label className="form-label">Password<span className="text-danger">*</span></Label>
                        <Input
                          name="password"
                          type="password"
                          placeholder="Enter Password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.password || ""}
                          invalid={
                            validation.touched.password && validation.errors.password ? true : false
                          }
                        />
                        {validation.touched.password && validation.errors.password ? (
                          <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                        ) : null}
                      </div>
                      <div className="mb-3">
                        <Label className="form-label">Confirm password<span className="text-danger">*</span></Label>
                        <Input
                          name="confirmpassword"
                          type="confirmpassword"
                          placeholder="Enter Confirm Password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.confirmpassword}
                          invalid={validation.touched.confirmpassword && validation.errors.confirmpassword ? true : false
                          }
                        />
                        {validation.touched.confirmpassword && validation.errors.confirmpassword ?(
                          <FormFeedback type="invalid">
                             {validation.errors.confirmpassword}
                          </FormFeedback>
                        ) : null}
                      </div>
                      <div className="mt-4 text-center">
                        <button
                          className="btn btn-primary btn-block "
                          type="submit"
                        >
                          Register
                        </button>
                      </div>

                      <div className="mt-3 text-center">
                        <p className="mb-0">
                          By registering you agree to the ElawFirm{" "}
                          <Link to="#" className="text-primary">
                            Terms of Use
                          </Link>
                        </p>
                      </div>
                    </Form>
                    {/* <Loader/> */}
                  </div>
                </CardBody>
              </Card>
              <div className="mt-2 text-center">
                <p>
                  Already have an account ?{" "}
                  <Link to="/login" className="font-weight-medium text-primary">
                    {" "}
                    Login
                  </Link>{" "}
                </p>
                {/* <p>
                  © {new Date().getFullYear()} Skote. Crafted with{" "}
                  <i className="mdi mdi-heart text-danger" /> by Themesbrand
                </p> */}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Register;
