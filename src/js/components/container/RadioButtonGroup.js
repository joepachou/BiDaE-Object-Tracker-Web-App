import React from 'react'

const RadioButtonGroup = ({
    value,
    error,
    touched,
    id,
    label,
    className,
    children
}) => {
    // const classes = classNames(
    // "input-field",
    // {
    //     "is-success": value || (!error && touched), // handle prefilled or user-filled
    //     "is-error": !!error && touched
    // },
    // className
    // );

    return (
        <div>
            <fieldset>
                <label htmlFor="status">{label}</label>
                {children}
                {/* {touched && <InputFeedback error={error} />} */}
            </fieldset>
        </div>
    );
};

export default RadioButtonGroup