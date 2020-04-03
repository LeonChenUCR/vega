import {Top, Bottom, Left} from './constants';
import {extend} from 'vega-util';
import { isSignal } from '../../util';
import { isNumber } from 'util';

export function topOrBottomAxisExpr(signalExpr, topOrBottom, otherwise) {
  /* eslint-disable no-console */
  // console.log(topOrBottom);
  // console.log(otherwise);

  var topOrBottomStr = isNumber(topOrBottom) ? `${topOrBottom}` : `"${topOrBottom}"`;
  var otherwiseStr = isNumber(otherwise) ? `${otherwise}` : `"${otherwise}"`;
  return {
    signal: `${signalExpr} === "${Top}" || ${signalExpr} === "${Bottom}" ? ${topOrBottomStr} : ${otherwiseStr}`
  }
}

export function axisOrientExpr(signalExpr, top, bottom, left, right) {
  var topStr = isNumber(top) ? `${top}` : `"${top}"`;
  var bottomStr = isNumber(bottom) ? `${bottom}` : `"${bottom}"`;
  var leftStr = isNumber(left) ? `${left}` : `"${left}"`;
  var rightStr = isNumber(right) ? `${right}` : `"${right}"`;

  return {
    signal: `${signalExpr} === "${Top}" ? ${topStr} : ${signalExpr} === "${Bottom}" ? ${bottomStr} : ${signalExpr} === "${Left}" ? ${leftStr} : ${rightStr}`
  }
}

export function topOrLeftAxisExpr(signalExpr, topOrLeft, otherwise) {
  var topOrLeftStr = isNumber(topOrLeft) ? `${topOrLeft}` : `"${topOrLeft}"`;
  var otherwiseStr = isNumber(otherwise) ? `${otherwise}` : `"${otherwise}"`;

  return {
    signal: `${signalExpr} === "${Top}" || ${signalExpr} === "${Left}" ? ${topOrLeftStr} : ${otherwiseStr}`
  }
}

export default function(spec, scope) {
  var config = scope.config,
      orient = spec.orient,
      xy,
      or,
      band;

  if (isSignal(spec.orient)) {
    var axisXYConfigKeys = new Set(Object.keys(config.axisX || {}).concat(Object.keys(config.axisY || {}))),
      axisOrientConfigKeys = new Set(Object.keys(config.axisTop || {}).concat(Object.keys(config.axisBottom || {}).concat(Object.keys(config.axisLeft || {}).concat(Object.keys(config.axisRight ||{})))));

  
    xy = {};
    for (var prop of axisXYConfigKeys) {
      xy[prop] = topOrBottomAxisExpr(spec.orient.signal, config.axisX ? config.axisX[prop] : undefined, config.axisY ? config.axisY[prop] : undefined);
    }

    or = {};
    for (prop of axisOrientConfigKeys) {
      or[prop] = axisOrientExpr(spec.orient.signal, config.axisTop ? config.axisTop[prop] : undefined, config.axisBottom ? config.axisBottom[prop] : undefined, config.axisLeft ? config.axisLeft[prop] : undefined, config.axisRight ? config.axisRight[prop] : undefined);
    }
  } else {
    xy = (orient === Top || orient === Bottom) ? config.axisX : config.axisY;
    or = config['axis' + orient[0].toUpperCase() + orient.slice(1)];
  }

  band = scope.scaleType(spec.scale) === 'band' && config.axisBand;

  return (xy || or || band)
    ? extend({}, config.axis, xy, or, band)
    : config.axis;
}