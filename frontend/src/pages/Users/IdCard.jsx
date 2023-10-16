import { useState, useEffect } from "react";
import { useParams } from 'react-router';
import { USER_URL } from "helpers/url_helper";
import { GET } from "helpers/api_helper";
import { ToastContainer } from 'react-toastify';
import CustomToast from "components/Common/Toast";
import Loader from "components/Common/Loader";
import horizontalfront from "../../assets/images/horizontal-front.jpg"
import horizontalback from "../../assets/images/horizontal-back.jpg"
import verticalfront from "../../assets/images/vertical-front.jpg"
import verticalback from "../../assets/images/vertical-back.jpg"
import profilepicture from "../../assets/images/id-photo-square.png";
import noprofile from '../../assets/images/noprofile.jpg';
import "../../assets/scss/_idcard.scss";
import { date } from "yup";
function UseridCard() {
    const [idcardvalue, setCardvalue] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const { id } = useParams();
    useEffect(()=>{
        fetchUser();
    },[])
    const fetchUser = async()=>{
        setShowLoader(true);
        let url = USER_URL + id + '/';
         const response = await GET(url);
         if(response.status === 200){
            setCardvalue(response.data.data);
            setShowLoader(false);
            console.log(idcardvalue);
         }
         else{
            CustomToast(response.data.message,"error")
            setShowLoader(false);
         }
    }
    return (
        <>
            {showLoader && <Loader />}
            <div className="page-content">
                <div className="container-fluid">
                    <div className="id-vertical mb-5">
                    <div className="row justify-content-center gap-5">
                        <div className="col-sm-4">
                            <div className="id-cover">
                                <img src={verticalfront} className="vertical-front-img" />
                                <div className="user-content">
                                {profilepicture?.profile_image ? (<img className="id-photo" src={"profilepicture:image/png;base64," + noprofile?.profile_image} alt="User Avatar" />)
                                                : <img className="id-photo" src={noprofile} alt="User Profie" />}
                                    <p className="id-name">{idcardvalue?.name}</p>
                                    <p className="id-reg-no">{idcardvalue?.receipt_no}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="id-cover">
                                <img src={verticalback} className="vertical-back-img" />
                                <div className="user-content">
                                    <p className="id-address">
                                        {idcardvalue?.current_address}
                                    </p>
                                    <p className="id-phone-no">{idcardvalue?.phone_number}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                    </div>
                    <div className="id-horizontal ">
                        <div className="row justify-content-center d-block">
                            <div className="col-sm-6 mb-3  m-auto">
                                <div className="id-cover">
                                    <img src={horizontalfront} className="horizontal-front-img" />
                                    <div className="user-content">
                                        {/* <img src={profilepicture} className="id-photo" /> */}
                                        {profilepicture?.profile_image ? (<img className="id-photo" src={"profilepicture:image/png;base64," + noprofile?.profile_image} alt="User Avatar" />)
                                                : <img className="id-photo" src={noprofile} alt="User Profie" />}
                                        <p className="id-name">{idcardvalue?.name}</p>
                                        <p className="id-reg-no">{idcardvalue?.receipt_no}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 m-auto">
                                <div className="id-cover">
                                    <img src={horizontalback} className="horizontal-back-img" />
                                    <div className="user-content">
                                        <p className="id-address">
                                            {idcardvalue?.current_address}
                                        </p>
                                        <p className="id-phone-no">{idcardvalue?.phone_number}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}
export default UseridCard;