import styled from 'styled-components';
import Item from 'react-bootstrap/ListGroupItem';
import Link from 'react-bootstrap/NavLink'
import styleSheet from './styleSheet'
import Button from 'react-bootstrap/Button'

export const EditedTime = styled.div`
    font-size: 0.8em;
    display: flex;
    align-items: flex-end;
    padding-left: 5px;
    color: #999;
`;

export const Primary = styled.div`
    font-size: 1em;
    font-weight: 600;
    color: black;
`

export const Paragraph = styled.p`
    text-align: justify;
    text-justify:inter-ideograph;
    color: black;
`

export const FormFieldName = styled.div`
    color: black;
    font-size: .8rem;
    margin-bottom: 5px;
`

export const PageTitle = styled.div`
    color: black;
    font-size: 1.4rem;
    font-weight: 450;
    text-transform: capitalize;
`

export const BOTContainer = styled.div`
    margin: 20px 20px;
`

export const BOTSideNav = styled(Item)`
    font-size: 1rem;
    font-weight: 500;
    text-transform: capitalize;
    display: flex;
    justify-content: center;
    height: 2.5rem;
    letter-spacing: 1.2px;
    border-radius: 5px;
    color: ${styleSheet.lightGrey};
    &:hover {
        color: ${styleSheet.theme};
    }
    &:active {
        color: ${styleSheet.theme};
    }
    &.active {
        color: ${styleSheet.theme};
    }
`

export const BOTNavLink = styled(Link)`
    font-weight: 500;
    text-transform: capitalize;
    color: ${styleSheet.lightGrey};
    &.active {
        color: ${styleSheet.theme};
        border-bottom: 3px solid ${styleSheet.theme};
        border-radius: 0px;
    }
`

export const LoaderWrapper = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgb(255,255,255,0.8);
`

export const PrimaryButton = styled(Button)`
    font-size: 1rem;
    padding: 0.375rem 0.5rem;
    height: 2.5rem;
    letter-spacing: 1px;
    text-transform: capitalize;
    margin: 0 .2rem;
`