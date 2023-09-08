import { React, useState, useEffect } from "react";
import Breadcrumb from "components/Common/Breadcrumb";
import {
    Card, CardBody, CardFooter, CardHeader, Input, Label, Form,
    FormFeedback, FormGroup,Button
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
import { eventChannel } from "redux-saga";

function AddUser() {

    const [rows1, setrows1] = useState([{ id: 1 }]);
    function handleAddRowNested() {
        const modifiedRows = [...rows1];
        modifiedRows.push({ id: modifiedRows.length + 1 });
        setrows1(modifiedRows);
      }
    
      function handleRemoveRow(id) {
        if (id !== 1) {
          var modifiedRows = [...rows1];
          modifiedRows = modifiedRows.filter(x => x["id"] !== id);
          setrows1(modifiedRows);
        }
      }
    const [address, setAddress] = useState("same_address");
    const [actList, setAct] = useState([]);
    const [stateList, setState] = useState([]);
    const [districtList, setDistrict] = useState([]);
    const [courtList, setCourt] = useState([]);
    const [caseTypeList, setCaseType] = useState([]);
    const navigate = useNavigate();

    // const casetypevalue = (event) => {
    //     setchecked(event.target.value);
    //     validation.setFieldValue("case_for", event.target.value);
    // }
    const addressvalue = (event) => {
        setAddress(event.target.value);
    }
    console.log(address);
    // useEffect(() => {
    //     fetchCourtMasterData();
    // }, [])

    async function fetchCourtMasterData(url = COURT_MASTER_DATA_URL) {
        const response = await GET(url);
        console.log(response);
        if (response.status === 200) {

            setAct(response.data.case_act);
            setCourt(response.data.court);
            setDistrict(response.data.district);
            setState(response.data.state);

            setCaseType(response.data.case_type);
        }
        else {
            console.log(response)
            CustomToast(response, "error");
        }
    }

    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: false,
        initialValues: {

            district: '',
            family_head_name: '',
            member_of_foundations: '',
            member_reg_no: '',
            current_address: '',
            country: '',
            state: '',
            member_phone_no: '',
            membersname: '',
            gender: '',
            relationship: '',
            for_contact_number: '',
            user_Phone_no: '',

            registration_date: '',




        },

        validationSchema: Yup.object({
            member_of_foundations: Yup.string().required("This field is required!"),
            member_reg_no: Yup.number().required("This field is required!"),
            family_head_name: Yup.string().required("This field is required!"),
            current_address: Yup.string().required("This field is required!"),
            country: Yup.string().required("This field is required!"),
            state: Yup.string().required("This field is required!"),
            membersname: Yup.string().required("This field is required!"),
            district: Yup.string().required("This field is required!"),
            member_phone_no: Yup.string().matches(mobileRegExp, 'Invalid Mobile number!'),
            gender: Yup.string().required("This field is required!"),
            relationship: Yup.string().required("This field is required!"),
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
                        <Breadcrumb title="Home" breadcrumbItem="Add User" />
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

                                    <div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <Label className="form-label">மாவட்டம்<span className="text-danger">*</span></Label>
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
                                                    <Label>குடும்ப தலைவர் பெயர் <span className="text-danger">*</span> </Label>
                                                    <Input
                                                        id="family_head_name"
                                                        name="family_head_name"
                                                        className="form-control"
                                                        placeholder="குடும்பத் தலைவரின் பெயரை உள்ளிடவும்                                                                        "
                                                        type="text"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.family_head_name}
                                                        invalid={validation.touched.family_head_name && validation.errors.family_head_name ? true : false}
                                                    />
                                                    {validation.touched.family_head_name && validation.errors.family_head_name ? (
                                                        <FormFeedback type="invalid">{validation.errors.family_head_name}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>
                                                <div className="mb-3">
                                                    <Label className="form-label">அறக்கட்டளையின் உறுப்பினரா?<span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="member_of_foundations"
                                                        name="member_of_foundations"
                                                        className="form-control"

                                                        type="select"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.member_of_foundations || ''}
                                                        invalid={validation.touched.member_of_foundations && validation.errors.member_of_foundations ? true : false}
                                                    >
                                                        <option value="" disabled >அவர் இந்த அறக்கட்டளையின் உறுப்பினரா?</option>
                                                        {courtList.map((code) => (<option key={code} value={code}>{code}</option>))}
                                                    </Input>
                                                    {validation.touched.member_of_foundations && validation.errors.member_of_foundations ? (
                                                        <FormFeedback type="invalid">{validation.errors.member_of_foundations}</FormFeedback>
                                                    ) : null}
                                                </div>
                                                <div className="mb-3">
                                                    <Label>உறுப்பினர் பதிவு எண் <span className="text-danger">*</span> </Label>
                                                    <Input
                                                        id="member_reg_no"
                                                        name="member_reg_no"
                                                        className="form-control"
                                                        placeholder="உறுப்பினர் பதிவு எண்ணை உள்ளிடவும்"
                                                        type="text"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.member_reg_no}
                                                        invalid={validation.touched.member_reg_no && validation.errors.member_reg_no ? true : false}
                                                    />
                                                    {validation.touched.member_reg_no && validation.errors.member_reg_no ? (
                                                        <FormFeedback type="invalid">{validation.errors.member_reg_no}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>
                                                <div className="mb-3">
                                                    <Label> தற்போதைய முகவரி  <span className="text-danger">*</span> </Label>
                                                    <Input
                                                        id="current_address"
                                                        name="current_address"
                                                        className="form-control"
                                                        placeholder="தற்போதைய முகவரியை உள்ளிடவும்"
                                                        type="textarea"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.current_address}
                                                        invalid={validation.touched.current_address && validation.errors.current_address ? true : false}
                                                    />
                                                    {validation.touched.current_address && validation.errors.current_address ? (
                                                        <FormFeedback type="invalid">{validation.errors.current_address}
                                                        </FormFeedback>
                                                    ) : null}
                                                </div>
                                                <div className="mb-3">
                                                    <Label> தற்போதைய முகவரியும் நிரந்தர முகவரியும் ஒன்றா?</Label>
                                                    <div className="d-flex gap-2">
                                                        <Input
                                                            type="radio"
                                                            name="case_usertype"
                                                            value="same_address"
                                                            onChange={addressvalue}
                                                            defaultChecked
                                                        />
                                                        Yes
                                                        <Input
                                                            type="radio"
                                                            name="case_usertype"
                                                            value="diff_address"
                                                            onChange={addressvalue}

                                                        />
                                                        No
                                                    </div>

                                                </div>
                                                {(() => {
                                                    if (address === "same_address") {
                                                        return (
                                                            <>
                                                                <div className="mb-3">
                                                                    <Label> பூர்விக முகவரி</Label>
                                                                    <Input
                                                                        id="permanent_address"
                                                                        name="permanent_address"
                                                                        className="form-control"
                                                                        type="textarea"
                                                                        onChange={validation.handleChange}
                                                                        value={validation.values.current_address}

                                                                    />

                                                                </div>
                                                            </>
                                                        )
                                                    }
                                                    else {
                                                        return (
                                                            <>
                                                                <div className="mb-3">
                                                                    <Label> பூர்விக முகவரி</Label>
                                                                    <Input
                                                                        id="permanent_address"
                                                                        name="permanent_address"
                                                                        className="form-control"
                                                                        placeholder="பூர்விக முகவரியை உள்ளிடவும்"
                                                                        type="textarea"
                                                                        onChange={validation.handleChange}
                                                                        value={validation.values.for_address}

                                                                    />

                                                                </div>
                                                            </>
                                                        )
                                                    }
                                                }

                                                )()}

                                                <div className="mb-3">
                                                    <Label className="form-label">நாடு <span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="country"
                                                        name="country"
                                                        className="form-control"
                                                        placeholder="நாட்டினை தேர்வுசெய்"
                                                        type="select"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.country || ''}
                                                        invalid={validation.touched.country && validation.errors.country ? true : false}
                                                    >
                                                        <option value="" disabled >நாடு தேர்ந்தெடுக்கவும்</option>
                                                        {districtList.map((element) => (<option key={element.key} value={element.value}>{element.key}</option>))}
                                                    </Input>
                                                    {validation.touched.country && validation.errors.country ? (
                                                        <FormFeedback type="invalid">{validation.errors.country}</FormFeedback>
                                                    ) : null}
                                                </div>
                                                <div className="mb-3">
                                                    <Label className="form-label">மாநிலம் <span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="state"
                                                        name="state"
                                                        className="form-control"
                                                        placeholder="மாநிலத்தைத் தேர்ந்தெடுக்கவும்"
                                                        type="select"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.state || ''}
                                                        invalid={validation.touched.state && validation.errors.state ? true : false}
                                                    >
                                                        <option value="" disabled >Select District</option>
                                                        {districtList.map((element) => (<option key={element.key} value={element.value}>{element.key}</option>))}
                                                    </Input>
                                                    {validation.touched.state && validation.errors.state ? (
                                                        <FormFeedback type="invalid">{validation.errors.district}</FormFeedback>
                                                    ) : null}
                                                </div>
                                                <div className="mb-3">
                                                    <Label className="form-label">மாவட்டம்<span className="text-danger">*</span></Label>
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


                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <Label className="form-label">இரசீது புத்தக எண் </Label>
                                                    <Input
                                                        id="receipt_book_no"
                                                        name="receipt_book_no"
                                                        className="form-control"
                                                        type="select"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.court_name || ''}
                                                        invalid={validation.touched.court_name && validation.errors.court_name ? true : false}
                                                    >
                                                        <option value="" disabled >ரசீது புத்தக எண்ணைத் தேர்ந்தெடுக்கவும்</option>
                                                        {courtList.map((code) => (<option key={code} value={code}>{code}</option>))}
                                                    </Input>
                                                    {validation.touched.court_name && validation.errors.court_name ? (
                                                        <FormFeedback type="invalid">{validation.errors.court_name}</FormFeedback>
                                                    ) : null}
                                                </div>
                                                <div className="mb-3">
                                                    <Label className="form-label">இரசீது எண்</Label>
                                                    <Input
                                                        id="receipt_number"
                                                        name="receipt_number"
                                                        className="form-control"
                                                        placeholder="இரசீது எண்ணைத் தேர்ந்தெடுக்கவும்"
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
                                                    <FormGroup>
                                                        <Label className="form-label">இரசீது தேதி</Label>
                                                        <Input type="date"
                                                            name="receipt_date"
                                                            id="receipt_date"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.registration_date}
                                                        >
                                                        </Input>
                                                    </FormGroup>
                                                </div>

                                                <div className="mb-3">
                                                    <Label className="form-label">வட்டம்</Label>
                                                    <Input
                                                        id="circle"
                                                        name="circle"
                                                        className="form-control"
                                                        placeholder="வட்டத்தை தேர்ந்தெடுக்கவும்"
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
                                                    <Label className="form-label">பஞ்சாயத்து</Label>
                                                    <Input
                                                        id="Panchayat"
                                                        name="Panchayat"
                                                        className="form-control"
                                                        placeholder="பஞ்சாயத்து  தேர்ந்தெடுக்கவும்"
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
                                                    <Label className="form-label">சிற்றூர் / கிராமம்</Label>
                                                    <Input
                                                        id="village"
                                                        name="சிற்றூர் / கிராமம்  "
                                                        className="form-control"
                                                        placeholder="கிராமப் பெயரை உள்ளிடவும்"
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
                                                    <Label className="form-label">தபால் குறியீடு எண்</Label>
                                                    <Input
                                                        id="postoffice_number"
                                                        name="postoffice_number"
                                                        className="form-control"
                                                        placeholder="தபால் அலுவலக எண்ணை உள்ளிடவும்"
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
                                                    <Label className="form-label">அலைபேசி எண்</Label>
                                                    <Input
                                                        id="phoneno"
                                                        name="phoneno"
                                                        className="form-control"
                                                        placeholder="தொலைபேசி எண்ணை உள்ளிடவும்"
                                                        type="number"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.phoneno}
                                                        invalid={validation.touched.phoneno && validation.errors.phoneno ? true : false}
                                                    />
                                                    {validation.touched.phoneno && validation.errors.phoneno ? (
                                                        <FormFeedback type="invalid">{validation.errors.phoneno}</FormFeedback>
                                                    ) : null}
                                                </div>
                                                <div className="mb-3">
                                                    <Label className="form-label">மாற்று அலைபேசி எண்</Label>
                                                    <Input
                                                        id="additional_Phone_no"
                                                        name="additional_Phone_no"
                                                        className="form-control"
                                                        placeholder="கூடுதல் தொலைபேசி எண்ணை உள்ளிடவும்
                                                        "
                                                        type="number"
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
                                                    <Label className="form-label">குடும்ப தலைவரின் புகைப்படம்</Label>
                                                    <Input
                                                        id="user_photo"
                                                        name="user_photo"
                                                        className="form-control"
                                                        placeholder="குடும்ப தலைவரின் புகைப்படத்தை பதிவேற்றவும் "
                                                        type="file"
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.firm_logo || ""}

                                                    />
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


                                            </div>
                                        </div>
                                    </div>

                                    <Card>
                                        <CardHeader>
                                            <div className="d-flex align-items-center">
                                                <h5>Personal Details</h5>
                                                <input
                                                    type="button"
                                                    className="btn btn-success  ms-auto"
                                                    value="Add"
                                                    onClick={() => {
                                                        handleAddRowNested();
                                                      }}
                                                />
                                              
                                                
                                            </div>


                                        </CardHeader>
                                        <CardBody>
                                        
                                        {(rows1 || []).map((formRow, key) => (
                                          
                                            <div className="row" key={key}>
                                                  
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <Label className="form-label">பெயர்<span className="text-danger">*</span></Label>
                                                        <Input
                                                            id="membersname"
                                                            name="membersname"
                                                            className="form-control"
                                                            placeholder="பெயரை உள்ளிடுக"
                                                            type="text"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.membersname}
                                                            invalid={validation.touched.membersname && validation.errors.membersname ? true : false}
                                                        />
                                                        {validation.touched.membersname && validation.errors.membersname ? (
                                                            <FormFeedback type="invalid">{validation.errors.membersname}</FormFeedback>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">ஆதார் எண்</Label>
                                                        <Input
                                                            id="aadhar_no"
                                                            name="aadhar_no"
                                                            className="form-control"
                                                            placeholder="ஆதார் எண்ணை உள்ளிடவும்"
                                                            type="number"
                                                            onChange={validation.handleChange}
                                                        />
                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">அலைபேசி எண்  <span className="text-danger">*</span></Label>
                                                        <Input
                                                            id="member_phone_no"
                                                            name="member_phone_no"
                                                            className="form-control"
                                                            placeholder="தொலைபேசி எண்ணை உள்ளிடவும்
                                                        "
                                                            type="number"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.member_phone_no}
                                                            invalid={validation.touched.member_phone_no && validation.errors.member_phone_no ? true : false}
                                                        />
                                                        {validation.touched.member_phone_no && validation.errors.member_phone_no ? (
                                                            <FormFeedback type="invalid">{validation.errors.member_phone_no}</FormFeedback>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">பாலினம்</Label>
                                                        <Input
                                                            id="gender"
                                                            name="gender"
                                                            className="form-control"
                                                            placeholder="Select Gender"
                                                            type="select"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.gender || ''}
                                                            invalid={validation.touched.gender && validation.errors.gender ? true : false}
                                                        >
                                                            <option value="" disabled >பாலினத்தைத் தேர்ந்தெடுக்கவும்</option>
                                                            {districtList.map((element) => (<option key={element.key} value={element.value}>{element.key}</option>))}
                                                        </Input>
                                                        {validation.touched.gender && validation.errors.gender ? (
                                                            <FormFeedback type="invalid">{validation.errors.gender}</FormFeedback>
                                                        ) : null}
                                                    </div>

                                                    <div className="mb-3">
                                                        <FormGroup>
                                                            <Label className="form-label">பிறந்த தேதி </Label>
                                                            <Input type="date"
                                                                name="dob"
                                                                id="dob"
                                                                onChange={validation.handleChange}
                                                                onBlur={validation.handleBlur}
                                                                value={validation.values.registration_date}
                                                            >
                                                            </Input>
                                                        </FormGroup>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <Label className="form-label">உறவுமுறை</Label>
                                                        <Input
                                                            id="relationship"
                                                            name="relationship"
                                                            className="form-control"
                                                            type="select"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.relationship || ''}
                                                            invalid={validation.touched.relationship && validation.errors.relationship ? true : false}
                                                        >
                                                            <option value="" disabled >உறவைத் தேர்ந்தெடுக்கவும்</option>
                                                            {districtList.map((element) => (<option key={element.key} value={element.value}>{element.key}</option>))}
                                                        </Input>
                                                        {validation.touched.district && validation.errors.district ? (
                                                            <FormFeedback type="invalid">{validation.errors.district}</FormFeedback>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">திருமண நிலை</Label>
                                                        <Input
                                                            id="marriage_status"
                                                            name="marriage_status"
                                                            className="form-control"
                                                            placeholder="Select Court Name"
                                                            type="select"
                                                            onChange={validation.handleChange}
                                                        />
                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">தொழில்</Label>
                                                        <Input
                                                            id="profession"
                                                            name="profession"
                                                            className="form-control"
                                                            placeholder="Select Court Name"
                                                            type="select"
                                                            onChange={validation.handleChange}
                                                        />
                                                    </div>
                                                    <div className="mb-3">
                                                        <Label>தொழில் குறிப்பு </Label>
                                                        <Input
                                                            id="profess_desc"
                                                            name="profess_desc"
                                                            className="form-control"
                                                            placeholder="உங்கள் தொழில் விவரங்களை உள்ளிடவும்"
                                                            type="textarea"
                                                            onChange={validation.handleChange}
                                                        />
                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">Blood Group</Label>
                                                        <Input
                                                            id="blood_group"
                                                            name="blood_group"
                                                            className="form-control"
                                                            placeholder="Select Court Name"
                                                            type="select"
                                                            onChange={validation.handleChange}
                                                        />
                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">Card Details</Label>
                                                        <Input
                                                            id="cardno"
                                                            name="cardno"
                                                            className="form-control"
                                                            placeholder="Enter Card Details"
                                                            type="password"
                                                            onChange={validation.handleChange}
                                                        />

                                                    </div>
                                                </div>
                                               
                                            </div>
                                             ))}
                                        </CardBody>
                                    </Card>








                                    <div className="mt-4 text-center">
                                        <button type="button" className="btn btn-secondary me-2" onClick={handleCancle}>Cancel</button>

                                        <button className="btn btn-primary btn-block " type="submit">
                                            Save Changes
                                        </button>
                                    </div>
                                </Form>

                            </CardBody>
                        </Card>

                        <ToastContainer />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AddUser;