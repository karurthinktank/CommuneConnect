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
import { Badge, Input, Button, Label, FormGroup } from "reactstrap";
import Sanscript from "@indic-transliteration/sanscript";

function UsersListTable() {
    const [users, setUsers] = useState([]);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(25);
    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [showLoader, setShowLoader] = useState(false);
    const [filter, setFilter] = useState();
    const [previous, setPreviousValue] = useState();
    const [language, setLanguage] = useState(false);
    const actionItems = (row) => {
        return (
            <>
                <div className="fs-2 d-block gap-2">

                    <Link to={"/users/view/" + row?.member_id}><i className="mdi mdi-eye-circle fs-1" /></Link>
                    <Link to={"/users/edit/" + row?.member_id}><i className="mdi mdi-pencil-circle fs-1 text-secondary" /></Link>
                    {row.is_profile_completed && <Link to={"/users/idcard/" + row?.member_id}><i className="mdi mdi-card-account-details text-success fs-1" /></Link>}
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
    const selectLanguage = () => {
        setLanguage(!language);
    }
    const handlePageChange = (event) => {
        let page = event.page + 1;
        setFirst(event.first);
        setRows(event.rows);
        setCurrentPage(page);
        fetchUsers(page, event.rows)
    };

    const getImage = (row) => {
        if (row.profile_image) {
            if (row.is_profile_completed) {
                return (
                    <div className="user-profile">

                        <img src={row.profile_image.public_url} className="rounded-circle header-profile-user" style={{ border: "2px solid green" }} />
                        {row.is_card_mapped &&
                            // <Badge color="success" className="rounded-pill ms-2 fs-7">Card Mapped</Badge> 

                            <i className="mdi mdi-checkbox-marked-circle-outline d-flex justify-content-center  fs-2 text-success"></i>
                        }

                    </div>
                )
            }
            else
                return <div className="user-profile">
                    <img src={row.profile_image.public_url} className="rounded-circle header-profile-user" style={{ border: "2px solid red" }} /></div>
        }
        else
            return <div className="user-profile">
                <img src={noprofile} className="rounded-circle header-profile-user" style={{ border: "2px solid red" }} />

            </div>
    }

    const handleFilter = event => {
        let value = event.target.value;
        let translate = "";
        let previousValue = ""

        if (language) {
            previousValue = previous;
            if (previousValue) {
                if (event.nativeEvent.data == null)
                    previousValue = previousValue.slice(0, -1)
                else if (!event.nativeEvent.data.replace(/\s/g, ""))
                    previousValue = "";
                else if (event.nativeEvent.data)
                    previousValue += event.nativeEvent.data

            }
            else {
                if (event.nativeEvent.data != null && !event.nativeEvent.data.replace(/\s/g, ""))
                    previousValue = "";
                else if (event.nativeEvent.data)
                    previousValue = event.nativeEvent.data
            }
            setPreviousValue(previousValue);
        }
        else {
            setPreviousValue("");
        }
        if (previousValue) {
            translate = Sanscript.t(previousValue, "itrans_dravidian", "tamil");
            let splitBySpace = value.split(/\s/g);
            let no_char_remv = 0;
            if (splitBySpace.length <= 1) {
                no_char_remv = "-" + previousValue.length;
                value = value.slice(0, parseInt(no_char_remv));
                value = translate;
            }
            else {
                no_char_remv = "-" + splitBySpace[splitBySpace.length - 1].length;
                let trans = (splitBySpace[splitBySpace.length - 1], translate);
                splitBySpace[splitBySpace.length - 1] = trans;
                value = splitBySpace.join(" ");
            }
        }
        setFilter(value);
    }

    const handleSearch = () => {
        fetchUsers(currentPage, rows, { "search": filter });
    }

    const handleClear = () => {
        setFilter("");
        fetchUsers(currentPage, rows);
    }

    const header = (
        <>
            <div className="row p-2 align-items-center">
                <div className="col-12 col-md-2">
                    <FormGroup switch className="d-flex justify-content-center align-items-center gap-3">
                        <Label className="m-0 fw-bold">தமிழ்</Label>
                        <Input
                            type="switch"
                            onClick={selectLanguage}
                            checked={language}
                            className="fs-2 ms-1"
                            defaultValue={true}
                        />
                    </FormGroup>
                </div>
                <div className="col-12 col-md-7 ">
                    <div className="row align-items-center ps-1 mt-2">
                        <div className="col-8 col-md-6">
                            <form className="">
                                <Input type="text" id="search" name="search" onChange={handleFilter} value={filter} placeholder="Filter by Name, Mobile Number, or Member Id" />
                            </form>
                        </div>
                        <div className="col-4 col-md-6  d-sm-flex text-end">
                            <Button type="button" onClick={handleSearch} className="btn-success"><span className="mdi mdi-magnify"></span></Button>
                            <Button type="button" onClick={handleClear} className="btn-secondary ms-1"><span className="mdi mdi-close"></span></Button>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-3">
                    <div className="d-flex ">
                        <div className="ms-auto d-flex align-items-center gap-2 center-button">
                            <Link to={`/users/add`} className="">
                                <button className="btn btn-primary btn-block ms-auto " type="button"><span className="mdi mdi-plus fs-5 me-2"></span>புதிய சேரக்கை</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );


    return (
        <>
            {showLoader && <Loader />}
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <Link>
                        <Breadcrumb  title="டேஷ்போர்டு" to="/users" breadcrumbItem="குடும்பங்கள்" />
                        </Link>
                        
                        <div className="card atatable-container">
                            <DataTable
                                value={users}
                                header={header}
                                // scrollable
                                // minHeight="600px"
                                // d
                                scrollable scrollHeight="600px"
                                className=""
                            >
                                <Column field="image" body={(rowData) => getImage(rowData)}
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
                                    body={(rowData) => {
                                        const formattedDate = rowData.receipt_date ? moment(rowData.receipt_date).format("DD/MM/YYYY") : "";
                                        return formattedDate;
                                    }}
                                ></Column>
                                <Column field="mobile_number" sortable header=" அலைபேசி எண்" ></Column>
                                <Column field="current_address" header=" முகவரி"></Column>
                                {/* <Column field="country" sortable header=" நாடு"></Column>
                                <Column field="state" sortable header=" மாநிலம்"></Column>
                                <Column field="district" sortable header=" மாவட்டம்"></Column>
                                <Column field="taluk" sortable header="வட்டம்"></Column>
                                <Column field="panchayat" sortable header="பஞ்சாயத்து"></Column> */}
                                <Column field="actions" header="Action" body={actionItems}></Column>
                            </DataTable>
                            <div className="card">
                                <Paginator first={first} rows={rows} totalRecords={totalRows} rowsPerPageOptions={[25, 50, 75, 100]} onPageChange={handlePageChange} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default UsersListTable;