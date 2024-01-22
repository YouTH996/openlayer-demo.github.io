import {Icon, RegularShape} from "ol/style";
import {Polygon} from "ol/geom";
import {toContext} from "ol/render";
import {Tile as TileLayer} from 'ol/layer.js';
import {
  Fill,
  Stroke,
  Style,
  Text,
} from 'ol/style.js';
import {transform} from "ol/proj";
import {XYZ} from "ol/source";

let canvas;

export function getXyzLayer(url){
  return new TileLayer({
    visible: true,
    preload: Infinity,
    zIndex: -99,
    source: new XYZ({
      url: url
    }),
  });
}

function drawShipBorder(fistColor, render) {
  //绘制外边框
  render.setFillStrokeStyle(
    new Fill({color: fistColor}),
    new Stroke({color: "black", width: 2})
  );
  render.drawPolygon(
    new Polygon([
      [
        [1, 1],
        [11, 1],
        [6, 16],
        [1, 1],
      ],
    ])
  );
}

/**
 * 绘制整个船舶样式
 * @param fistColor 第一种颜色
 * @param render render
 */
function drawSameShip(fistColor, render) {
  //绘制一整个三角形
  render.setFillStrokeStyle(new Fill({color: fistColor}));
  render.drawPolygon(
    new Polygon([
      [
        [1, 1],
        [11, 1],
        [6, 16],
        [1, 1],
      ],
    ])
  );
}

function getShipCanvas(fistColor, sendColor) {
  // 设置三角形canvas
  canvas = document.createElement("canvas");
  canvas.willReadFrequently = true;
  let render = toContext(canvas.getContext("2d"), {size: [25, 25]});
  drawShipBorder(fistColor, render);
  if (fistColor === sendColor) {
    drawSameShip(fistColor, render);
  }
  return canvas;
}

export function createStyle({name, sog, mmsi, cog}) {
  console.log(name);
  console.log(sog);
  console.log(mmsi);
  console.log(cog);
  let styleArray = []
  let pointStyle = new Style({
    // 设置图片效果
    image: new Icon({
      img: getShipCanvas("rgb(0, 255, 0)", "rgb(0, 255, 0)"),
      anchor: [0.3, 0.5],
      scale: 1 / window.devicePixelRatio,
      opacity: 0.8,
      imgSize: [canvas.width, canvas.height],
      rotation: Math.PI + Math.PI / (180 / cog),
    }),
    zIndex: 99,
  });
  let labelStyle = new Style({
    image: new RegularShape({
      points: 2,
      radius: 15,
      displacement: [0, 15],
      rotation: (45 * Math.PI) / 180,
      stroke: new Stroke({
        color: "rgb(0,0,0)",
      }),
    }),
    text: new Text({
      font: '16px sans-serif',
      textAlign: 'left',
      justify: 'left',
      text: name,
      offsetY: -25,
      offsetX: 25,
      fill: new Fill({
        color: [255, 255, 255, 1],
      }),
      backgroundFill: new Fill({
        color: [168, 50, 153, 0.6],
      }),
      padding: [2, 2, 2, 2],
    }),
  });
  styleArray = [pointStyle, labelStyle]
  return styleArray
}


function transformLocation(array, size) {
  let result = [];
  for (let i = 0; i < Math.ceil(array.length / size); i++) {
    let start = i * size;
    let end = start + size;
    result.push(transform(array.slice(start, end), "EPSG:3857", "EPSG:4326"));
  }
  return result;
}

export function getLonLatList(map) {
  let list = map.getView().calculateExtent(map.getSize());
  let newList = transformLocation(list, 2);
  let minPosStr = newList[0][0]+","+newList[0][1]
  let maxPosStr = newList[1][0]+","+newList[1][1]
  return {minPosStr, maxPosStr}

}
