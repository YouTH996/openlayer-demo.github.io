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

export function getXyzLayer(url) {
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

export function createStyle({name, sog, cog, hasSelected}) {
  let styleArray = []
  let pointStyle = new Style({
    // 设置图片效果
    image: new Icon({
      img: getShipCanvas("rgb(0, 255, 0)", "rgb(0, 255, 0)"),
      anchor: [0.3, 0.3],
      scale: 1 / window.devicePixelRatio,
      opacity: 0.8,
      imgSize: [canvas.width, canvas.height],
      rotation: Math.PI + Math.PI / (180 / cog),
    }),
    zIndex: 99,
  });

  styleArray = [pointStyle, lableStyle(name, cog)]
  if (hasSelected) {
    styleArray.push(selectStyle(25))
  }
  return styleArray;
}

//标签样式
export function lableStyle(name, cog) {
  let {textAlign, offsetX, offsetY, rotation} = getLabelDirection(cog)
  return new Style({
    image: new RegularShape({
      points: 2,
      radius: 15,
      displacement: [0, 15],
      rotation: (rotation * Math.PI) / 180,
      stroke: new Stroke({
        color: "rgb(0,0,0)",
      }),
    }),
    text: new Text({
      font: '10px sans-serif',
      textAlign: textAlign,
      justify: 'left',
      text: name,
      offsetX: offsetX,
      offsetY: offsetY,
      fill: new Fill({
        color: [29, 55, 76, 1],
      }),
      backgroundFill: new Fill({
        color: [244, 251, 255, 0.6],
      }),
      padding: [2, 2, 2, 2],
    }),
  });
}

//根据航向设置label的方向
function getLabelDirection(cog = 0) {
  let textAlign, offsetX, offsetY, rotation
  if (cog >= 90 && cog < 180) {
    textAlign = "left"
    offsetX = 25
    offsetY = 25
    rotation = 135
  } else if (cog >= 180 && cog < 270) {
    textAlign = "right"
    offsetX = -25
    offsetY = 25
    rotation = 225
  } else if (cog >= 270 && cog < 360) {
    textAlign = "right"
    offsetX = -25
    offsetY = -25
    rotation = 315
  } else {
    textAlign = "left"
    offsetX = 25
    offsetY = -25
    rotation = 45
  }
  return {textAlign, offsetX, offsetY, rotation}
}

//船舶选中样式
export function selectStyle(size = 25) {
  let longRadius = size * Math.SQRT2;
  return new Style({
    image: new RegularShape({
      points: 4,
      radius: size,
      angle: Math.PI / (180 / 45),
      stroke: new Stroke({
        color: "red",
        lineCap: "square",
        lineJoin: "miter",
        lineDash: [
          (longRadius * 3) / 10,
          (longRadius * 4) / 10,
          (longRadius * 3) / 10,
          0,
        ],
      }),
    }),
    zIndex: 99999999999999,
  });
}

export function createNoLabelStyle({name, sog, cog}) {
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
  styleArray = [pointStyle]
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
  let minPosStr = newList[0][0] + "," + newList[0][1]
  let maxPosStr = newList[1][0] + "," + newList[1][1]
  return {minPosStr, maxPosStr}

}
