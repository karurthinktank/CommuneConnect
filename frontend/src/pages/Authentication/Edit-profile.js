import withRouter from "components/Common/withRouter";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../../components/Common/Breadcrumb";

//import formik validation
import { useFormik } from "formik";
import * as Yup from "yup";

import { ToastContainer } from 'react-toastify';
import CustomToast from "components/Common/Toast";
import 'react-toastify/dist/ReactToastify.css';


//import css
// import "../../assets/scss/_userprofile.scss"
import "../../assets/scss/_editprofile.scss"

import { CardBody, Card, Alert, Input, Label, Form, FormFeedback } from "reactstrap";

import { useNavigate } from "react-router-dom";
import { GET, PUT, UPLOAD } from "../../helpers/api_helper";
import { USER_PROFILE_URL, USER_PROFILE, PINCODE_LIST_URL, STATE_URL, STATE_LIST_URL, DISTRICT_LIST_URL, USER_COMPANY_LOGO } from "../../helpers/url_helper";
import { mobileRegExp, phoneRegExp, urlRegExp } from "constants/constants";
import axios from "axios";
import { getToken } from "helpers/jwt-token-access/accessToken";

const token = getToken();


function Editprofile(props) {
    const [user, setData] = useState({});
    const [pincodeList, setPincode] = useState([]);
    const [stateList, setState] = useState([]);
    const [districtList, setDistrict] = useState([]);
    const [logo, setLogo] = useState();
    const navigate = useNavigate();
    var error = false;
    useEffect(() => {
        fetchData();
    }, [])

    async function fetchData() {
        const response = await GET(USER_PROFILE_URL);
        console.log(response);
        if (response.status === 200) {
            setData(response.data);
            if (response.data.profile.state) {
                let url = STATE_URL.replace(":state", response.data.profile.state)
                fetchMasterData("state", url);
            }
            else
                fetchMasterData("initial");
        }
        else {
            console.log(response)
            CustomToast(response, "error");
        }

    }

    async function fetchMasterData(type, url = STATE_LIST_URL) {
        const response = await GET(url);
        console.log(response);
        if (response.status === 200) {
            if (type === "initial")
                setState(response.data.data);
            else if (type === "state") {
                setState(response.data.state);
                setDistrict(response.data.district);
                setPincode(response.data.pincode);
            }
            else if (type === "district")
                setDistrict(response.data.data);
            else if (type === "pincode")
                setPincode(response.data.data);
            // error = false;
        }
        else {
            console.log(response)
            CustomToast(response, "error");
        }
    }

    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            mobile_number: user.profile?.mobile_number,
            firm_name: user.profile?.firm_name,
            educational_details: user.profile?.educational_details,
            enrollment_number: user.profile?.enrollment_number,
            bar_council_name: user.profile?.bar_council_name,
            firm_logo: "",
            flat_no: user.profile?.flat_no,
            street: user.profile?.street,
            state: user.profile?.state,
            district: user.profile?.district,
            pincode: user.profile?.pincode,
            landmark: user.profile?.landmark,
            secondary_mobile_number: user.profile?.secondary_mobile_number,
            phone_number: user.profile?.phone_number,
            secondary_phone_number: user.profile?.secondary_phone_number,
            fax: user.profile?.fax,
            website_url: user.profile?.website_url,
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email format').required("This field is required!"),
            first_name: Yup.string().required("This field is required!"),
            last_name: Yup.string().required("This field is required!"),
            mobile_number: Yup.string().required("This field is required!").matches(mobileRegExp, 'Invalid Mobile number!'),
            educational_details: Yup.string().required("This field is required!"),
            enrollment_number: Yup.string().required("This field is required!"),
            bar_council_name: Yup.string().required("This field is required!"),
            flat_no: Yup.string().required("This field is required!"),
            street: Yup.string().required("This field is required!"),
            pincode: Yup.string().required("This field is required!"),
            state: Yup.string().required("This field is required!"),
            district: Yup.string().required("This field is required!"),
            secondary_mobile_number: Yup.string().matches(mobileRegExp, 'Invalid Mobile number!'),
            phone_number: Yup.string().matches(phoneRegExp, 'Invalid Phone number!'),
            secondary_phone_number: Yup.string().matches(phoneRegExp, 'Invalid Phone number!'),
            fax: Yup.string().matches(phoneRegExp, 'Invalid Fax number!'),
            website_url: Yup.string().matches(urlRegExp, 'Invalid URL!'),
        }),
        onSubmit: async (values) => {
            let obj =  JSON.parse(localStorage.getItem('auth_user'));
            let url = `${USER_PROFILE}${obj.code}/`;
            console.log(logo);
            values['logo'] = logo;
            console.log(values);
            var result = await PUT(url, values);
            if (result.status === 200) {
                // toast msg
                CustomToast("Profile Updated Successfully!", "success");
                navigate('/profile');
                uploadFile();

            }
            else {
                console.log(result)
                error = result;
                CustomToast(error, "error");
            }
        }
    });

    function uploadFile(){
        const formData = new FormData();
        console.log(logo);
        formData.append("file", logo);
        let response = UPLOAD(USER_COMPANY_LOGO, formData);
    }

    const handleCancle = () => {
        navigate('/profile');
    }

    const handleChange = (event) => {
        let field = event.target.name;
        let value = event.target.value;
        if (field === "state") {
            validation.setFieldValue("state", value);
            let url = DISTRICT_LIST_URL.replace(":state", value)
            fetchMasterData("district", url);
        }
        if (field === "district") {
            validation.setFieldValue("district", value);
            let url = PINCODE_LIST_URL.replace(":district", value)
            fetchMasterData("pincode", url);
        }
        if (field === "firm_logo") {
            setLogo(event.target.files[0]);
            validation.setFieldValue("firm_logo", value);
        }
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <Breadcrumb title="Elawfirm" breadcrumbItem="Edit Profile" />
                    {error && error ? <Alert color="danger">{error}</Alert> : null}
                    <div className="row">
                        <div className="col-md-12">
                            <Card className="usercard">
                                {/* <CardHeader>
                                    <h5>Edit Profile</h5>
                                </CardHeader> */}
                                <CardBody>
                                    <Form
                                        className="form-horizontal"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            validation.handleSubmit();
                                            return false;
                                        }}
                                    >
                                        {/* {error && error ? (
                                    <Alert color="danger">{error}</Alert>
                                ) : null} */}
                                        <div className="row">
                                            <div className="col-md-5">
                                                <div className="mb-3">
                                                    <Label className="form-label">First Name<span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="first_name"
                                                        name="first_name"
                                                        className="form-control"
                                                        placeholder="Enter firstname"
                                                        type="text"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.first_name}
                                                        invalid={validation.touched.first_name && validation.errors.first_name ? true : false}
                                                    />
                                                    {validation.touched.first_name && validation.errors.first_name ? (
                                                        <FormFeedback type="invalid">{validation.errors.first_name}
                                                        </FormFeedback>
                                                    ) : null}
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
                                                        invalid={validation.touched.last_name && validation.errors.last_name ? true : false}
                                                    />
                                                    {validation.touched.last_name && validation.errors.last_name ? (
                                                        <FormFeedback type="invalid">{validation.errors.last_name}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>
                                                <div className="mb-3">
                                                    <Label className="form-label">Email<span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        className="form-control"
                                                        placeholder="Enter email"
                                                        type="email"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.email || ""}
                                                        invalid={validation.touched.email && validation.errors.email ? true : false}
                                                    />
                                                    {validation.touched.email && validation.errors.email ? (
                                                        <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                                                    ) : null}
                                                </div>
                                                <div className="mb-3">
                                                    <Label className="form-label">Mobile Number<span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="mobile_number"
                                                        name="mobile_number"
                                                        className="form-control"
                                                        placeholder="Enter mobile number"
                                                        type="text"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.mobile_number || ""}
                                                        invalid={validation.touched.mobile_number && validation.errors.mobile_number ? true : false}
                                                    />
                                                    {validation.touched.mobile_number && validation.errors.mobile_number ? (
                                                        <FormFeedback type="invalid">{validation.errors.mobile_number}</FormFeedback>
                                                    ) : null}
                                                </div>
                                                <div className="mb-3">
                                                    <Label className="form-label">Education<span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="educational_details"
                                                        name="educational_details"
                                                        className="form-control"
                                                        placeholder="Enter education details"
                                                        type="text"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.educational_details || ""}
                                                        invalid={validation.touched.educational_details && validation.errors.educational_details ? true : false}
                                                    />
                                                    {validation.touched.educational_details && validation.errors.educational_details ? (
                                                        <FormFeedback type="invalid">{validation.errors.educational_details}</FormFeedback>
                                                    ) : null}
                                                </div>
                                                <div className="mb-3">
                                                    <Label className="form-label">BarCounsil Name<span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="bar_council_name"
                                                        name="bar_council_name"
                                                        className="form-control"
                                                        placeholder="Enter barcouncil name"
                                                        type="text"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.bar_council_name || ""}
                                                        invalid={validation.touched.bar_council_name && validation.errors.bar_council_name ? true : false}
                                                    />
                                                    {validation.touched.bar_council_name && validation.errors.bar_council_name ? (
                                                        <FormFeedback type="invalid">{validation.errors.bar_council_name}</FormFeedback>
                                                    ) : null}
                                                </div>
                                                <div className="mb-3">
                                                    <Label className="form-label">BarCounsil Enrollment Number<span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="enrollment_number"
                                                        name="enrollment_number"
                                                        className="form-control"
                                                        placeholder="Enter enrollment number"
                                                        type="text"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.enrollment_number || ""}
                                                        invalid={validation.touched.enrollment_number && validation.errors.enrollment_number ? true : false}
                                                    />
                                                    {validation.touched.enrollment_number && validation.errors.enrollment_number ? (
                                                        <FormFeedback type="invalid">{validation.errors.enrollment_number}</FormFeedback>
                                                    ) : null}
                                                </div>
                                                <div className="mb-3">
                                                    <Label className="form-label">Firm Name</Label>
                                                    <Input
                                                        id="firm_name"
                                                        name="firm_name"
                                                        className="form-control"
                                                        placeholder="Enter firm name"
                                                        type="text"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.firm_name || ""}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <Label className="form-label">Firm Logo</Label>
                                                    <Input
                                                        id="firm_logo"
                                                        name="firm_logo"
                                                        className="form-control"
                                                        placeholder="Enter firm logo"
                                                        type="file"
                                                        onChange={handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.firm_logo || ""}

                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <Label className="form-label">Website Url</Label>
                                                    <Input
                                                        id="website_url"
                                                        name="website_url"
                                                        className="form-control"
                                                        placeholder="Enter website url"
                                                        type="textarea"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.website_url || ""}
                                                        invalid={validation.touched.website_url && validation.errors.website_url ? true : false}
                                                    />
                                                    {validation.errors.website_url ? (
                                                        <FormFeedback type="invalid">{validation.errors.website_url}</FormFeedback>
                                                    ) : null}
                                                </div>

                                            </div>
                                            <div className="col-md-2">

                                            </div>
                                            <div className="col-md-5">
                                                <div className="mb-3">
                                                    <Label className="form-label">Flat No<span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="flat_no"
                                                        name="flat_no"
                                                        className="form-control"
                                                        placeholder="Enter flat number"
                                                        type="text"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.flat_no || ""}
                                                        invalid={validation.touched.flat_no && validation.errors.flat_no ? true : false}
                                                    />
                                                    {validation.touched.flat_no && validation.errors.flat_no ? (
                                                        <FormFeedback type="invalid">{validation.errors.flat_no}</FormFeedback>
                                                    ) : null}
                                                </div>
                                                <div className="mb-3">
                                                    <Label className="form-label">Street Address<span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="street"
                                                        name="street"
                                                        className="form-control"
                                                        placeholder="Enter address"
                                                        type="textarea"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.street || ""}
                                                        invalid={validation.touched.street && validation.errors.street ? true : false}
                                                    />
                                                    {validation.touched.street && validation.errors.street ? (
                                                        <FormFeedback type="invalid">{validation.errors.street}</FormFeedback>
                                                    ) : null}
                                                </div>
                                                <div className="mb-3">
                                                    <Label className="form-label">Landmark</Label>
                                                    <Input
                                                        id="landmark"
                                                        name="landmark"
                                                        className="form-control"
                                                        placeholder="Enter address"
                                                        type="text"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.landmark || ""}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <Label className="form-label">State<span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="state"
                                                        name="state"
                                                        className="form-control"
                                                        placeholder="Select state"
                                                        type="select"
                                                        onChange={handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.state || ""}
                                                        invalid={validation.touched.state && validation.errors.state ? true : false}
                                                    >
                                                        <option value="" disabled selected>Select State</option>
                                                        {stateList.map((code) => (<option key={code} value={code}>{code}</option>))}
                                                    </Input>
                                                    {validation.touched.state && validation.errors.state ? (
                                                        <FormFeedback type="invalid">{validation.errors.state}</FormFeedback>
                                                    ) : null}
                                                </div>
                                                <div className="mb-3">
                                                    <Label className="form-label">District<span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="district"
                                                        name="district"
                                                        className="form-control"
                                                        placeholder="Select district"
                                                        type="select"
                                                        onChange={handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.district || ""}
                                                        invalid={validation.touched.district && validation.errors.district ? true : false}
                                                    >
                                                        <option value="" disabled selected>Select District</option>
                                                        {districtList.map((code) => (<option key={code} value={code}>{code}</option>))}
                                                    </Input>
                                                    {validation.touched.district && validation.errors.district ? (
                                                        <FormFeedback type="invalid">{validation.errors.district}</FormFeedback>
                                                    ) : null}
                                                </div>
                                                <div className="mb-3">
                                                    <Label className="form-label">Pincode<span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="pincode"
                                                        name="pincode"
                                                        className="form-control"
                                                        placeholder="Select pincode"
                                                        type="select"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.pincode || ""}
                                                        invalid={validation.touched.pincode && validation.errors.pincode ? true : false}
                                                    >
                                                        <option value="" disabled selected>Select Pincode</option>
                                                        {pincodeList.map((code) => (<option key={code} value={code}>{code}</option>))}
                                                    </Input>
                                                    {validation.touched.pincode && validation.errors.pincode ? (
                                                        <FormFeedback type="invalid">{validation.errors.pincode}</FormFeedback>
                                                    ) : null}
                                                </div>
                                                <div className="mb-3">
                                                    <Label className="form-label">Additional Mobile Number</Label>
                                                    <Input
                                                        id="secondary_mobile_number"
                                                        name="secondary_mobile_number"
                                                        className="form-control"
                                                        placeholder="Enter mobile number"
                                                        type="text"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.secondary_mobile_number || ""}
                                                        invalid={validation.errors.secondary_mobile_number ? true : false}
                                                    />
                                                    {validation.errors.secondary_mobile_number ? (
                                                        <FormFeedback type="invalid">{validation.errors.secondary_mobile_number}</FormFeedback>
                                                    ) : null}
                                                </div>
                                                <div className="mb-3">
                                                    <Label className="form-label">Phone Number</Label>
                                                    <Input
                                                        id="phone_number"
                                                        name="phone_number"
                                                        className="form-control"
                                                        placeholder="Enter phone number"
                                                        type="text"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.phone_number || ""}
                                                        invalid={validation.errors.phone_number ? true : false}
                                                    />
                                                    {validation.errors.phone_number ? (
                                                        <FormFeedback type="invalid">{validation.errors.phone_number}</FormFeedback>
                                                    ) : null}
                                                </div>
                                                <div className="mb-3">
                                                    <Label className="form-label">Additional Phone Number</Label>
                                                    <Input
                                                        id="secondary_phone_number"
                                                        name="secondary_phone_number"
                                                        className="form-control"
                                                        placeholder="Enter phone number"
                                                        type="text"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.secondary_phone_number || ""}
                                                        invalid={validation.errors.secondary_phone_number ? true : false}
                                                    />
                                                    {validation.errors.secondary_phone_number ? (
                                                        <FormFeedback type="invalid">{validation.errors.secondary_phone_number}</FormFeedback>
                                                    ) : null}
                                                </div>
                                                <div className="mb-3">
                                                    <Label className="form-label">Fax Number</Label>
                                                    <Input
                                                        id="fax"
                                                        name="fax"
                                                        className="form-control"
                                                        placeholder="Enter fax number"
                                                        type="text"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.fax || ""}
                                                        invalid={validation.errors.fax ? true : false}
                                                    />
                                                    {validation.errors.fax ? (
                                                        <FormFeedback type="invalid">{validation.errors.fax}</FormFeedback>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 text-center">
                                            <button type="button" className="btn btn-secondary me-2" onClick={handleCancle}>Cancel</button>
                                            
                                            <button className="btn btn-primary btn-block " type="submit">
                                                Save Changes
                                            </button>
                                        </div>
                                    </Form>

                                </CardBody>
                            </Card>
                        </div>

                    </div>
                </div>

            </div>
            <ToastContainer />
        </React.Fragment>
    )

};
export default withRouter(Editprofile);