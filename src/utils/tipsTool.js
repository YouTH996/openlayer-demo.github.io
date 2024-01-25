import { ScaleLine,MousePosition } from "ol/control";
import { createStringXY } from "ol/coordinate";
/**
 * 鼠标在地图上的经纬度
 * @param {*} map  地图参数
 * @param {*} dom  显示位置鼠标坐标位置DOM
 */
let mousePositionControl = null;

export function addMousePosition(map, dom) {
  removeMousePosition(map);

  mousePositionControl = new MousePosition({
    coordinateFormat: function (e) {
      const stringifyFunc = createStringXY(4);
      const str = stringifyFunc(e);
      return `经度:${str.split(",")[0]}  | 纬度:${str.split(",")[1]} `;
    },
    // 和地图坐标系保持一致
    projection: "EPSG:4326",
    // css类名
    className: "custom-mouse-position",
    // 显示位置鼠标坐标位置DOM
    target: document.getElementById(dom),
  });
  // // 添加控制控件到地图上即可
  map.addControl(mousePositionControl);
}

/**
 * @param {*} map  地图参数
 */
function removeMousePosition(map) {
  if (mousePositionControl) {
    map.removeControl(mousePositionControl);
    mousePositionControl = null;
  }
}


/**
 * 比例尺
 *@param {*} map  地图参数
 *@param {*} dom  显示比例尺的Dom
 **/
export function addScale(map, dom) {
  let scaleControl = new ScaleLine({
    units: "nautical", // 单位有5种：degrees imperial us nautical metric
    target: document.getElementById(dom), // 显示比例尺的Dom
  });
  // 添加控件到地图
  map.addControl(scaleControl);
  return scaleControl;
}
