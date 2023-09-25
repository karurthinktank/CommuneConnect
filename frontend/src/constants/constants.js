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

export const COUNTRY_LIST = ['இந்தியா'];

export const STATE_LIST = ['தமிழ்நாடு'];

export const DISTRICT_LIST = ['அரியலூர்', 'ஈரோடு', 'உதகமண்டலம்', 'கடலூர்', 'கரூர்', 'கள்ளக்குறிச்சி', 'காஞ்சிபுரம்', 'கிருஷ்ணகிரி', 'கோயம்புத்தூர்', 'சிவகங்கை', 
'செங்கல்பட்டு','சென்னை','சேலம்','தஞ்சாவூர்','தர்மபுரி','திண்டுக்கல்','திருச்சி','திருநெல்வேலி','திருப்பத்தூர்','திருப்பூர்','திருவண்ணாமலை',
'திருவள்ளூர்','திருவாரூர்2','தூத்துக்குடி','தென்காசி','தேனி','நாகப்படடினம்','நாகர்கோயில்','நாமக்கல்','புதுக்கோட்டை','பெரம்பலூர்',
'மதுரை','மயிலாடுதுறை','ராணிப்பேட்டை','ராமநாதபுரம்','விருதுநகர்','விழுப்புரம்','வேலூர்']