import React, { useState, useEffect } from "react";
import Breadcrumb from "components/Common/Breadcrumb";
import { Link } from "react-router-dom";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { GET } from "helpers/api_helper";
import { USER_URL } from "helpers/url_helper";
import "../../assets/scss/_listusers.scss";
import noprofile from '../../assets/images/noprofile.jpg';
import Loader from "components/Common/Loader";
import CustomToast from "components/Common/Toast";
import { ToastContainer } from "react-toastify";
import moment from 'moment/moment';
import MemberModal from "pages/Users/MemberModal";
import { Badge ,Input,Button} from "reactstrap";
function UsersListTable() {
    const [users, setUsers] = useState([]);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(25);
    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [showLoader, setShowLoader] = useState(false);
    const [filter, setFilter] = useState();


    const actionItems = (row) => {
        return (
            <>
                <div className="fs-2 d-block gap-2">

                    <Link to={"/users/view/" + row?.member_id}><i className="mdi mdi-eye-circle fs-1" /></Link>
                    <Link to={"/users/edit/" + row?.member_id}><i className="mdi mdi-pencil-circle fs-1 text-secondary" /></Link>
                    {row.is_profile_completed && <Link to={"/users/idcard/" + row?.member_id}><i className="mdi mdi-card-account-details text-success fs-1" /></Link> }
                </div>
            </>
        );
    };
    
    useEffect(() => {
        fetchUsers(currentPage);
    }, []);
    // useEffect(()=>{
       
    // },[filter])

    const fetchUsers = async (page, count = rows, additiotal_params = {}) => {
        setShowLoader(true);
        let query_params = {
            page: page,
            count: count
        }
        query_params = { ...query_params, ...additiotal_params }
        let url = USER_URL + "?" + new URLSearchParams(query_params).toString();
        const response = await GET(url);
        if (response.status === 200) {
            setUsers(response.data.data);
            setTotalRows(response.total_count);
            setShowLoader(false);
            console.log(users);
        }
     
        else {
            setShowLoader(false);
            CustomToast(response.data.message, "error");
        }
    }

    const handlePageChange = (event) => {
        let page = event.page + 1;
        setFirst(event.first);
        setRows(event.rows);
        setCurrentPage(page);
        fetchUsers(page, event.rows)
    };

    const getImage = (row)=>{
        if(row.profile_image){
            if(row.is_profile_completed){
                return (
                    <div className="user-profile">
                        
                       <img src={row.profile_image.public_url} className="rounded-circle header-profile-user" style={{ border: "2px solid green" }}/>
                       {row.is_card_mapped && 
                        // <Badge color="success" className="rounded-pill ms-2 fs-7">Card Mapped</Badge> 
                       
                             <i className="mdi mdi-check-circle d-flex justify-content-center mt-2 fs-4 text-success"></i>
                        
                        
                       }
                     
                        </div>
                )    
            }
            else
                return <div className="user-profile">
                <img src={row.profile_image.public_url} className="rounded-circle header-profile-user" style={{ border: "2px solid red"}}/></div>
        }
        else
            return <div className="user-profile">
                 <img src={noprofile} className="rounded-circle header-profile-user" style={{ border: "2px solid red"}}/>
   
                </div>
                 }

    const handleFilter = event => {
        setFilter(event.target.value);
    }

    const handleSearch = () => {
        fetchUsers(currentPage, rows, {"search":filter});
    }

    const handleClear = () => {
        setFilter("");
        fetchUsers(currentPage, rows);
    }

    const header = (
        <div className=" d-flex flex-wrap ">
            <span className="text-xl text-900 font-bold"></span>
            <div className="ms-auto d-flex align-items-center  gap-2">
            <div className="d-flex align-items-center gap-3">
            <form className="app-search d-none d-lg-block">
                <div className="position-relative">
                  <Input type="text" id="search" name="search" onChange={handleFilter} value={filter} placeholder="Filter by Name, Mobille Number or Member Id"/>
                  <span onClick={handleClear}>x</span>                
                </div>
                </form>
                <Button type="button" onClick={handleSearch}>Search</Button>
                
            </div>
            {/* <form className="app-search d-none d-lg-block">
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control bg-white"
                  onChange={handleFilter} 
                  value={filter}
                  placeholder="Filter by Name, Mobille Number or Member Id"
                />
                <span className="bx bx-search-alt" />
              </div>
            </form> */}
            <Link to={`/users/add`} className="">
                <button className="btn btn-primary btn-block ms-auto " type="button"><span className="mdi mdi-plus fs-5 me-2"></span>புதிய சேரக்கை</button>
            </Link>
            </div>
            

        </div>
    );       
    

    return (
        <>
            {showLoader && <Loader/>}
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <Breadcrumb title="முகப்பு" breadcrumbItem="குடும்பங்கள்" />
                        <div className="card">
                            <DataTable
                                value={users}
                                header={header}
                                scrollable>
                                <Column field="image"  body={(rowData) => getImage(rowData)} 
                                header="குடும்ப தலைவர் புகைப்படம்" ></Column>
                                <Column
                                    field="name"
                                    header="குடும்ப தலைவர் பெயர் "
                                    sortable
                                    // body={(rowData) => (
                                    //     <td className={rowData.is_card_mapped ? 'green-cell' : 'red-cell'}>
                                    //         {rowData.name}
                                    //     </td>
                                    // )}
                                    // alignFrozen="left" 
                                    // frozen
                                ></Column>
                                <Column field="father_or_husband" sortable header="த/க பெயர் " ></Column>
                                <Column field="member_id" sortable header="உறுப்பினர் எண்"  ></Column>
                                <Column field="receipt_no" sortable header="இரசீது எண்" ></Column>
                                <Column field="receipt_date" header="இரசீது தேதி " 
                                  body={ (rowData) => {
                                    const formattedDate = rowData.receipt_date ? moment(rowData.receipt_date).format("DD/MM/YYYY") : "";
                                    return formattedDate;
                                  }}
                                ></Column>
                                <Column field="mobile_number" sortable header=" அலைபேசி எண்" ></Column>
                                <Column field="current_address"  header=" முகவரி"></Column>
                                {/* <Column field="country" sortable header=" நாடு"></Column>
                                <Column field="state" sortable header=" மாநிலம்"></Column>
                                <Column field="district" sortable header=" மாவட்டம்"></Column>
                                <Column field="taluk" sortable header="வட்டம்"></Column>
                                <Column field="panchayat" sortable header="பஞ்சாயத்து"></Column> */}
                                <Column field="actions" header="Action"  frozen body={actionItems}></Column>
                            </DataTable>
                            <div className="card">
                                <Paginator first={first} rows={rows} totalRecords={totalRows} rowsPerPageOptions={[25, 50, 75, 100]} onPageChange={handlePageChange} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </>
    )
}

export default UsersListTable;