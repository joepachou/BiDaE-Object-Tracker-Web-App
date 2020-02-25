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
   display = true,
   className, 
   value
}) => {
    let style = {
        container: {
            display: display ? null : 'none',
        },
        
        error: {
            color: "#dc3545"
        }
    }
    return (
        <div 
            className={`form-group mb-3 ${className}`}
            style={style.container}
        >
            <small 
                className="form-text text-muted text-capitaliz"
            >
                {label}
            </small>
            {component 
                ?   component()
                :   (
                        value ?
                            <Field  
                                name={name} 
                                type={type} 
                                value={value}
                                className={'form-control' + (error ? ' is-invalid' : '')} 
                                placeholder={placeholder}
                                disabled={disabled}
                            />
                        :
                            <Field  
                                name={name} 
                                type={type} 
                                className={'form-control' + (error ? ' is-invalid' : '')} 
                                placeholder={placeholder}
                                disabled={disabled}
                            />
                    )
            }
            {error && touched && 
                <small 
                    className="form-text text-capitaliz"
                    style={style.error}
                >
                    {error}
                </small>
            }
        </div>
    );
};

export default FormikFormGroup;