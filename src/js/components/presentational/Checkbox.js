import React from 'react';
import styleConfig from '../../styleConfig'


const Checkbox = ({
    field: { name, value, onChange, onBlur },
    form: { errors, touched, setFieldValue },
    id,
    label,
    ...props
}) => {
    return (
        <div 
            className="pretty p-default p-round p-bigger" 
            style={styleConfig.checkbox}
        >
            <input 
                name={name}
                id={id}
                type="checkbox"
                value={value}
                checked={value}
                onChange={onChange}
                onBlur={onBlur} 
            />
            <div className="state p-primary">
                <label>{label}</label>
            </div>
        </div>
    );
};

export default Checkbox;