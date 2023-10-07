import React, { useState, useEffect } from "react";
import Breadcrumb from "components/Common/Breadcrumb";
import { Link } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { GET } from "helpers/api_helper";
import { USER_URL } from "helpers/url_helper";
import "../../assets/scss/_listusers.scss";
import noprofile from '../../assets/images/noprofile.jpg';

function UsersListTable() {
    const [users, setUsers] = useState([]);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(25);
    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const actionItems = (row) => {
        console.log("called");
        return (
            <>
                <div className="fs-2 d-flex gap-2">

                    <Link to={"/users/view/" + row?.member_id}><i className="mdi mdi-eye-circle fs-1" /></Link>
                    <Link to={"/users/edit/" + row?.member_id}><i className="mdi mdi-pencil-circle fs-1 text-secondary" /></Link>
                    <Link><i className="mdi mdi-card-account-details text-success fs-1" /></Link>
                </div>
            </>
        );
    };
    
    useEffect(() => {
        fetchUsers(currentPage);
        
    }, []);

    const fetchUsers = async (page, count = rows, additiotal_params = {}) => {
        let query_params = {
            page: page,
            count: count
        }
        query_params = { ...query_params, ...additiotal_params }
        let url = USER_URL + "?" + new URLSearchParams(query_params).toString();
        const response = await GET(url);
        console.log(response);
        if (response.status === 200) {
            setUsers(response.data.data);
            setTotalRows(response.total_count);
        }
        else {
            // setLoading(false);
        }
    }

    const handlePageChange = (event) => {
        let page = event.page + 1;
        setFirst(event.first);
        setRows(event.rows);
        setCurrentPage(page);
        fetchUsers(page, event.rows)
    };
    const getImage = ()=>{
        return<img src={noprofile} className="shadow-2 border-round" style={{width:"80px"}}/>
    }

    const header = (
        <div className="d-flex flex-wrap align-items-center  gap-2">
            <span className="text-xl text-900 font-bold"></span>
            <Link to={`/users/add`} className="ms-auto">
                <button className="btn btn-primary btn-block ms-auto " type="button"><span className="mdi mdi-plus fs-5 me-2"></span>குடும்ப சேரக்கை</button>
            </Link>

        </div>
    );


    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <Breadcrumb title="User" breadcrumbItem="Family Members" />
                        <div className="card">
                            <DataTable
                                value={users}
                                header={header}
                                scrollable>
                                <Column field="image" sortable body={getImage}header="குடும்ப தலைவர் புகைப்படம்" ></Column>
                                <Column
                                    field="name"
                                    header="குடும்ப தலைவர் பெயர் "
                                    body={(rowData) => (
                                        <td className={rowData.is_card_mapped ? 'green-cell' : 'red-cell'}>
                                            {rowData.name}
                                        </td>
                                    )}
                                ></Column>
                                <Column field="father_or_husband" sortable header="தபெ/கபெ பெயர் " ></Column>
                                <Column field="member_id" sortable header="Member ID " ></Column>
                                <Column field="receipt_no" sortable header="இரசீது எண்" ></Column>
                                <Column field="receipt_date" sortable header="இரசீது தேதி "></Column>
                                <Column field="mobile_number" sortable header=" அலைபேசி எண்" alignFrozen="right" frozen></Column>
                                <Column field="current_address" sortable header=" முகவரி"></Column>
                                <Column field="country" sortable header=" நாடு"></Column>
                                <Column field="state" sortable header=" மாநிலம்"></Column>
                                <Column field="district" sortable header=" மாவட்டம்"></Column>
                                <Column field="taluk" sortable header="வட்டம்"></Column>
                                <Column field="panchayat" sortable header="பஞ்சாயத்து"></Column>
                                <Column field="actions" sortable header="Action" alignFrozen="right" className="custom-border" frozen body={actionItems}></Column>
                            </DataTable>
                            <div className="card">
                                <Paginator first={first} rows={rows} totalRecords={totalRows} rowsPerPageOptions={[25, 50, 75, 100]} onPageChange={handlePageChange} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UsersListTable;