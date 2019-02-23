import { UPDATE_MENU_OPTION } from './actionType';

export const updateMenuOption = (value) => {
    return {
        action: UPDATE_MENU_OPTION,
        value: value
    }
}