import BOTCheckbox from '../components/presentational/BOTCheckbox'
import BOTPagination from '../components/presentational/BOTPagination'

const styleConfig = {
    reactSelect: {
        option: (provided, state) => ({
            ...provided,
            padding: '0.5rem',
            fontSize: '1rem',
        }),
        valueContainer: (provided) => ({
            ...provided,
            position: 'static',
            color: 'red'
        }),
        indicatorsContainer: (provided) => ({
            ...provided,
            // height: 30
        }),
        menu: (provided) => ({
            ...provided,
            padding: 0
        }),
        control: (provided) => ({
            ...provided,
            fontSize: '1rem',
            // minHeight: 1,
            height:  'calc(1.75rem + 2px)',
            position: 'none',

        }),
        singleValue: (provided) => ({
            ...provided,

            maxWidth: 'calc(90% - 8px)'
        }),
    },
    reactTable: {

        getTdProps: () => {
            return {
                style: {
                    borderRight: 'none',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'black',
                    minHeight: '3rem',
                    height: '3rem'
                }
            }
        },

        getTheadThProps: () => {
            return {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    borderRight: 'none',
                    textAlign: 'left',
                    fontSize: '0.8rem',
                    minHeight: '2.5rem',
                    fontWeight: 500,
                    color: 'black',
                    // backgroundColor: '#80808014',
                    // boxShadow: 'rgba(32, 33, 36, 0.28) 0px 0px 0px 0px',                    
                }
            }
        },
        getProps: () => {
            return {
                style: {
                    // border: 'none',
                    // borderTop: '1px solid #cec7c7',
                }
            }
        },

        getTheadProps: () => {
            return {
                style: {
                    // boxShadow: 'rgba(32, 33, 36, 0.28) 0px 0px 0px 0px',
                    // height: '1rem'
                }
            }
        },

        SelectAllInputComponent: BOTCheckbox,

        SelectInputComponent: BOTCheckbox,

        // PaginationComponent: BOTPagination,

        // showPagination: false

    },
    checkbox: {
        fontSize: '0.9rem'
    },
    radioButton: {
        fontSize: '0.9rem'
    },
    link: {
        color: '#1890ff'
    },
}

export default styleConfig