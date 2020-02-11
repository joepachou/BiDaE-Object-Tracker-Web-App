const styleConfig = {
    reactSelect: {
        option: (provided, state) => ({
            ...provided,
            padding: '0.5rem',
            fontSize: '0.8rem',
        }),
        valueContainer: (provided) => ({
            ...provided,
            position: 'static',
            color: 'red'
        }),
        indicatorsContainer: (provided) => ({
            ...provided,
            height: 30
        }),
        menu: (provided) => ({
            ...provided,
            padding: 0
        }),
        control: (provided) => ({
            ...provided,
            fontSize: '0.8rem',
            minHeight: 1,
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
                    fontSize: '0.9rem'
                }
            }
        },

        getTheadThProps: () => {
            return {
                style: {
                    borderRight: 'none',
                    textAlign: 'left',
                    fontSize: '0.9rem',
                    // fontWeight: 500
                }
            }
        },
        getProps: () => {
            return {
                style: {
                    border: 'none',
                }
            }
        },

        getTheadProps: () => {
            return {
                style: {
                    boxShadow: 'rgba(32, 33, 36, 0.28) 0px 1px 6px 0px',
                }
            }
        },

        showPagination: false

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