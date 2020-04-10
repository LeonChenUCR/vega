import { stringValue } from "vega-util";
import { Top, Bottom, Left } from "./constants";

export function ifXAxisExpr(signalExpr, ifXAxis, otherwise) {
  var ifXAxisStr = stringValue(ifXAxis);
  var otherwiseStr = stringValue(otherwise);
  return {
    signal: `${isXAxisExpr(signalExpr)} ? (${ifXAxisStr}) : (${otherwiseStr})`
  }
}
  
export function isXAxisExpr(signalExpr, isXAxis = true) {
  return `${isXAxis ? '' : '!'}((${signalExpr}) === "${Top}" || (${signalExpr}) === "${Bottom}")`
}

export function axisOrientExpr(signalExpr, top, bottom, left, right) {
  var topStr = stringValue(top);
  var bottomStr = stringValue(bottom);
  var leftStr = stringValue(left);
  var rightStr = stringValue(right);

  return {
    signal: `(${signalExpr}) === "${Top}" ? (${topStr}) : (${signalExpr}) === "${Bottom}" ? (${bottomStr}) : (${signalExpr}) === "${Left}" ? (${leftStr}) : (${rightStr})`
  }
}

export function ifTopOrLeftAxisExpr(signalExpr, ifTopOrLeft, otherwise) {
  var ifTopOrLeftStr = stringValue(ifTopOrLeft);
  var otherwiseStr = stringValue(otherwise);
  return {
    signal: `(${signalExpr}) === "${Top}" || (${signalExpr}) === "${Left}" ? (${ifTopOrLeftStr}) : (${otherwiseStr})`
  }
}
 
export function isXAxisConditionalEncoding(signalExpr, ifXAxis, otherwise, isXAxis = true) {
  return [
    {
      test: isXAxisExpr(signalExpr, isXAxis),
      ...ifXAxis
    },
    otherwise ? {
      ...otherwise
    } : undefined
  ]
}