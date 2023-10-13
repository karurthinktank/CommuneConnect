import { useState , useEffect} from "react";
import { IDCARD } from "helpers/url_helper";
import { ToastContainer } from 'react-toastify';
import CustomToast from "components/Common/Toast";
import Loader from "components/Common/Loader";


function  UseridCard(){
    const [idcardvalue ,setCardvalue]=useState(false);
    const [showLoader, setShowLoader] = useState(false);

// useEffect(()=>{
//     fetchUser();
// },[])
// const fetchUser = async()=>{
//     //  let url= IDCARD + id+ '/';
//     //  const response = await GET(url);
//      if(response.status === 200){
//         setCardvalue(response.data.data);
//      }
//      else{
//         CustomToast(response.data.message,error)
//      }
// }
    return (
        <>
              {showLoader && <Loader/>}
        <div className="page-content">
            <div className="container-fluid">
            <div className="row">
               
            </div>
            </div>
        </div>
        <ToastContainer/>
        </>
    )
}
export default UseridCard;