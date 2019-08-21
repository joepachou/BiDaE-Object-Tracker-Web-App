import React from 'react';


const Checkbox = ({
    field: { name, value, onChange, onBlur },
    form: { errors, touched, setFieldValue },
    id,
    label,
    // className,
    ...props
}) => {
    return (
        <div>
            <input
                name={name}
                id={id}
                type="checkbox"
                value={value}
                checked={value}
                onChange={onChange}
                onBlur={onBlur}
                // className={classNames("radio-button")}
            />
            <label htmlFor={id} className="pl-2">
                {label}
            </label>
            {touched[name] && <InputFeedback error={errors[name]} />}
        </div>
    );
};

export default Checkbox;