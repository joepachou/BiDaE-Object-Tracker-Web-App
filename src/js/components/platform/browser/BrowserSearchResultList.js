import React from 'react';
import { AppContext } from '../../../context/AppContext'
import { 
    Button,
    Col, 
    Row, 
} from 'react-bootstrap';
import ScrollArea from 'react-scrollbar';
import AccessControl from '../../presentational/AccessControl';
import SearchResultListGroup from '../../presentational/SearchResultListGroup'

export default class BrowserSearchResultList extends React.Component {

    static contextType = AppContext

    state = {
        showEditObjectForm: false,
        showSignatureForm:false,
        showConfirmForm: false,
        selectedObjectData: [],
        showNotFoundResult: false,
        showPatientResult: false,
        selection: [],
        editedObjectPackage: [],
        showAddDevice: false,
        showDownloadPdfRequest: false,
        showPath: false,
        signatureName:'',
        showPatientView: false,
    }

    render() {
        const { locale } = this.context;
        const { 
            searchKey,
            searchResult,
            title,
            selection,
            handleToggleNotFound,
            showNotFoundResult,
            onSelect
        } = this.props;
        
        const style = {
            noResultDiv: {
                color: 'grey',
                fontSize: '1rem',
            },
            titleText: {
                color: 'rgb(80, 80, 80, 0.9)',
            }, 
            downloadPdfRequest: {
                zIndex: 3000,
                top: '30%',
                right: 'auto',
                bottom: 'auto',
                padding: 0,
            },
            searchResultListForMobile: {
                maxHeight: this.props.showMobileMap ? '35vh' : '65vh',
                dispaly: this.props.searchKey ? null : 'none',
            },
            searchResultListForTablet: {
                dispaly: this.props.searchKey ? null : 'none',
                maxHeight: '28vh'
            }
        }
        

        return (
            <div>
                <Row className='d-flex justify-content-center' style={style.titleText}>
                    <div className='title'>
                        {title}
                    </div>
                </Row>
                <Row>
                    {searchResult.length == 0 
                        ?   <Col className='d-flex justify-content-center font-weight-lighter' style={style.noResultDiv}>
                                <div className='searchResultForDestop'>{locale.texts.NO_RESULT}</div>
                            </Col> 
                        :   
                            <Col className="searchResultListGroup d-flex justify-content-center">
                                <ScrollArea 
                                    smoothScrolling={true}
                                    horizontal={false}
                                >                 
                                    <AccessControl
                                        permission={'form:edit'}
                                        renderNoAccess={() => (
                                            <SearchResultListGroup 
                                                data={searchResult}
                                                selection={selection}
                                            />
                                        )}
                                    >
                                        <SearchResultListGroup 
                                            data={searchResult}
                                            onSelect={onSelect}
                                            selection={selection}
                                            action
                                        />

                                    </AccessControl>
                                </ScrollArea>
                            </Col>
                    }
                </Row>
                <Row className='d-flex justify-content-center mt-3'>
                    <Button
                        variant="link"
                        onClick={handleToggleNotFound}
                        size="lg"
                        disabled={false}
                    >
                        {this.props.showNotFoundResult
                            ? locale.texts.SHOW_SEARCH_RESULTS_FOUND
                            : locale.texts.SHOW_SEARCH_RESULTS_NOT_FOUND
                        }
                    </Button>
                </Row>
            </div>
        )
    }
}

