import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Breadcrumb from "components/Common/Breadcrumb";
import { Link } from "react-router-dom";
import { GET } from "helpers/api_helper";
import { CASES_URL } from "helpers/url_helper";
import { ToastContainer } from 'react-toastify';
import CustomToast from "components/Common/Toast";
import 'react-toastify/dist/ReactToastify.css';
import { DataTableCustomStyles } from "constants/constants";

function CaseViewTable() {
    const [data, setCaseList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [rowCount, setCount] = useState(20);
    
    const columns = [
        {
            name: 'CNR No',
            selector: row => row.cnr_number,
            sortable: true,
            sortField: "cnr_number",
            button: true,
            cell: row => <Link to={`/cases-view/${row.case_number}`}>{row.cnr_number}</Link>,
        },
        {
            name: 'Case Type',
            selector: row => row.type,
            sortable: true,
            wrap: true,
            sortField: "type",

        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            wrap: true,
            sortField: "status",

        },
        {
            name: 'Court Name',
            selector: row => row.court_name,
            sortable: true,
            wrap: true,
            sortField: "court_name",
        },
        {
            name: 'Court Complex',
            selector: row => row.court_complex,
            sortable: true,
            wrap: true,
            sortField: "court_complex",
        },
        {
            name: 'Reg No',
            selector: row => row.registration_number,
            sortable: false,
        },
        {
            name: 'For Name',
            selector: row => row.for_name,
            sortable: true,
            sortField: "for_name"

        },
        {
            name: 'Against Name',
            selector: row => row.against_name,
            sortable: true,
            sortField: "against_name"
        },
        {
            name: 'Summary',
            selector: row => <div className="d-flex gap-2">
                <Link to={`/case/${row.case_number}/summary-add`}><i className="fas fa-plus-square fs-4" title="Add Summary"></i></Link>
                <Link to={`/case/${row.case_number}/summary-list`}><i className="fas fa-list fs-4" title="List Summary"></i></Link>
                </div>,
            sortable: false,
            minWidth: 10
        },
    ];
    

    const fetchCases = async(page, count=rowCount, additiotal_params={}) => {
        setLoading(true);
        let query_params = {
            page: page,
            count: count
        }
        query_params = {...query_params, ...additiotal_params}
        let url = CASES_URL +  "?" + new URLSearchParams(query_params).toString();
        const response = await GET(url);
        if (response.status === 200) {
            console.log(response)
            setCaseList(response.data.data);
            setTotalRows(response.total_count);
            setLoading(false);
        }
        else {
            setLoading(false);
            CustomToast(response.data.message, "error");
        }
    }

    const handlePageChange = page => {
        fetchCases(page);
    }

    const handlePerRowChange = async (count, page) => {
        fetchCases(page, count);
        setCount(count);
    }

    const handleSort = async (column, sortDirection) => {
        console.log(column);
        let params = {
            sort_by: column.sortField,
            order_by: sortDirection
        }
        fetchCases(1, rowCount, params);
    };

    useEffect(() => {
        fetchCases(1);
    }, []);


    return (
        <div className="page-content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12 mb-5">
                        <div>
                        <Breadcrumb title="Home" breadcrumbItem="cases"/>
                        </div>
                        <div className=" d-flex mb-3">
                           <Link to="/cases-add" className="ms-auto">
                            <button type="button" className="btn btn-success " ><span className="mdi mdi-plus"></span>Add new case</button>
                            </Link>
                        </div>
                        
                        <DataTable
                            columns={columns}
                            data={data}
                            progressPending={loading}
                            pagination
                            paginationServer
                            paginationTotalRows={totalRows}
                            onChangeRowsPerPage={handlePerRowChange}
                            onChangePage={handlePageChange}
                            sortServer
                            onSort={handleSort}
                            highlightOnHover
                            isSearchable={true}
                            persistTableHead
                            // customStyles={DataTableCustomStyles}
                        // fixedHeaderScrollHeight="450px"
                        />
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </div>
    );
};
export default CaseViewTable;