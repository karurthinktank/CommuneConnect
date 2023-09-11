import React, { useState, useEffect } from "react";
import Breadcrumb from "components/Common/Breadcrumb";
import { Link } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProductService } from "./data";
import { Tag } from 'primereact/tag';
function UsersListTable() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        ProductService.getProductsMini().then((data) => setProducts(data));
    }, []);

    const statusBodyTemplate = (product) => {
        return <Tag value={product.status} severity={getSeverity(product)}></Tag>;
    };

    const getSeverity = (product) => {
        switch (product.status) {
            case 'Yes':
                return 'success';

            case 'No':
                return 'warning';

            default:
                return null;
        }
    };

    const header = (
        <div className="d-flex flex-wrap align-items-center  gap-2">
            <span className="text-xl text-900 font-bold"></span>

            <button className="btn btn-primary btn-block ms-auto " type="submit"><span className="mdi mdi-plus fs-5 me-2"></span>குடும்ப சேரக்கை</button>
        </div>
    );
    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <Breadcrumb title="User" breadcrumbItem="Uses List" />
                        <div className="card">
                            <DataTable
                                value={products}
                                header={header}
                                paginator
                                rows={5}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                scrollable>

                                <Column field="id" header="Id"></Column>
                                <Column header="Status" sortable body={statusBodyTemplate} ></Column>
                                <Column field="serialnumber" sortable header="இரசீது எண்" ></Column>
                                <Column field="serialdate" sortable header="இரசீது தேதி "></Column>
                                <Column field="familyname" sortable header="குடும்பபெயர் " ></Column>
                                <Column field="address" sortable header=" முகவரி"></Column>
                                <Column field="country" sortable header=" நாடு"></Column>
                                <Column field="state" sortable header=" மாநிலம்"></Column>
                                <Column field="distrcit" sortable header=" மாவட்டம்"></Column>
                                <Column field="Taluk" sortable header="வட்டம்"></Column>
                                <Column field="panchayath" sortable header="பஞ்சாயத்து"></Column>
                                <Column field="mobilenumber" sortable header=" அலைபேசி எண்" alignFrozen="right" frozen></Column>


                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UsersListTable;