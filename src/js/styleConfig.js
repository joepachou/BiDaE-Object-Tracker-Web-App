const styleConfig = {
    reactSelect: {
        option: (provided, state) => ({
            ...provided,
            padding: '0.5rem',
            fontSize: '0.8rem',
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
        menuList: (provided) => ({
            ...provided,
        }),
        control: (provided) => ({
            ...provided,
            fontSize: '0.8rem',
            minHeight: 1,
            height:  'calc(1.75rem + 2px)',
            position: 'none',

        }),

    }
}

export default styleConfig