/**
 * AddAllForm is the Modal in ObjectManagementContainer.
 * To increase the input in this form, please add the following code
 * 1. Creat the state of the desired input name in constructor and the html content in render function
 * 2. Add the corresponding terms in handleSubmit and handleChange
 * 3. Modify the query_editObject function in queryType
 */
import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { AppContext } from '../../context/AppContext';
import XLSX from "xlsx";
import InputFiles from "react-input-files";

  
class AddAllForm extends React.Component {

    static contextType = AppContext

    state = {
        show: this.props.show,
    };

    /**
     * AddAllForm will update if user selects one of the object table.
     * The selected object data will transfer from ObjectMangentContainer to AddAllForm
     */
    componentDidUpdate = (prevProps) => {
        if (!(_.isEqual(prevProps, this.props))) {
            this.setState({
                show: this.props.show,
            })
        }
    }
  
    handleClose = () => {
        this.props.handleCloseForm()
    }

    handleSubmit = (values) => {
        let formData = new FormData();
        formData.append("file", values.file)
        console.log(formData)
        // axios.post(dataSrc.addBulkObject, formData, {
        //     headers: {
        //         'Content-Type': 'multipart/form-data'
        //     }
        // })
        // .then(res => {
        //     this.handleClose() 
        //     this.handleSubmit()
        // })
        // .catch(err => {
        //     console.log(err)
        // })
    }



    onImportExcel = files => {
        // 獲取上傳的文件對象
        //const { files } = file.target; // 通過FileReader對象讀取文件
        const fileReader = new FileReader();
        //console.log(fileReader);
        for (let index = 0; index < files.length; index++) {
            fileReader.name = files[index].name;
        }
        fileReader.onload = event => {
            try {
                // 判斷上傳檔案的類型 可接受的附檔名
                const validExts = new Array(".xlsx", ".xls");
                const fileExt = event.target.name;
    
                if (fileExt == null) {
                    throw "檔案為空值";
                }
    
                const fileExtlastof = fileExt.substring(fileExt.lastIndexOf("."));
                if (validExts.indexOf(fileExtlastof) == -1) {
                    throw "檔案類型錯誤，可接受的副檔名有：" + validExts.toString();
                }
    
                const { result } = event.target; // 以二進制流方式讀取得到整份excel表格對象
                const workbook = XLSX.read(result, { type: "binary" });
                let data = []; // 存儲獲取到的數據 // 遍歷每張工作表進行讀取（這裡默認只讀取第一張表）
                for (const sheet in workbook.Sheets) {
                    if (workbook.Sheets.hasOwnProperty(sheet)) {
                        // 利用 sheet_to_json 方法將 excel 轉成 json 數據
                        data = data.concat(
                            XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
                        ); // break; // 如果只取第一張表，就取消註釋這行
                    }
                }
                console.log(data);
            } catch (e) {
                // 這裡可以拋出文件類型錯誤不正確的相關提示
                alert(e);
                //console.log("文件類型不正確");
                return;
            }
        }; // 以二進制方式打開文件
        fileReader.readAsBinaryString(files[0]);
    };





    render() {
        const { locale } = this.context

        return (
            <Modal 
                show={this.state.show}  
                onHide={this.handleClose} 
                className='text-capitalize'
                size="sm" 
            >
                <Modal.Header 
                    closeButton
                >
                  {'只吃.xls跟.xlsx 別亂傳'}
                </Modal.Header>
                <Modal.Body>
                    <Formik     
                        initialValues={{ 
                            file: null 
                        }}

                        onSubmit={(values) => {
                            this.handleSubmit(values)
                        }}    
                        render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                            <Form>
                              

                                
                                <InputFiles accept=".xlsx, .xls" onChange={this.onImportExcel}>
                                    <button className="btn btn-primary">
                                    Upload
                                    </button>
                                </InputFiles>



                                <Modal.Footer className='d-flex bd-highlight'>
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={this.closeModifyUserInfo}
                                        className='text-capitalize'
                                    >
                                        {locale.texts.CANCEL}
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        variant="primary" 
                                        disabled={isSubmitting}
                                        className='text-capitalize'
                                    >
                                        {locale.texts.SEND}
                                    </Button>                
                                </Modal.Footer>
                            </Form>
                        )}
                    />           
                </Modal.Body>
            </Modal>
        );
    }
}
  
export default AddAllForm;