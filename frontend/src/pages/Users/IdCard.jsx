import { useState, useEffect, useRef } from "react";
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
import { Button } from "reactstrap";
import { toPng , toJpeg} from 'html-to-image';
function UseridCard() {
    const [data, setCardvalue] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const { id } = useParams();
    const verticalFront = useRef(null);
    const verticalBackside = useRef(null);
    const horizontalFront = useRef(null);
    const horizontalBackside = useRef(null);

    const verticalDownloadImage = () => {
        if (verticalFront.current) {
            toPng(verticalFront.current)
                .then(function (dataUrl) {

                    const link = document.createElement('a');
                    const filename =`${data?.member_id}_Frontside.jpeg`;
                    link.download = filename;
                    link.href = dataUrl;
                    link.click();
                })
                .catch(function (error) {
                    console.error('Error capturing the image:', error);
                });

        }
        if (verticalBackside.current) {
            toPng(verticalBackside.current)
                .then(function (dataUrl) {
                    const link = document.createElement('a');
                    const filename =`${data?.member_id}_Backside.jpeg`;
                    link.download = filename;
                    link.href = dataUrl;
                    link.click();
                })
                .catch(function (error) {
                    console.error('Error capturing the image:', error);
                });
        }
    };

    const horizontalDownloadImage = () => {
        if (horizontalFront.current) {
            toPng(horizontalFront.current)
                .then(function (dataUrl) {
                    const link = document.createElement('a');
                    const filename =`${data?.member_id}_Frontside.jpeg`;
                    link.download = filename;
                    link.href = dataUrl;
                    link.click();
                })
                .catch(function (error) {
                    console.error('Error capturing the image:', error);
                });

        }
        if (horizontalBackside.current) {
            console.log("backk")
            toJpeg(horizontalBackside.current)
                .then(function (dataUrl) {
                    const link = document.createElement('a');
                    const filename =`${data?.member_id}_Backside.jpeg`;
                    link.download = filename;
                    link.href = dataUrl;
                    link.click();
                })
                .catch(function (error) {
                    console.error('Error capturing the image:', error);
                });
        }
    };


    useEffect(() => {
        fetchUser();
    }, [])
    const fetchUser = async () => {
        setShowLoader(true);
        let url = USER_URL + id + '/';
        const response = await GET(url);
        if (response.status === 200) {
            setCardvalue(response.data.data);
            setShowLoader(false);
            console.log(data);
        }
        else {
            CustomToast(response.data.message, "error")
            setShowLoader(false);
        }
    }
    return (
        <>
            {showLoader && <Loader />}
            <div className="page-content">
                <div className="container-fluid">
                    {data?.is_charity_member ? (
                        <>
                            <div className="id-vertical card mb-5">
                                <div className="d-flex ms-auto p-3">
                                    <Button className="btn-success align-items-center d-flex gap-2 p-1 justify-content-center" onClick={verticalDownloadImage}>
                                        <span className="mdi mdi-download-circle fs-2"></span>Download
                                    </Button>
                                </div>
                                <div className="row justify-content-center gap-5 p-3" >
                                    <div className="col-sm-4" >

                                        <div className="id-cover" ref={verticalFront}>
                                            <div >
                                                <img src={verticalfront} className="vertical-front-img" />
                                                <div className="user-content" >
                                                    {data?.profile_image ? (<img className="id-photo" src={data?.profile_image.public_url} alt="User Avatar" />)
                                                        : <img className="id-photo" src={noprofile} alt="User Profie" />}

                                                    <p className="id-name">{data?.name}</p>
                                                    <p className="id-reg-no">{data?.receipt_no}</p>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="col-sm-1">

                            </div> */}
                                    <div className="col-sm-4">
                                        <div className="id-cover" ref={verticalBackside}>
                                            <img src={verticalback} className="vertical-back-img" />
                                            <div className="user-content">
                                                <p className="id-address">
                                                    த/க பெ: {data?.father_or_husband} <br />
                                                    {data?.current_address}
                                                </p>
                                                <p className="id-phone-no">{data?.phone_number}</p>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>
                            <div className="id-horizontal card">
                                <div className="d-flex ms-auto p-3">
                                    <Button className="btn-success align-items-center d-flex gap-2 p-1 justify-content-center" onClick={horizontalDownloadImage}>
                                        <span className="mdi mdi-download-circle fs-2"></span>Download
                                    </Button>
                                </div>
                                <div className="row justify-content-center d-block">
                                    <div className="col-sm-6 mb-3  m-auto">
                                        <div className="id-cover" ref={horizontalFront}>
                                            <img src={horizontalfront} className="horizontal-front-img" />
                                            <div className="user-content">
                                                {/* <img src={profilepicture} className="id-photo" /> */}
                                                {data?.profile_image ? (<img className="id-photo" src={data?.profile_image.public_url} alt="User Avatar" />)
                                                    : <img className="id-photo" src={noprofile} alt="User Profie" />}
                                                <p className="id-name">{data?.name}</p>
                                                <p className="id-reg-no">{data?.receipt_no}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 m-auto">
                                        <div className="id-cover" ref={horizontalBackside}>
                                            <img src={horizontalback} className="horizontal-back-img" />
                                            <div className="user-content">
                                                <p className="id-address justify-content-center">
                                                    த/க பெ: {data?.father_or_husband} <br />
                                                    {data?.current_address}
                                                </p>
                                                <p className="id-phone-no">{data?.phone_number}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : <>
                        <div className="id-horizontal card">
                            <div className="d-flex ms-auto p-3">
                                <Button className="btn-success align-items-center d-flex gap-2 p-1 justify-content-center" onClick={horizontalDownloadImage}>
                                    <span className="mdi mdi-download-circle fs-2"></span>Download
                                </Button>
                            </div>
                            <div className="row justify-content-center d-block " ref={horizontalFront}>
                                <div className="col-sm-6 mb-3  m-auto" >
                                    <div className="id-cover" >
                                        <img src={horizontalfront} className="horizontal-front-img" />
                                        <div className="user-content">
                                            {/* <img src={profilepicture} className="id-photo" /> */}
                                            {data?.profile_image ? (<img className="id-photo" src={data?.profile_image.public_url} alt="User Avatar" />)
                                                : <img className="id-photo" src={noprofile} alt="User Profie" />}
                                            <p className="id-name">{data?.name}</p>
                                            <p className="id-reg-no">{data?.receipt_no}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6 m-auto">
                                    <div className="id-cover" ref={horizontalBackside}>
                                        <img src={horizontalback} className="horizontal-back-img" />
                                        <div className="user-content">
                                            <p className="id-address justify-content-center">
                                                த/க பெ: {data?.father_or_husband} <br />
                                                {data?.current_address}
                                            </p>
                                            <p className="id-phone-no">{data?.phone_number}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>}


                </div>
            </div>
            <ToastContainer />
        </>
    )
}
export default UseridCard;