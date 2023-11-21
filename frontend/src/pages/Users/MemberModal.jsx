import React, { useState } from 'react';
import { Button, FormFeedback, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, Form } from 'reactstrap';
import { Link } from 'react-router-dom';
import { POST } from 'helpers/api_helper';
import { CARD_MAP } from 'helpers/url_helper';
import CustomToast from "components/Common/Toast";
import { useFormik, FieldArray, FormikProvider, } from 'formik';
import * as Yup from "yup";
import { mobileRegExp } from "constants/constants";
function MemberModal(props) {
  const { data, trustid } = props;
  const [modal, setModal] = useState(false);
  const [cardvalue, setCardvalue] = useState('');
  const toggle = () => setModal(!modal);

  const handleChange = (event) => {
    setCardvalue(event.target.value);
  }
  const addModalValues = useFormik({
    enableReinitialize: false,
    initialValues: {
      trustcard: '',
    },
    validationSchema: Yup.object({
      trustcard: Yup.string().required("This field is required!"),
    })
  })
  const addModaltrueValue = useFormik({
    enableReinitialize: false,
    initialValues: {
      trustid: '',
      familyid:''
    },
    validationSchema: Yup.object({
      trustcard: Yup.string().matches(mobileRegExp, 'Invalid Mobile number!'),
      familyid:  Yup.string().matches(mobileRegExp, 'Invalid Mobile number!'),
    })
  })

  const handleSubmit = async () => {
    let url = CARD_MAP.replace(":slug", data.props)
    var res = await POST(url, { "card_no": cardvalue });
    if (res.status === 200) {
      CustomToast(res.data.message, "success");
      toggle();
      window.location.reload();
    }
    else {
      CustomToast(res.data.message, "error");
    }
  }

  return (
    <div>

      <Link onClick={toggle}><i className="mdi mdi-plus-circle fs-1 text-primary" />
      </Link>

      <Modal isOpen={modal} toggle={toggle} centered>
        <ModalHeader toggle={toggle}>Card Mapping</ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              console.log(addModalValues)
              addModalValues.handleSubmit();
              // addModalValues.isValid ? errorSubmit() : CustomToast(JSON.stringify(addModalValues.errors), "error");;
              // return false;
            }}

          >

            {/* <div className="mb-3">
              <Label>Trustee Card</Label>
              <Input
                id="trusteeCard"
                name="trusteeCard"
                className="form-control"
                placeholder="Enter Trustee Card Number"
                type="number"
                onChange={addModalValues.handleChange}
                onBlur={addModalValues.handleBlur}
                value={addModalValues.values.trusteeid}
                invalid={
                  addModalValues.touched.trusteeid &&
                    addModalValues.errors.trusteeid ? true : false
                }
              />
              {addModalValues.touched.trusteeid &&
                addModalValues.errors.trusteeid ? (
                <FormFeedback type="invalid">
                  {addModalValues.errors.trusteeid}
                </FormFeedback>
              ) : null}
            </div> */}
            <div className="mb-3">
              <Label>Trustee Card<span className="text-danger">*</span> </Label>
              <Input
                id="trustcard"
                name="trustcard"
                className="form-control"
                placeholder="Enter Trust ID                                                                      "
                type="number"
                onChange={handleChange}
                onBlur={addModalValues.handleBlur}
                value={addModalValues.values.trustcard}
                invalid={addModalValues.touched.trustcard && addModalValues.errors.trustcard ? true : false}
              />
              {addModalValues.touched.trustcard && addModalValues.errors.trustcard ? (
                <FormFeedback type="invalid">{addModalValues.errors.trustcard}
                </FormFeedback>
              ) : null}
            </div>

          </Form>
          {trustid && (
            <Form
            onSubmit={(e) => {
              e.preventDefault();
              console.log(addModalValues)
              addModaltrueValue.handleSubmit();
              
            }}

            >
            <div className="mb-3">
              <Label>Trustee Id<span className="text-danger">*</span> </Label>
              <Input
                id="trustid"
                name="trustid"
                className="form-control"
                placeholder="Enter Trust ID                                                                      "
                type="number"
                onChange={handleChange}
                onBlur={addModaltrueValue.handleBlur}
                value={addModaltrueValue.values.trustid}
                invalid={addModaltrueValue.touched.trustid && addModaltrueValue.errors.trustid ? true : false}
              />
              {addModaltrueValue.touched.trustid && addModaltrueValue.errors.trustid ? (
                <FormFeedback type="invalid">{addModaltrueValue.errors.trustid}
                </FormFeedback>
              ) : null}
            </div>
              <div className="mb-3">
              <Label>Family Id<span className="text-danger">*</span> </Label>
              <Input
                id="familyid"
                name="familyid"
                className="form-control"
                placeholder="Enter Family ID                                                                      "
                type="number"
                onChange={handleChange}
                onBlur={addModalValues.handleBlur}
                value={addModalValues.values.familyid}
                invalid={addModalValues.touched.familyid && addModalValues.errors.familyid ? true : false}
              />
              {addModalValues.touched.familyid && addModalValues.errors.familyid ? (
                <FormFeedback type="invalid">{addModalValues.errors.familyid}
                </FormFeedback>
              ) : null}
            </div>
            </Form>

          )}


        </ModalBody>
        <ModalFooter>
          <Button color="primary" type="submit">
            Add
          </Button>{' '}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default MemberModal;