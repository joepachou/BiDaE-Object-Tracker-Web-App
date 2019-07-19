import React from 'react'

const RadioButton = ({
    field: { name, value, onChange, onBlur },
    id,
    label,
    className,
    ...props
}) => {
    return (
        <div>
            <input
                name={name}
                id={id}
                type="radio"
                value={id} 
                checked={id === value}
                onChange={onChange}
                onBlur={onBlur}
                {...props}
            />
            <label htmlFor={id} className="pl-2">
                {label}
            </label>
        </div>
    );
};

export default RadioButton;