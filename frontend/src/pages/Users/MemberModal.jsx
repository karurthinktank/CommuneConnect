import React, { useState } from 'react';
import { Button, FormFeedback, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, Form } from 'reactstrap';
import { Link } from 'react-router-dom';
import { POST } from 'helpers/api_helper';
import { CARD_MAP } from 'helpers/url_helper';
import CustomToast from "components/Common/Toast";
import { useFormik, FieldArray, FormikProvider, } from 'formik';
import * as Yup from "yup";
import { mobileRegExp } from "constants/constants";
import Loader from "components/Common/Loader";

function MemberModal(props) {
  const { slug, is_charity_member } = props;
  const [modal, setModal] = useState(false);
  const [showLoader , setshowLoader] = useState(false)
  const toggle = () => setModal(!modal);

//   const IdCardForm = useFormik({
//     enableReinitialize: false,
//     initialValues: {
//       card_no: '',
//       trust_card_no: ''
//     },
//     validationSchema: Yup.object({
//       card_no: Yup.string().matches(mobileRegExp, "ID Card No must be 10 digit!").required("This field is required!"),
// //       trust_card_no: is_charity_member ? Yup.string().matches(mobileRegExp, "ID Card No must be 10 digit!").required("This field is required!") : Yup.string()
//     }),
//     onSubmit: async (values) => {
//       console.log(values)
//       let url = CARD_MAP.replace(":slug", slug)
//       var res = await POST(url, values);
//       if (res.status === 200) {
//         CustomToast(res.data.message, "success");
//         toggle();
//         window.location.reload();
//       }
//       else {
//         CustomToast(res.data.message, "error");
//       }   
//     }
//   })
const handleSubmit = async () => {
  setshowLoader(true);
  let url = CARD_MAP.replace(":slug", slug) + 'rfc';
  console.log(url);
  try {
    var res = await POST(url);
    if (res.status === 200) {
      setshowLoader(false)
      CustomToast(res.data.message, "success");
      toggle(); 
      window.location.reload(); 
    } else {
      setshowLoader(false)
      CustomToast(res.data.message, "error");
    }
  } catch (error) {
    setshowLoader(false)
    CustomToast('An error occurred', 'error');
    console.error('Error:', error);
  }}
  


  return (
    <div>
      {showLoader && <Loader/>}
      <Link onClick={toggle}><i className="mdi mdi-plus-circle fs-1 text-primary" />
      </Link>

      <Modal isOpen={modal} toggle={toggle} centered>
        <ModalHeader toggle={toggle}>Card Mapping</ModalHeader>
          <ModalBody> 
          {/* <Form
            onSubmit={(e) => {
              e.preventDefault();
              IdCardForm.handleSubmit();
            }} > */}

            {/* {is_charity_member &&
            <div className="mb-3">
              <Label>Trust ID Card<span className="text-danger">*</span> </Label>
              <Input
                id="trust_card_no"
                name="trust_card_no"
                className="form-control"
                placeholder="Enter Trust ID No                                                                   "
                type="number"
                onChange={IdCardForm.handleChange}
                onBlur={IdCardForm.handleBlur}
                value={IdCardForm.values.trust_card_no}
                invalid={IdCardForm.touched.trust_card_no && IdCardForm.errors.trust_card_no ? true : false}
              />
              {IdCardForm.touched.trust_card_no && IdCardForm.errors.trust_card_no ? (
                <FormFeedback type="invalid">{IdCardForm.errors.trust_card_no}
                </FormFeedback>
              ) : null}
            </div>} */}

            {/* <div className="mb-3">
              <Label>Family ID Card<span className="text-danger">*</span> </Label>
              <Input
                id="card_no"
                name="card_no"
                className="form-control"
                placeholder="Enter Family ID No                                                                   "
                type="number"
                onChange={IdCardForm.handleChange}
                onBlur={IdCardForm.handleBlur}
                value={IdCardForm.values.card_no}
                invalid={IdCardForm.touched.card_no && IdCardForm.errors.card_no ? true : false}
              />
              {IdCardForm.touched.card_no && IdCardForm.errors.card_no ? (
                <FormFeedback type="invalid">{IdCardForm.errors.card_no}
                </FormFeedback>
              ) : null}
            </div> */}
            {/* <ModalFooter>
            <Button color="primary" type="submit">
            Add
          </Button>{' '} */}
          {/* <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          </ModalFooter> */}
          {/* </Form> */}


          
        <Button color="primary" onClick={handleSubmit}>
          Authenticate Device
        </Button>
    

        </ModalBody>
       
         
        
      </Modal>
    </div>
  );
}

export default MemberModal;