import React, { useState, useEffect } from "react";
import { useParams } from 'react-router';
import DataTable from "react-data-table-component";
import Breadcrumb from "components/Common/Breadcrumb";
import { Link } from "react-router-dom";
import { GET } from "helpers/api_helper";
import { SUMMARY_URL } from "helpers/url_helper";
import { ToastContainer } from 'react-toastify';
import CustomToast from "components/Common/Toast";
import 'react-toastify/dist/ReactToastify.css';
import { DataTableCustomStyles } from "constants/constants";

function ListSummary() {
    const {id} = useParams();
    console.log(id);
    const [data, setSummaryList] = useState([]);
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
            name: 'Summary Number',
            selector: row => row.summary_number,
            sortable: true,
            sortField: "summary_number",

        },
        {
            name: 'Summar Date',
            selector: row => row.summary_date,
            sortable: true,
            sortField: "summary_date",

        },
        {
            name: 'Next Hearing Date',
            selector: row => row.next_hearing_date,
            sortable: true,
            sortField: "next_hearing_date",
        },
        {
            name: 'Description',
            selector: row => row.description,
            sortable: false,
            wrap: true,
        },
        {
            name: 'Purpose Of Hearing',
            selector: row => row.purpose_of_hearing,
            sortable: false,
        }
    ];
    

    const fetchCases = async(page, count=rowCount, additiotal_params={}) => {
        setLoading(true);
        let query_params = {
            page: page,
            count: count
        }
        query_params = {...query_params, ...additiotal_params}
        let url = SUMMARY_URL.replace(":case", id);
        url = url +  "?" + new URLSearchParams(query_params).toString();
        const response = await GET(url);
        if (response.status === 200) {
            console.log(response)
            setSummaryList(response.data.data);
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
                           <Link to={`/case/${id}/summary-add`} className="ms-auto">
                            <button type="button" className="btn btn-success " ><span className="mdi mdi-plus"></span>Add Summary</button>
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
export default ListSummary;