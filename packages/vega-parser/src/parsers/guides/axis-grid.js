import {Left, Top, Bottom, Value, zero, one} from './constants';
import guideMark from './guide-mark';
import {lookup} from './guide-util';
import {RuleMark} from '../marks/marktypes';
import {AxisGridRole} from '../marks/roles';
import {addEncoders} from '../encode/encode-util';
import {extend, isObject} from 'vega-util';
import { isSignal } from '../../util';
import { topOrLeftAxisExpr, topOrBottomAxisExpr } from './axis-config';

export default function(spec, config, userEncode, dataRef, band) {
  var _ = lookup(spec, config),
      orient = spec.orient,
      vscale = spec.gridScale,
      sign = isSignal(orient) ? topOrLeftAxisExpr(orient.signal, 1, -1) : (orient === Left || orient === Top) ? 1 : -1,
      offset = offsetValue(spec.offset, sign),
      encode, enter, exit, update, tickPos, u, v, v2, s, val;

  encode = {
    enter: enter = {opacity: zero},
    update: update = {opacity: one},
    exit: exit = {opacity: zero}
  };

  addEncoders(encode, {
    stroke:           _('gridColor'),
    strokeDash:       _('gridDash'),
    strokeDashOffset: _('gridDashOffset'),
    strokeOpacity:    _('gridOpacity'),
    strokeWidth:      _('gridWidth')
  });

  tickPos = {
    scale:  spec.scale,
    field:  Value,
    band:   band.band,
    extra:  band.extra,
    offset: band.offset,
    round:  _('tickRound')
  };

  if (isSignal(orient)) {
    val = {}
    for (var key of Object.keys(tickPos)) {
      val[key] = topOrBottomAxisExpr(orient.signal, tickPos[key],)
    }

    update['x'] = enter['x'] = {
      scale: topOrBottomAxisExpr(orient.signal, tickPos.scale, vscale ? vscale : undefined),
      field: topOrBottomAxisExpr(orient.signal, tickPos.field, undefined),
      band: topOrBottomAxisExpr(orient.signal, tickPos.band, undefined),
      extra: topOrBottomAxisExpr(orient.signal, tickPos.extra, undefined),
      offset: topOrBottomAxisExpr(orient.signal, tickPos.offset, offset),
      round: topOrBottomAxisExpr(orient.signal, tickPos.round, undefined),
      range: topOrBottomAxisExpr(orient.signal, undefined, vscale ? 0 : undefined),
      mult: topOrBottomAxisExpr(orient.signal, undefined, vscale ? sign : undefined),
      value: topOrBottomAxisExpr(orient.signal, undefined, vscale ? undefined : 0)
    };

    update['x2'] = enter['x2'] = {
      scale: topOrBottomAxisExpr(orient.signal, tickPos.scale, vscale ? vscale : undefined),
      field: topOrBottomAxisExpr(orient.signal, tickPos.field, undefined),
      band: topOrBottomAxisExpr(orient.signal, tickPos.band, undefined),
      extra: topOrBottomAxisExpr(orient.signal, tickPos.extra, undefined),
      offset: topOrBottomAxisExpr(orient.signal, tickPos.offset, offset),
      round: topOrBottomAxisExpr(orient.signal, tickPos.round, undefined),
      range: topOrBottomAxisExpr(orient.signal, undefined, vscale ? 1 : undefined),
      mult: topOrBottomAxisExpr(orient.signal, undefined, vscale ? sign : undefined),
      signal: topOrBottomAxisExpr(orient.signal, undefined, vscale ? undefined : topOrBottomAxisExpr(orient.signal, 'height', 'width'))
    };

    update['y'] = enter['y'] = {
      scale: topOrBottomAxisExpr(orient.signal, vscale ? vscale : undefined, tickPos.scale),
      field: topOrBottomAxisExpr(orient.signal, undefined, tickPos.field),
      band: topOrBottomAxisExpr(orient.signal, undefined, tickPos.band),
      extra: topOrBottomAxisExpr(orient.signal, undefined, tickPos.extra),
      offset: topOrBottomAxisExpr(orient.signal, offset, tickPos.offset),
      round: topOrBottomAxisExpr(orient.signal, undefined, tickPos.round),
      range: topOrBottomAxisExpr(orient.signal, vscale ? 0 : undefined, undefined),
      mult: topOrBottomAxisExpr(orient.signal, vscale ? sign : undefined, undefined),
      value: topOrBottomAxisExpr(orient.signal, vscale ? undefined : 0, undefined)
    };

    update['y2'] = enter['y2'] = {
      scale: topOrBottomAxisExpr(orient.signal, vscale ? vscale : undefined, tickPos.scale),
      field: topOrBottomAxisExpr(orient.signal, undefined, tickPos.field),
      band: topOrBottomAxisExpr(orient.signal, undefined, tickPos.band),
      extra: topOrBottomAxisExpr(orient.signal, undefined, tickPos.extra),
      offset: topOrBottomAxisExpr(orient.signal, offset, tickPos.offset),
      round: topOrBottomAxisExpr(orient.signal, undefined, tickPos.round),
      range: topOrBottomAxisExpr(orient.signal, vscale ? 1 : undefined, undefined),
      mult: topOrBottomAxisExpr(orient.signal, vscale ? sign : undefined, undefined),
      signal: topOrBottomAxisExpr(orient.signal, undefined, vscale ? undefined : topOrBottomAxisExpr(orient.signal, 'height', 'width'))
    };

    exit['x'] = {
      scale: topOrBottomAxisExpr(orient.signal, tickPos.scale, undefined),
      field: topOrBottomAxisExpr(orient.signal, tickPos.field, undefined),
      band: topOrBottomAxisExpr(orient.signal, tickPos.band, undefined),
      extra: topOrBottomAxisExpr(orient.signal, tickPos.extra, undefined),
      offset: topOrBottomAxisExpr(orient.signal, tickPos.offset, undefined),
      round: topOrBottomAxisExpr(orient.signal, tickPos.round, undefined),
    }

    exit['y'] = {
      scale: topOrBottomAxisExpr(orient.signal, undefined, tickPos.scale),
      field: topOrBottomAxisExpr(orient.signal, undefined, tickPos.field),
      band: topOrBottomAxisExpr(orient.signal, undefined, tickPos.band),
      extra: topOrBottomAxisExpr(orient.signal, undefined, tickPos.extra),
      offset: topOrBottomAxisExpr(orient.signal, undefined, tickPos.offset),
      round: topOrBottomAxisExpr(orient.signal, undefined, tickPos.round),
    }
  } else {
    if (orient === Top || orient === Bottom) {
      u = 'x';
      v = 'y';
      s = 'height';
    } else {
      u = 'y';
      v = 'x';
      s = 'width';
    }
    v2 = v + '2';
  
    update[u] = enter[u] = exit[u] = tickPos;
  
    if (vscale) {
      update[v] = enter[v] = {scale: vscale, range: 0, mult: sign, offset: offset};
      update[v2] = enter[v2] = {scale: vscale, range: 1, mult: sign, offset: offset};
    } else {
      update[v] = enter[v] = {value: 0, offset: offset};
      update[v2] = enter[v2] = {signal: s, mult: sign, offset: offset};
    }
  }
  

  return guideMark(RuleMark, AxisGridRole, null, Value, dataRef, encode, userEncode);
}

function offsetValue(offset, sign)  {
  if (sign === 1) {
    // do nothing!
  } else if (!isObject(offset)) {
    offset = sign * (offset || 0);
  } else {
      var entry = offset = extend({}, offset);

      while (entry.mult != null) {
        if (!isObject(entry.mult)) {
          if (isSignal(sign)) {
            entry.mult = `${entry.mult} * (${sign})`;
          } else {
            entry.mult *= sign;
          }
          return offset;
        } else {
          entry = entry.mult = extend({}, entry.mult);
        }
      }
  
      entry.mult = sign;
  }

  return offset;
}
