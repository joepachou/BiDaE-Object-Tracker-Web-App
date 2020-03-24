/**
 * Area modules for specific site.
 * Follow the steps below to create your area modules.
 * 
 * 1. Place your area map image in the folder named map located in /site_module/img.
 * 2. Import the area map image from the folder. The image name should include extension.
 * 3. Set the modules as the example below. 
 */

import IIS_SINICA_FOURTH_FLOORTH_MAP from "../site_module/img/map/iis_new_building_fourth_floor.png";

const siteConfig = {

    areaModules: {

        /** The key must be as same as the field name in area_table in database */
        IIS_SINICA_FOURTH_FLOOR: {

            /** The id would be the field id in area_table */
            id: 2,

            /** The name would be the field name in area_table  */
            name: "IIS_SINICA_FOURTH_FLOOR",

            /** Flag the area if there is map image of this area in the map folder 
             *  Set false if the mag image is not ready
            */
            hasMap: false,

            /** The source of the area map. It can put NULL if the map image is not ready */
            url: IIS_SINICA_FOURTH_FLOORTH_MAP,

            /** The relative value of latitude and longitude of the area
             *  The elements would be the points of left-bottom and right-upper, respectively. */
            bounds: [[0,0], [21130,35710]],
        },

        /** Your area modules */
    },

}

export default siteConfig