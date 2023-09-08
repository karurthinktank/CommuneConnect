import { React, useState, useEffect } from "react";
import { useParams } from 'react-router';
import Breadcrumb from "components/Common/Breadcrumb";
import {
    Card, CardBody, CardFooter, CardHeader, Input, Label, Form,
    FormFeedback, FormGroup
} from 'reactstrap';
import { useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import CustomToast from "components/Common/Toast";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";
import { mobileRegExp } from "constants/constants";
import { CASES_URL, COURT_MASTER_DATA_URL } from "helpers/url_helper";
import { POST, GET } from "helpers/api_helper";

function EditCase() {

    const [checked, setchecked] = useState("");
    const {id} = useParams();
    const [data, setData] = useState({});
    const [actList, setAct] = useState([]);
    const [stateList, setState] = useState([]);
    const [districtList, setDistrict] = useState([]);
    const [courtList, setCourt] = useState([]);
    const [courtComplexList, setCourtComplex] = useState([]);
    const [caseTypeList, setCaseType] = useState([]);
    const navigate = useNavigate();
    const t = "checked"
    const n = ""

    const casetypevalue = (event) => {
        setchecked(event.target.value);
        validation.setFieldValue("case_for", event.target.value);
    }

    useEffect(() => {
        fetchCase();
        fetchCourtMasterData();
    }, [])

    async function fetchCase() {
        let url = CASES_URL + id;
        const response = await GET(url);
        if (response.status === 200) {
            console.log(response)
            setData(response.data.data);
            setchecked(response.data.data.case_for);
        }
        else {
            CustomToast(response.data.message, "error");
        }
    }

    async function fetchCourtMasterData(url = COURT_MASTER_DATA_URL) {
        const response = await GET(url);
        console.log(response);
        if (response.status === 200) {

            setAct(response.data.case_act);
            setCourt(response.data.court);
            setDistrict(response.data.district);
            setState(response.data.state);
            setCourtComplex(response.data.court_complex);
            setCaseType(response.data.case_type);
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
            case_filed_section: data.case_filed_section,
            case_filed_act: data.case_filed_act,
            against_advocate_name: data.against_advocate_name,
            against_name_list: data.against_name_list,
            against_name: data.against_name,
            for_name_list: data.for_name_list,
            for_contact_number2: data.for_contact_number2,
            for_contact_number: data.for_contact_number,
            for_email: data.for_email,
            for_address: data.for_address,
            for_name: data.for_name,
            registration_date: data.registration_date,
            filing_date: data.filing_date,
            filing_number: data.filing_number,
            registration_year: data.registration_year,
            registration_number: data.registration_number,
            state: data.state,
            district: data.district,
            court_complex: data.court_complex,
            court_name: data.court_name,
            case_for: data.case_for,
            cnr_number: data.cnr_number,
            type: data.type
        },
        
        validationSchema: Yup.object({
            for_email: Yup.string().email('Invalid email format').required('Email is Required'),
            case_filed_section: Yup.string().required("This field is required!"),
            case_filed_act: Yup.string().required("This field is required!"),
            against_advocate_name: Yup.string().required("This field is required!"),
            against_name: Yup.string().required("This field is required!"),
            for_contact_number2: Yup.string().matches(mobileRegExp, 'Invalid Mobile number!'),
            for_contact_number: Yup.string().required("This field is required!").matches(mobileRegExp, 'Invalid Mobile number!'),
            for_address: Yup.string().required("This field is required!"),
            for_name: Yup.string().required("This field is required!"),
            registration_year: Yup.string().required("This field is required!"),
            registration_number: Yup.string().required("This field is required!"),
            state: Yup.string().required("This field is required!"),
            district: Yup.string().required("This field is required!"),
            court_complex: Yup.string().required("This field is required!"),
            court_name: Yup.string().required("This field is required!"),
            case_for: Yup.string().required("This field is required!"),
            cnr_number: Yup.string().required("This field is required!"),
            type: Yup.string().required("This field is required!"),
        }),
        onSubmit: async (values) => {
            var res = await POST(CASES_URL, values);
            console.log(res);
            if (res.status === 200 || res.status === 201) {
                CustomToast(res.data.message, "success");
                navigate('/cases-list');
            }
            else {
                CustomToast(res.data.message, "error");
            }
        },
    });


    const handleCancle = () => {
        navigate('/cases-list');
    }


    return (
        <div className="page-content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <Breadcrumb title="Home" breadcrumbItem="Edit Case" />
                        <Card className="usercard">
                            <CardHeader>

                            </CardHeader>
                            <CardBody>
                                <Form
                                    className="form-horizontal"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        validation.isValid ? validation.handleSubmit() : CustomToast("Please fill all the required fields.", "error");;
                                        return false;
                                    }}
                                >
                                    <div className="row">
                                        <div className="d-flex gap-2 mb-3">
                                            <FormGroup check>
                                                <Label check>
                                                <Input type="radio" name="case_for"
                                                    value="Petitioner"
                                                    onChange={casetypevalue}
                                                    checked={checked}
                                                 />{' '}
                                                Petitioner
                                                </Label>
                                            </FormGroup>
                                            <FormGroup check>
                                                <Label check>
                                                <Input type="radio" name="case_for"
                                                    onChange={casetypevalue}
                                                    value="Respondent"
                                                    checked={checked}
                                                 />{' '}
                                                    Respondent
                                                </Label>
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <Label>{checked} Name <span className="text-danger">*</span> </Label>
                                                <Input
                                                    id="for_name"
                                                    name="for_name"
                                                    className="form-control"
                                                    placeholder="Enter Name"
                                                    type="text"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.for_name}
                                                    invalid={validation.touched.for_name && validation.errors.for_name ? true : false}
                                                />
                                                {validation.touched.for_name && validation.errors.for_name ? (
                                                    <FormFeedback type="invalid">{validation.errors.for_name}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>
                                            <div className="mb-3">
                                                <Label>{checked} Address <span className="text-danger">*</span> </Label>
                                                <Input
                                                    id="for_address"
                                                    name="for_address"
                                                    className="form-control"
                                                    placeholder="Enter Address"
                                                    type="textarea"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.for_address}
                                                    invalid={validation.touched.for_address && validation.errors.for_address ? true : false}
                                                />
                                                {validation.touched.for_address && validation.errors.for_address ? (
                                                    <FormFeedback type="invalid">{validation.errors.for_address}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>
                                            <div className="mb-3">
                                                <Label>{checked} Email-ID <span className="text-danger">*</span> </Label>
                                                <Input
                                                    id="for_email"
                                                    name="for_email"
                                                    className="form-control"
                                                    placeholder="Enter Email"
                                                    type="email"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.for_email}
                                                    invalid={validation.touched.for_email && validation.errors.for_email ? true : false}
                                                />
                                                {validation.touched.for_email && validation.errors.for_email ? (
                                                    <FormFeedback type="invalid">{validation.errors.for_email}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>
                                            <div className="mb-3">
                                                <Label>CNR Number <span className="text-danger">*</span> </Label>
                                                <Input
                                                    id="cnr_number"
                                                    name="cnr_number"
                                                    className="form-control"
                                                    placeholder="Enter CNR Number"
                                                    type="text"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.cnr_number}
                                                    invalid={validation.touched.cnr_number && validation.errors.cnr_number ? true : false}
                                                />
                                                {validation.touched.cnr_number && validation.errors.cnr_number ? (
                                                    <FormFeedback type="invalid">{validation.errors.cnr_number}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>
                                            <div className="mb-3">
                                                <Label>{checked} Contact Number <span className="text-danger">*</span> </Label>
                                                <Input
                                                    id="for_contact_number"
                                                    name="for_contact_number"
                                                    className="form-control"
                                                    placeholder="Enter Primary Contact Number1"
                                                    type="text"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.for_contact_number}
                                                    invalid={validation.touched.for_contact_number && validation.errors.for_contact_number ? true : false}
                                                />
                                                {validation.touched.for_contact_number && validation.errors.for_contact_number ? (
                                                    <FormFeedback type="invalid">{validation.errors.for_contact_number}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>
                                            <div className="mb-3">
                                                <Label>{checked} Contact Number2</Label>
                                                <Input
                                                    id="for_contact_number2"
                                                    name="for_contact_number2"
                                                    className="form-control"
                                                    placeholder="Enter Secondary Contact Number"
                                                    type="text"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.for_contact_number2}
                                                    invalid={validation.touched.for_contact_number2 && validation.errors.for_contact_number2 ? true : false}
                                                />
                                                {validation.touched.for_contact_number2 && validation.errors.for_contact_number2 ? (
                                                    <FormFeedback type="invalid">{validation.errors.for_contact_number2}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>
                                            {checked === "Petitioner" && (
                                                <>
                                                    <div className="mb-3">
                                                        <Label>Case Filling Number <span className="text-danger">*</span> </Label>
                                                        <Input
                                                            id="filing_number"
                                                            name="filing_number"
                                                            className="form-control"
                                                            placeholder="Enter Filig Number"
                                                            type="text"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.filing_number}
                                                            invalid={validation.touched.filing_number && validation.errors.filing_number ? true : false}
                                                        />
                                                        {validation.touched.filing_number && validation.errors.filing_number ? (
                                                            <FormFeedback type="invalid">{validation.errors.filing_number}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3">
                                                        <Label> Filing Date</Label>
                                                        <Input type="date" 
                                                            name="filing_date" 
                                                            id="filing_date"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.filing_date}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                            <div className="mb-3">
                                                <Label>For List</Label>
                                                <Input
                                                    id="for_name_list"
                                                    name="for_name_list"
                                                    className="form-control"
                                                    placeholder="Enter User List"
                                                    type="textarea"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.for_name_list}
                                                    invalid={validation.touched.for_name_list && validation.errors.for_name_list ? true : false}
                                                />
                                                {validation.touched.for_name_list && validation.errors.for_name_list ? (
                                                    <FormFeedback type="invalid">{validation.errors.for_name_list}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>
                                            <div className="mb-3">
                                                <Label>Against Name <span className="text-danger">*</span> </Label>
                                                <Input
                                                    id="against_name"
                                                    name="against_name"
                                                    className="form-control"
                                                    placeholder="Enter Against Name"
                                                    type="text"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.against_name}
                                                    invalid={validation.touched.against_name && validation.errors.against_name ? true : false}
                                                />
                                                {validation.touched.against_name && validation.errors.against_name ? (
                                                    <FormFeedback type="invalid">{validation.errors.against_name}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>
                                            <div className="mb-3">
                                                <Label>Against List</Label>
                                                <Input
                                                    id="against_name_list"
                                                    name="against_name_list"
                                                    className="form-control"
                                                    placeholder="Enter Against List"
                                                    type="textarea"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.against_name_list}
                                                    invalid={validation.touched.against_name_list && validation.errors.against_name_list ? true : false}
                                                />
                                                {validation.touched.against_name_list && validation.errors.against_name_list ? (
                                                    <FormFeedback type="invalid">{validation.errors.against_name_list}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>

                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <Label className="form-label">Court Name<span className="text-danger">*</span></Label>
                                                <Input
                                                    id="court_name"
                                                    name="court_name"
                                                    className="form-control"
                                                    placeholder="Select Court Name"
                                                    type="select"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.court_name || ''}
                                                    invalid={validation.touched.court_name && validation.errors.court_name ? true : false}
                                                >
                                                    <option value="" disabled >Select Court Name</option>
                                                    {courtList.map((code) => (<option key={code} value={code}>{code}</option>))}
                                                </Input>
                                                {validation.touched.court_name && validation.errors.court_name ? (
                                                    <FormFeedback type="invalid">{validation.errors.court_name}</FormFeedback>
                                                ) : null}
                                            </div>
                                            <div className="mb-3">
                                                <Label className="form-label">Court Complex<span className="text-danger">*</span></Label>
                                                <Input
                                                    id="court_complex"
                                                    name="court_complex"
                                                    className="form-control"
                                                    placeholder="Select Court Complex"
                                                    type="select"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.court_complex || ''}
                                                    invalid={validation.touched.court_complex && validation.errors.court_complex ? true : false}
                                                >
                                                    <option value="" disabled >Select Court Complex</option>
                                                    {courtComplexList.map((code) => (<option key={code} value={code}>{code}</option>))}
                                                </Input>
                                                {validation.touched.court_complex && validation.errors.court_complex ? (
                                                    <FormFeedback type="invalid">{validation.errors.court_complex}</FormFeedback>
                                                ) : null}
                                            </div>
                                            <div className="mb-3">
                                                <Label className="form-label">District<span className="text-danger">*</span></Label>
                                                <Input
                                                    id="district"
                                                    name="district"
                                                    className="form-control"
                                                    placeholder="Select Court Name"
                                                    type="select"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.district || ''}
                                                    invalid={validation.touched.district && validation.errors.district ? true : false}
                                                >
                                                    <option value="" disabled >Select District</option>
                                                    {districtList.map((element) => (<option key={element.key} value={element.value}>{element.key}</option>))}
                                                </Input>
                                                {validation.touched.district && validation.errors.district ? (
                                                    <FormFeedback type="invalid">{validation.errors.district}</FormFeedback>
                                                ) : null}
                                            </div>
                                            <div className="mb-3">
                                                <Label className="form-label">State<span className="text-danger">*</span></Label>
                                                <Input
                                                    id="state"
                                                    name="state"
                                                    className="form-control"
                                                    placeholder="Select State"
                                                    type="select"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.state || ''}
                                                    invalid={validation.touched.state && validation.errors.state ? true : false}
                                                >
                                                    <option value="" disabled >Select State</option>
                                                    {stateList.map((element) => (<option key={element.key} value={element.value}>{element.key}</option>))}
                                                </Input>
                                                {validation.touched.state && validation.errors.state ? (
                                                    <FormFeedback type="invalid">{validation.errors.state}</FormFeedback>
                                                ) : null}
                                            </div>
                                            <div className="mb-3">
                                                <Label>Case Type <span className="text-danger">*</span> </Label>
                                                <Input
                                                    id="type"
                                                    name="type"
                                                    className="form-control"
                                                    placeholder="Enter Case Type"
                                                    type="select"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.type || ''}
                                                    invalid={validation.touched.type && validation.errors.type ? true : false}
                                                >
                                                <option value="" disabled >Select Case Type</option>
                                                {caseTypeList.map((code) => (<option key={code} value={code}>{code}</option>))}
                                                </Input>
                                                {validation.touched.type && validation.errors.type ? (
                                                    <FormFeedback type="invalid">{validation.errors.type}
                                                    </FormFeedback>
                                                ) : null}
                                            </div>
                                            <div className="mb-3">
                                                <Label className="form-label">Case Reg Number<span className="text-danger">*</span></Label>
                                                <Input
                                                    id="registration_number"
                                                    name="registration_number"
                                                    className="form-control"
                                                    placeholder="Enter Case registration number"
                                                    type="text"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.registration_number}
                                                    invalid={validation.touched.registration_number && validation.errors.registration_number ? true : false}
                                                />
                                                {validation.touched.registration_number && validation.errors.registration_number ? (
                                                    <FormFeedback type="invalid">{validation.errors.registration_number}</FormFeedback>
                                                ) : null}
                                            </div>
                                            <div className="mb-3">
                                                <Label className="form-label">Case Reg Year<span className="text-danger">*</span></Label>
                                                <Input
                                                    id="registration_year"
                                                    name="registration_year"
                                                    className="form-control"
                                                    placeholder="Enter Case Registartion year"
                                                    type="text"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.registration_year}
                                                    invalid={validation.touched.registration_year && validation.errors.registration_year ? true : false}
                                                />
                                                {validation.touched.registration_year && validation.errors.registration_year ? (
                                                    <FormFeedback type="invalid">{validation.errors.registration_year}</FormFeedback>
                                                ) : null}
                                            </div>
                                            <div className="mb-3">
                                                <FormGroup>
                                                <Label className="form-label">Case Reg Date</Label>
                                                <Input type="date" 
                                                name="registration_date" 
                                                id="registration_date"
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.registration_date}
                                                >
                                                </Input>
                                                </FormGroup>
                                            </div>
                                            {/* <div className="mb-3">
                                                <Label className="form-label">Case Reg Date</Label>
                                                <DatePicker
                                                    closeOnScroll={(e) => e.target === document}
                                                    selected={startDate}
                                                    value={validation.values.registration_date}
                                                    onChange={(date) => setStartDate(date)}
                                                />
                                                {validation.touched.registration_date && validation.errors.registration_date ? (
                                                    <FormFeedback type="invalid">{validation.errors.registration_date}</FormFeedback>
                                                ) : null}
                                            </div> */}
                                            <div className="mb-3">
                                                <Label>Against Advocate Name <span className="text-danger">*</span></Label>
                                                <Input
                                                    id="against_advocate_name"
                                                    name="against_advocate_name"
                                                    className="form-control"
                                                    placeholder="Enter Against Advocate Name"
                                                    type="text"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.against_advocate_name}
                                                    invalid={validation.touched.against_advocate_name && validation.errors.against_advocate_name ? true : false}
                                                />
                                                {validation.touched.against_advocate_name && validation.errors.against_advocate_name ? (
                                                    <FormFeedback type="invalid">{validation.errors.against_advocate_name}</FormFeedback>
                                                ) : null}
                                            </div>
                                            <div className="mb-3">
                                                <Label className="form-label">Case Filed Act<span className="text-danger">*</span></Label>
                                                <Input
                                                    id="case_filed_act"
                                                    name="case_filed_act"
                                                    className="form-control"
                                                    placeholder="Select Act"
                                                    type="select"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.case_filed_act || ''}
                                                    invalid={validation.touched.case_filed_act && validation.errors.case_filed_act ? true : false}
                                                >
                                                <option value="" disabled >Select ACT</option>
                                                {actList.map((code) => (<option key={code} value={code}>{code}</option>))}
                                                </Input>
                                                {validation.touched.case_filed_act && validation.errors.case_filed_act ? (
                                                    <FormFeedback type="invalid">{validation.errors.case_filed_act}</FormFeedback>
                                                ) : null}
                                            </div>
                                            <div className="mb-3">
                                                <Label>Case Filed Section <span className="text-danger">*</span> </Label>
                                                <Input
                                                    id="case_filed_section"
                                                    name="case_filed_section"
                                                    className="form-control"
                                                    placeholder="Enter Case filed section"
                                                    type="text"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.case_filed_section}
                                                    invalid={validation.touched.case_filed_section && validation.errors.case_filed_section ? true : false}
                                                />
                                                {validation.touched.case_filed_section && validation.errors.case_filed_section ? (
                                                    <FormFeedback type="invalid">{validation.errors.case_filed_section}</FormFeedback>
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
                        <ToastContainer/>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default EditCase;