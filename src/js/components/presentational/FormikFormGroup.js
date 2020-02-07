import React from 'react';
import { 
    Field, 
    ErrorMessage 
} from 'formik';


const FormikFormGroup = ({
   name = "default",
   label,
   error,
   touched,
   type = 'text',
   disabled,
   placeholder,
   component,
   display = true
}) => {
    let style = {
        display: display ? '' : "none"
    }
    return (
        <div 
            className="form-group"
            style={style}
        >
            <small  className="form-text text-muted">{label}</small>
            {component 
                ?   component()
                :   <Field  
                        name={name} 
                        type={type} 
                        className={'form-control' + (error ? ' is-invalid' : '')} 
                        placeholder={placeholder}
                        disabled={disabled}
                    />
            }
            <ErrorMessage 
                name={name} 
                component="div" 
                className="invalid-feedback" 
            />
        </div>
    );
};

export default FormikFormGroup;