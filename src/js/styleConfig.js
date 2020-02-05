const styleConfig = {
    reactSelect: {
        option: (provided, state) => ({
            ...provided,
            padding: '0.5rem',
            fontSize: '0.8rem',
            // background: state.isSelected ? 'rgba(0, 123, 255, 0.6)' : 'none',
            // background: state.isFocused ? 'rgba(0, 123, 255, 0.6)' : 'none',
            // cursor: 'pointer'
            // height:  20,
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
                    fontSize: '1rem'
                }
            }
        },

        getTheadThProps: () => {
            return {
                style: {
                    borderRight: 'none',
                    textAlign: 'left',
                    fontSize: '1rem'
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
                    boxShadow: 'none',
                }
            }
        },

        showPagination: false

    }
}

export default styleConfig