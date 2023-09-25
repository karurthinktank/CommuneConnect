import { React, useState, useEffect } from "react";
import Breadcrumb from "components/Common/Breadcrumb";
import {
    Card, CardBody, CardFooter, CardHeader, Input, Label, Form,
    FormFeedback, FormGroup, Button
} from 'reactstrap';
import { useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import CustomToast from "components/Common/Toast";

// Formik Validation
import * as Yup from "yup";
import { useFormik, FieldArray, FormikProvider, Formik, Field, ErrorMessage } from "formik";
import { mobileRegExp } from "constants/constants";
import { USER_URL } from "helpers/url_helper";
import { POST, GET, UPLOAD } from "helpers/api_helper";
import { DISTRICT_LIST, STATE_LIST, COUNTRY_LIST } from "constants/constants";

function AddUser() {

    const billBook = [1,2,3,4,5];
    const [address, setAddress] = useState("same_address");
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState()

    const addressvalue = (event) => {
        setAddress(event.target.value);
    }


    const addUserForm = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: false,
        initialValues: {
            name: '',
            mobile_number: '',
            receipt_no: '',
            receipt_date: null,
            receipt_book_no: '',
            is_group_member: '',
            member_registration_number: '',
            current_address: '',
            permanent_address: '',
            country: '',
            state: '',
            district: '',
            area: '',
            panchayat: '',
            village_name: '',
            postal_code: '',
            secondary_mobile_number: '',
            country_code: '',
            international_mobile_number: '',
            std_code: '',
            phone_number: '',
            profile_image: '',
            members: [{
                member_name: '', aadhar_no: '', member_mobile_number: '', gender: '', relationship: '',
                date_of_birth: '', martial_status: '', occupation: '', career_reference: '', blood_group: '', card_details: '',
            }],
        },

        validationSchema: Yup.object({
            name: Yup.string().required("This field is required!"),
            profile_image: Yup.string().required("This field is required!"),
            is_group_member: Yup.string().required("This field is required!"),
            current_address: Yup.string().required("This field is required!"),
            country: Yup.string().required("This field is required!"),
            state: Yup.string().required("This field is required!"),
            district: Yup.string().required("This field is required!"),
            mobile_number: Yup.string().required("This field is required!").matches(mobileRegExp, 'Invalid Mobile number!'),
            secondary_mobile_number: Yup.string().matches(mobileRegExp, 'Invalid Mobile number!'),
            members: Yup.array().of(
                Yup.object({
                    member_name: Yup.string().required("This field is required!"),
                    member_mobile_number: Yup.string().matches(mobileRegExp, 'Invalid Mobile number!').required("This field is required!"),
                    gender: Yup.string().required("This field is required!"),
                    relationship: Yup.string(),
                    aadhar_no: Yup.string(),
                    date_of_birth: Yup.string(),
                    martial_status: Yup.string(),
                    occupation: Yup.string(),
                    career_reference: Yup.string(),
                    blood_group: Yup.string(),
                    card_details: Yup.string(),
                })
            )
                .required('Must have Family Members')
        }),
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append("profile_image", profileImage);
            values['files'] = formData;
            formData.append("form_data", JSON.stringify(values));
            var res = await UPLOAD(USER_URL, formData);
            console.log(res);
            if (res.status === 200 || res.status === 201) {
                CustomToast(res.data.message, "success");
                navigate('/users');
            }
            else {
                CustomToast(res.data.message, "error");
            }
        },
    });


    const handleCancle = () => {
        addUserForm.resetForm();
        navigate('/users');
    }


    // const handleFormArray = (event) => {
    //     let index = event.target.id.split("$")[0];
    //     console.log(event.target.name)
    //     addUserForm.setFieldValue(`members.${index}.${event.target.name}`, event.target.value);
    // }

    const handleFiles = (event) => {
        let files = event.target.files[0];
        setProfileImage(files);
        addUserForm.setFieldValue('profile_image', event.target.value);
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
                                <FormikProvider value={addUserForm}>
                                    <Form
                                        className="form-horizontal"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            console.log(addUserForm)
                                            addUserForm.handleSubmit();
                                            // addUserForm.isValid ? addUserForm.handleSubmit() : CustomToast("Please fill all the required fields.", "error");;
                                            return false;
                                        }}
                                    >

                                        <div>

                                            <div className="row">
                                                <div className="col-md-6">


                                                    <div className="mb-3">
                                                        <Label>குடும்ப தலைவர் பெயர் <span className="text-danger">*</span> </Label>
                                                        <Input
                                                            id="name"
                                                            name="name"
                                                            className="form-control"
                                                            placeholder="குடும்பத் தலைவரின் பெயரை உள்ளிடவும்                                                                        "
                                                            type="text"
                                                            onChange={addUserForm.handleChange}
                                                            onBlur={addUserForm.handleBlur}
                                                            value={addUserForm.values.name}
                                                            invalid={addUserForm.touched.name && addUserForm.errors.name ? true : false}
                                                        />
                                                        {addUserForm.touched.name && addUserForm.errors.name ? (
                                                            <FormFeedback type="invalid">{addUserForm.errors.name}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">அறக்கட்டளையின் உறுப்பினரா?<span className="text-danger">*</span></Label>
                                                        <Input
                                                            id="is_group_member"
                                                            name="is_group_member"
                                                            className="form-control"

                                                            type="select"
                                                            onChange={addUserForm.handleChange}
                                                            onBlur={addUserForm.handleBlur}
                                                            value={addUserForm.values.is_group_member || ''}
                                                            invalid={addUserForm.touched.is_group_member && addUserForm.errors.is_group_member ? true : false}
                                                        >
                                                            <option value="" disabled >அவர் இந்த அறக்கட்டளையின் உறுப்பினரா?</option>
                                                            <option key="Yes" value="Yes">Yes</option>
                                                            <option key="No" value="No">No</option>
                                                        </Input>
                                                        {addUserForm.touched.is_group_member && addUserForm.errors.is_group_member ? (
                                                            <FormFeedback type="invalid">{addUserForm.errors.is_group_member}</FormFeedback>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3">
                                                        <Label>உறுப்பினர் பதிவு எண் <span className="text-danger">*</span> </Label>
                                                        <Input
                                                            id="member_registration_number"
                                                            name="member_registration_number"
                                                            className="form-control"
                                                            placeholder="உறுப்பினர் பதிவு எண்ணை உள்ளிடவும்"
                                                            type="text"
                                                            onChange={addUserForm.handleChange}
                                                            onBlur={addUserForm.handleBlur}
                                                            value={addUserForm.values.member_registration_number}
                                                            invalid={addUserForm.touched.member_registration_number && addUserForm.errors.member_registration_number ? true : false}
                                                        />
                                                        {addUserForm.touched.member_registration_number && addUserForm.errors.member_registration_number ? (
                                                            <FormFeedback type="invalid">{addUserForm.errors.member_registration_number}
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
                                                            onChange={addUserForm.handleChange}
                                                            onBlur={addUserForm.handleBlur}
                                                            value={addUserForm.values.current_address}
                                                            invalid={addUserForm.touched.current_address && addUserForm.errors.current_address ? true : false}
                                                        />
                                                        {addUserForm.touched.current_address && addUserForm.errors.current_address ? (
                                                            <FormFeedback type="invalid">{addUserForm.errors.current_address}
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
                                                                            onChange={addUserForm.handleChange}
                                                                            value={addUserForm.values.current_address}

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
                                                                            onChange={addUserForm.handleChange}
                                                                            value={addUserForm.values.permanent_address}

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
                                                            onChange={addUserForm.handleChange}
                                                            onBlur={addUserForm.handleBlur}
                                                            value={addUserForm.values.country || ''}
                                                            invalid={addUserForm.touched.country && addUserForm.errors.country ? true : false}
                                                        >
                                                            <option value="" disabled >நாடு தேர்ந்தெடுக்கவும்</option>
                                                            {COUNTRY_LIST.map((element) => (<option key={element} value={element}>{element}</option>))}
                                                        </Input>
                                                        {addUserForm.touched.country && addUserForm.errors.country ? (
                                                            <FormFeedback type="invalid">{addUserForm.errors.country}</FormFeedback>
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
                                                            onChange={addUserForm.handleChange}
                                                            onBlur={addUserForm.handleBlur}
                                                            value={addUserForm.values.state || ''}
                                                            invalid={addUserForm.touched.state && addUserForm.errors.state ? true : false}
                                                        >
                                                            <option value="" disabled >Select State</option>
                                                            {STATE_LIST.map((element) => (<option key={element} value={element}>{element}</option>))}
                                                        </Input>
                                                        {addUserForm.touched.state && addUserForm.errors.state ? (
                                                            <FormFeedback type="invalid">{addUserForm.errors.district}</FormFeedback>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">மாவட்டம்<span className="text-danger">*</span></Label>
                                                        <Input
                                                            id="district"
                                                            name="district"
                                                            className="form-control"
                                                            placeholder="Select district"
                                                            type="select"
                                                            onChange={addUserForm.handleChange}
                                                            onBlur={addUserForm.handleBlur}
                                                            value={addUserForm.values.district || ''}
                                                            invalid={addUserForm.touched.district && addUserForm.errors.district ? true : false}
                                                        >
                                                            <option value="" disabled >Select District</option>
                                                            {DISTRICT_LIST.map((element) => (<option key={element} value={element}>{element}</option>))}
                                                        </Input>
                                                        {addUserForm.touched.district && addUserForm.errors.district ? (
                                                            <FormFeedback type="invalid">{addUserForm.errors.district}</FormFeedback>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">இரசீது புத்தக எண் </Label>
                                                        <Input
                                                            id="receipt_book_no"
                                                            name="receipt_book_no"
                                                            className="form-control"
                                                            type="select"
                                                            onChange={addUserForm.handleChange}
                                                            onBlur={addUserForm.handleBlur}
                                                            value={addUserForm.values.receipt_book_no || ''}
                                                            invalid={addUserForm.touched.receipt_book_no && addUserForm.errors.receipt_book_no ? true : false}
                                                        >
                                                            <option value="" disabled >ரசீது புத்தக எண்ணைத் தேர்ந்தெடுக்கவும்</option>
                                                            {billBook.map((code) => (<option key={code} value={code}>{code}</option>))}
                                                        </Input>
                                                        {addUserForm.touched.receipt_book_no && addUserForm.errors.receipt_book_no ? (
                                                            <FormFeedback type="invalid">{addUserForm.errors.receipt_book_no}</FormFeedback>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">இரசீது எண்</Label>
                                                        <Input
                                                            id="receipt_no"
                                                            name="receipt_no"
                                                            className="form-control"
                                                            placeholder="இரசீது எண்ணைத் தேர்ந்தெடுக்கவும்"
                                                            type="text"
                                                            onChange={addUserForm.handleChange}
                                                            onBlur={addUserForm.handleBlur}
                                                            value={addUserForm.values.receipt_no}
                                                        />

                                                    </div>


                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <FormGroup>
                                                            <Label className="form-label">இரசீது தேதி</Label>
                                                            <Input type="date"
                                                                name="receipt_date"
                                                                id="receipt_date"
                                                                onChange={addUserForm.handleChange}
                                                                onBlur={addUserForm.handleBlur}
                                                                value={addUserForm.values.receipt_date}
                                                            >
                                                            </Input>
                                                        </FormGroup>
                                                    </div>

                                                    <div className="mb-3">
                                                        <Label className="form-label">வட்டம்</Label>
                                                        <Input
                                                            id="area"
                                                            name="area"
                                                            className="form-control"
                                                            placeholder="வட்டத்தை தேர்ந்தெடுக்கவும்"
                                                            type="text"
                                                            onChange={addUserForm.handleChange}
                                                            onBlur={addUserForm.handleBlur}
                                                            value={addUserForm.values.area}
                                                        />

                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">பஞ்சாயத்து</Label>
                                                        <Input
                                                            id="panchayat"
                                                            name="panchayat"
                                                            className="form-control"
                                                            placeholder="பஞ்சாயத்து  தேர்ந்தெடுக்கவும்"
                                                            type="text"
                                                            onChange={addUserForm.handleChange}
                                                            onBlur={addUserForm.handleBlur}
                                                            value={addUserForm.values.panchayat}
                                                        />

                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">சிற்றூர் / கிராமம்</Label>
                                                        <Input
                                                            id="village"
                                                            name="village"
                                                            className="form-control"
                                                            placeholder="கிராமப் பெயரை உள்ளிடவும்"
                                                            type="text"
                                                            onChange={addUserForm.handleChange}
                                                            onBlur={addUserForm.handleBlur}
                                                            value={addUserForm.values.village}
                                                        />

                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">தபால் குறியீடு எண்</Label>
                                                        <Input
                                                            id="postal_code"
                                                            name="postal_code"
                                                            className="form-control"
                                                            placeholder="தபால் அலுவலக எண்ணை உள்ளிடவும்"
                                                            type="text"
                                                            onChange={addUserForm.handleChange}
                                                            onBlur={addUserForm.handleBlur}
                                                            value={addUserForm.values.postal_code}
                                                        />

                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">அலைபேசி எண்<span className="text-danger">*</span></Label>
                                                        <Input
                                                            id="mobile_number"
                                                            name="mobile_number"
                                                            className="form-control"
                                                            placeholder="தொலைபேசி எண்ணை உள்ளிடவும்"
                                                            type="number"
                                                            onChange={addUserForm.handleChange}
                                                            onBlur={addUserForm.handleBlur}
                                                            value={addUserForm.values.mobile_number}
                                                            invalid={addUserForm.touched.mobile_number && addUserForm.errors.mobile_number ? true : false}
                                                        />
                                                        {addUserForm.touched.mobile_number && addUserForm.errors.mobile_number ? (
                                                            <FormFeedback type="invalid">{addUserForm.errors.mobile_number}</FormFeedback>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">மாற்று அலைபேசி எண்</Label>
                                                        <Input
                                                            id="secondary_mobile_number"
                                                            name="secondary_mobile_number"
                                                            className="form-control"
                                                            placeholder="கூடுதல் தொலைபேசி எண்ணை உள்ளிடவும்"
                                                            type="number"
                                                            onChange={addUserForm.handleChange}
                                                            onBlur={addUserForm.handleBlur}
                                                            value={addUserForm.values.secondary_mobile_number}
                                                            invalid={addUserForm.touched.secondary_mobile_number && addUserForm.errors.secondary_mobile_number ? true : false}
                                                            />
                                                            {addUserForm.touched.secondary_mobile_number && addUserForm.errors.secondary_mobile_number ? (
                                                                <FormFeedback type="invalid">{addUserForm.errors.secondary_mobile_number}
                                                                </FormFeedback>
                                                            ) : null}

                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">குடும்ப தலைவரின் புகைப்படம்<span className="text-danger">*</span></Label>
                                                        <Input
                                                            id="profile_image"
                                                            name="profile_image"
                                                            className="form-control"
                                                            placeholder="குடும்ப தலைவரின் புகைப்படத்தை பதிவேற்றவும் "
                                                            type="file"
                                                            onBlur={addUserForm.handleBlur}
                                                            value={addUserForm.values.profile_image}
                                                            onChange={handleFiles}
                                                            invalid={addUserForm.touched.profile_image && addUserForm.errors.profile_image ? true : false}

                                                        />
                                                        {addUserForm.touched.profile_image && addUserForm.errors.profile_image ? (
                                                            <FormFeedback type="invalid">{addUserForm.errors.profile_image}</FormFeedback>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">International Country Code</Label>
                                                        <Input
                                                            id="country_code"
                                                            name="country_code"
                                                            className="form-control"
                                                            placeholder="International Country Code"
                                                            type="number"
                                                            onChange={addUserForm.handleChange}
                                                            onBlur={addUserForm.handleBlur}
                                                            value={addUserForm.values.country_code}
                                                        />

                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">சர்வதேச அலைபேசி எண் </Label>
                                                        <Input
                                                            id="international_mobile_number"
                                                            name="international_mobile_number"
                                                            className="form-control"
                                                            placeholder="சர்வதேச அலைபேசி எண்ணை உள்ளிடவும்"
                                                            type="text"
                                                            onChange={addUserForm.handleChange}
                                                            onBlur={addUserForm.handleBlur}
                                                            value={addUserForm.values.international_mobile_number}
                                                        />

                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">சதரைவழி STD Code </Label>
                                                        <Input
                                                            id="std_code"
                                                            name="std_code"
                                                            className="form-control"
                                                            placeholder="தரைவழி STD Code உள்ளிடவும்"
                                                            type="number"
                                                            onChange={addUserForm.handleChange}
                                                            onBlur={addUserForm.handleBlur}
                                                            value={addUserForm.values.std_code}
                                                        />

                                                    </div>
                                                    <div className="mb-3">
                                                        <Label className="form-label">தரைவழி தொலைபேசி எண்  </Label>
                                                        <Input
                                                            id="phone_number"
                                                            name="phone_number"
                                                            className="form-control"
                                                            placeholder="தரைவழி தொலைபேசி எண்ணை உள்ளிடவும்"
                                                            type="text"
                                                            onChange={addUserForm.handleChange}
                                                            onBlur={addUserForm.handleBlur}
                                                            value={addUserForm.values.phone_number}
                                                        />

                                                    </div>

                                                </div>
                                            </div>
                                        </div>

                                        <Card className="usercard">

                                            <CardBody>
                                                <FieldArray
                                                    name="members"
                                                    render={(arrayHelpers) => (
                                                        <div>
                                                            <div className="d-flex align-items-center p-3 mb-3" style={{backgroundColor:"#f8f8f1"}}>
                                                                <h5 className="m-0">குடும்ப உறுப்பினர்களின் தகவல்கள் :-</h5>
                                                                <input
                                                                    type="button"
                                                                    className="btn btn-success  ms-auto"
                                                                    value="Add Member"
                                                                    onClick={() => arrayHelpers.push({
                                                                        member_name: '', aadhar_no: '', member_mobile_number: '', gender: '', relationship: '',
                                                                        date_of_birth: '', martial_status: '', occupation: '', career_reference: '', blood_group: '', card_details: '',
                                                                    })}
                                                                />



                                                            </div>
                                                            {addUserForm.values.members.map((member, index) => (
                                                                <div key={index} className=" p-3 mb-3 rounded" style={{border:"1px solid #D3D3D3"}}>
                                                                    <div className="row">
                                                                        <div className="col-md-6">
                                                                            <div className="mb-3">
                                                                                <Label className="form-label">பெயர்<span className="text-danger">*</span></Label>
                                                                                <Input
                                                                                    id={`members.${index}.member_name`}
                                                                                    name={`members.${index}.member_name`}
                                                                                    className="form-control"
                                                                                    placeholder="பெயரை உள்ளிடுக"
                                                                                    type="text"
                                                                                    value={addUserForm.values.members[index].member_name}
                                                                                    onChange={addUserForm.handleChange}
                                                                                    invalid={addUserForm.values.members[index]?.member_name ? false : true}
                                                                                />
                                                                                {addUserForm.values.members[index]?.member_name ? null : (
                                                            <FormFeedback type="invalid">This field is required!</FormFeedback>)}
                                                                            </div>
                                                                            <div className="mb-3">
                                                                                <Label className="form-label">ஆதார் எண்</Label>
                                                                                <Input
                                                                                    id={`members.${index}.aadhar_no`}
                                                                                    name={`members.${index}.aadhar_no`}
                                                                                    className="form-control"
                                                                                    placeholder="ஆதார் எண்ணை உள்ளிடவும்"
                                                                                    type="text"
                                                                                    onChange={addUserForm.handleChange}
                                                                                    value={addUserForm.values.members[index].aadhar_no}
                                                                                />
                                                                            </div>
                                                                            <div className="mb-3">
                                                                                <Label className="form-label">அலைபேசி எண்  <span className="text-danger">*</span></Label>
                                                                                <Input
                                                                                    id={`members.${index}.member_mobile_number`}
                                                                                    name={`members.${index}.member_mobile_number`}
                                                                                    className="form-control"
                                                                                    placeholder="தொலைபேசி எண்ணை உள்ளிடவும்"
                                                                                    type="number"
                                                                                    onChange={addUserForm.handleChange}
                                                                                    invalid={addUserForm.values.members[index]?.member_mobile_number ? false : true}
                                                                                    value={addUserForm.values.members[index].member_mobile_number}
                                                                                    />
                                                                                    {addUserForm.values.members[index]?.member_mobile_number ? null : (
                                                            <FormFeedback type="invalid">This field is required!</FormFeedback>)}
                                                                            </div>
                                                                            <div className="mb-3">
                                                                                <Label className="form-label">பாலினம்</Label>
                                                                                <Input
                                                                                    id={`members.${index}.gender`}
                                                                                    name={`members.${index}.gender`}
                                                                                    className="form-control"
                                                                                    placeholder="Select Gender"
                                                                                    type="select"
                                                                                    onChange={addUserForm.handleChange}
                                                                                    value={addUserForm.values.members[index].gender}
                                                                                    invalid={addUserForm.values.members[index]?.gender ? false : true}
                                                                                >
                                                                                    <option value="" disabled >பாலினத்தைத் தேர்ந்தெடுக்கவும்</option>
                                                                                    <option key="ஆண்" value="ஆண்">ஆண்</option>
                                                                                    <option key="பெண்" value="பெண்">பெண்</option>
                                                                                </Input>
                                                                                {addUserForm.values.members[index]?.gender ? null : (
                                                            <FormFeedback type="invalid">This field is required!</FormFeedback>)}
                                                                            </div>

                                                                            <div className="mb-3">
                                                                                <FormGroup>
                                                                                    <Label className="form-label">பிறந்த தேதி </Label>
                                                                                    <Input type="date"
                                                                                        name={`members.${index}.date_of_birth`}
                                                                                        id={`members.${index}.date_of_birth`}
                                                                                        onChange={addUserForm.handleChange}
                                                                                        value={addUserForm.values.members[index].date_of_birth}
                                                                                    >
                                                                                    </Input>
                                                                                </FormGroup>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <div className="mb-3">
                                                                                <Label className="form-label">உறவுமுறை</Label>
                                                                                <Input
                                                                                    id={`members.${index}.relationship`}
                                                                                    name={`members.${index}.relationship`}
                                                                                    className="form-control"
                                                                                    type="select"
                                                                                    onChange={addUserForm.handleChange}
                                                                                    value={addUserForm.values.members[index].relationship}
                                                                                    invalid={addUserForm.values.members[index]?.relationship ? false : true}
                                                                                >
                                                                                    <option value="" disabled >உறவைத் தேர்ந்தெடுக்கவும்</option>
                                                                                    <option key="Son" value="Son">Son</option>
                                                                                    <option key="Daughter" value="Daughter">Daughter</option>
                                                                                    <option key="Wife" value="Wife">Wife</option>
                                                                                    <option key="Brother" value="Brother">Brother</option>
                                                                                    <option key="Sister" value="Sister">Sister</option>
                                                                                </Input>
                                                                                {addUserForm.values.members[index]?.relationship ? null : (
                                                            <FormFeedback type="invalid">This field is required!</FormFeedback>)}
                                                                            </div>
                                                                            <div className="mb-3">
                                                                                <Label className="form-label">திருமண நிலை</Label>
                                                                                <Input
                                                                                    id={`members.${index}.martial_status`}
                                                                                    name={`members.${index}.martial_status`}
                                                                                    className="form-control"
                                                                                    placeholder="திருமண நிலை"
                                                                                    type="text"
                                                                                    onChange={addUserForm.handleChange}
                                                                                    value={addUserForm.values.members[index].martial_status}
                                                                                />
                                                                            </div>
                                                                            <div className="mb-3">
                                                                                <Label className="form-label">தொழில்</Label>
                                                                                <Input
                                                                                    id={`members.${index}.occupation`}
                                                                                    name={`members.${index}.occupation`}
                                                                                    className="form-control"
                                                                                    placeholder="தொழில்"
                                                                                    type="text"
                                                                                    onChange={addUserForm.handleChange}
                                                                                    value={addUserForm.values.members[index].occupation}
                                                                                />
                                                                            </div>
                                                                            <div className="mb-3">
                                                                                <Label>தொழில் குறிப்பு </Label>
                                                                                <Input
                                                                                    id={`members.${index}.career_reference`}
                                                                                    name={`members.${index}.career_reference`}
                                                                                    className="form-control"
                                                                                    placeholder="உங்கள் தொழில் விவரங்களை உள்ளிடவும்"
                                                                                    type="textarea"
                                                                                    onChange={addUserForm.handleChange}
                                                                                    value={addUserForm.values.members[index].career_reference}
                                                                                />
                                                                            </div>
                                                                            <div className="mb-3">
                                                                                <Label className="form-label">Blood Group</Label>
                                                                                <Input
                                                                                    id={`members.${index}.blood_group`}
                                                                                    name={`members.${index}.blood_group`}
                                                                                    className="form-control"
                                                                                    placeholder="Select Blood Group"
                                                                                    type="select"
                                                                                    onChange={addUserForm.handleChange}
                                                                                    value={addUserForm.values.members[index].blood_group}
                                                                                >
                                                                                    <option value="" disabled >Select Blood Group</option>
                                                                                    <option key="O+" value="O+">O+</option>
                                                                                    <option key="A-" value="A-">A-</option>
                                                                                    <option key="A+" value="A+">A+</option>
                                                                                    <option key="B-" value="B-">B-</option>
                                                                                    <option key="AB+" value="AB+">AB+</option>
                                                                                    <option key="AB-" value="AB-">AB-</option>
                                                                                </Input>
                                                                            </div>
                                                                            <div className="mb-3">
                                                                                <Label className="form-label">Card Details</Label>
                                                                                <Input
                                                                                    id={`members.${index}.card_details`}
                                                                                    name={`members.${index}.card_details`}
                                                                                    className="form-control"
                                                                                    placeholder="Enter Card Details"
                                                                                    type="password"
                                                                                    onChange={addUserForm.handleChange}
                                                                                    value={addUserForm.values.members[index].card_details}
                                                                                />


                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                    <div className="d-flex justify-content-end gap-3">
                                                                    {addUserForm.values.members.length > 1 && (<input
                                                                            type="button"
                                                                            className="btn btn-danger"
                                                                            value="Remove"
                                                                            onClick={() => arrayHelpers.remove(index)}
                                                                        />)}
                                                                        <input
                                                                            type="button"
                                                                            className="btn btn-success"
                                                                            value="Add Another Member"
                                                                            onClick={() => arrayHelpers.push({
                                                                                member_name: '', aadhar_no: '', member_mobile_number: '', gender: '', relationship: '',
                                                                                date_of_birth: '', martial_status: '', occupation: '', career_reference: '', blood_group: '', card_details: '',
                                                                            })}
                                                                        />
                                                                       
                                                                    </div>

                                                                </div>

                                                            ))}
                                                        </div>
                                                    )}
                                                />

                                            </CardBody>
                                        </Card>

                                        <div className="mt-4 text-center">
                                            <button type="button" className="btn btn-secondary me-2" onClick={handleCancle}>Cancel</button>
                                        <button className="btn btn-primary btn-block " type="submit">
                                                Save Changes
                                            </button>
                                        </div>
                                    </Form>
                                </FormikProvider>

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