export const DataTableCustomStyles = {
    rows: {
        style: {
            minHeight: '45px', // override the row height
        },
    },
    headCells: {
        style: {
            backgroundColor: 'rgba(0, 0, 0, 0.03)',
            color: '#000000',
            fontSize: '13px'

        },
    },
    cells: {
        style: {
            fontSize: '12px',
            // border:'1px solid #EBECEC',

        },
    },
    table: {
        style: {
             border: '1px solid #dee2e6',
           
        },
    },

    pagination: {
        style: {
            fontSize: '14px',
            color: '#4E6B7C',
            fontWeight: '450',
            border: '1px solid #dee2e6',

        },
    },
    expanderCell: {
        style: {
            flex: '0 0 48px',
        },
    },

};

export const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const mobileRegExp = /^(\d{10})?$/;

export const urlRegExp = /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
