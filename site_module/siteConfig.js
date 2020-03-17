import IIS_SINICA_FOURTH_FLOORTH_MAP from "../site_module/img/map/iis_new_building_fourth_floor.png";
import NTUH_YUNLIN_WARD_FIVE_B_MAP from "../site_module/img/map/ntuh_yunlin_branch_ward_five_b.png";
import NURSING_HOME_MAP from "../site_module/img/map/nursing_home.png"
import YUANLIN_CHRISTIAN_HOSPITAL_MAP from "../site_module/img/map/yuanlin_christian_hospital.png"
import VETERAN_HOME_FIRST_FLOOR_MAP from "../site_module/img/map/veteran_home_first_floor.png"
import VETERAN_HOME_THIRD_FLOOR_MAP from "../site_module/img/map/veteran_home_third_floor.png"
import NTUH_MAP from "../site_module/img/map/ntuh_map.png"


const siteConfig = {

    areaModules: {

        NTUH_EMERGENCY_ROOM: {
            id: 1,
            name: "NTUH",
            hasMap: 1,
            url: NTUH_MAP,
            bounds: [[0, 0], [33660,57514]],
        },

        IIS_SINICA_FOURTH_FLOOR: {
            id: 2,
            name: "IIS_SINICA_FOURTH_FLOOR",
            hasMap: 0,
            url: IIS_SINICA_FOURTH_FLOORTH_MAP,
            bounds: [[0,0], [21130,35710]],
        },

        NTUH_YUNLIN_WARD_FIVE_B: {
            id: 3,
            name: "NTUH_YUNLIN_WARD_FIVE_B",
            hasMap: 1,
            url: NTUH_YUNLIN_WARD_FIVE_B_MAP,
            bounds: [[0, 0], [26067,36928]],

        },
        NURSING_HOME: {
            id: 4,
            name: "NURSING_HOME",
            hasMap: 1,
            url: NURSING_HOME_MAP,
            bounds: [[0,0], [20000,45000]],
        },
        
        YUANLIN_CHRISTIAN_HOSPITAL: {
            id: 5,
            name: "YUANLIN_CHRISTIAN_HOSPITAL",
            url: YUANLIN_CHRISTIAN_HOSPITAL_MAP,
            bounds: [[0, 0], [27000,27000]],

        },

        VETERAN_HOME_FIRST_FLOOR: {
            id: 6,
            name: "VETERAN_HOME_FIRST_FLOOR",
            url: VETERAN_HOME_FIRST_FLOOR_MAP,
            bounds: [[0,0], [21000,26000]],
        },

        VETERAN_HOME_THIRD_FLOOR: {
            id: 7,
            name: "VETERAN_HOME_THIRD_FLOOR",
            url: VETERAN_HOME_THIRD_FLOOR_MAP,
            bounds: [[0,0], [21000,26000]],
        },
    },

}

export default siteConfig