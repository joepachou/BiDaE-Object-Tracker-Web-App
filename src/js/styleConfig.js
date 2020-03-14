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
                    fontSize: '1rem',
                    minHeight: '2rem'
                    // fontWeight: 500
                }
            }
        },
        getProps: () => {
            return {
                style: {
                    border: 'none',
                    borderTop: '1px solid #cec7c7',
                }
            }
        },

        getTheadProps: () => {
            return {
                style: {
                    boxShadow: 'rgba(32, 33, 36, 0.28) 0px 1px 6px 0px',
                    // height: '1rem'
                }
            }
        },

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