import {Top, Left, Bottom, Value, zero, one} from './constants';
import guideMark from './guide-mark';
import {lookup} from './guide-util';
import {RuleMark} from '../marks/marktypes';
import {AxisTickRole} from '../marks/roles';
import {addEncoders, encoder} from '../encode/encode-util';
import { isSignal } from '../../util';
import { topOrLeftAxisExpr, topOrBottomAxisExpr } from './axis-config';

export default function(spec, config, userEncode, dataRef, size, band) {
  var _ = lookup(spec, config),
      orient = spec.orient,
      sign = isSignal(orient) ? topOrLeftAxisExpr(orient.signal, -1, 1) : (orient === Left || orient === Top) ? -1 : 1,
      encode, enter, exit, update, tickSize, tickPos;

  encode = {
    enter: enter = {opacity: zero},
    update: update = {opacity: one},
    exit: exit = {opacity: zero}
  };

  addEncoders(encode, {
    stroke:           _('tickColor'),
    strokeDash:       _('tickDash'),
    strokeDashOffset: _('tickDashOffset'),
    strokeOpacity:    _('tickOpacity'),
    strokeWidth:      _('tickWidth')
  });

  tickSize = encoder(size);
  tickSize.mult = sign;

  tickPos = {
    scale:  spec.scale,
    field:  Value,
    band:   band.band,
    extra:  band.extra,
    offset: band.offset,
    round:  _('tickRound')
  };

  if (isSignal(orient)) {
    update.y = enter.y = {
      value: topOrBottomAxisExpr(orient.signal, zero.value, undefined),
      scale:  topOrBottomAxisExpr(orient.signal, undefined, tickPos.scale),
      field:  topOrBottomAxisExpr(orient.signal, undefined, tickPos.field),
      band:  topOrBottomAxisExpr(orient.signal, undefined, tickPos.band),
      extra:  topOrBottomAxisExpr(orient.signal, undefined, tickPos.extra),
      offset:  topOrBottomAxisExpr(orient.signal, undefined, tickPos.offset),
      round:  topOrBottomAxisExpr(orient.signal, undefined, tickPos.round),
    }

    exit.y = {
      scale:  topOrBottomAxisExpr(orient.signal, undefined, tickPos.scale),
      field:  topOrBottomAxisExpr(orient.signal, undefined, tickPos.field),
      band:  topOrBottomAxisExpr(orient.signal, undefined, tickPos.band),
      extra:  topOrBottomAxisExpr(orient.signal, undefined, tickPos.extra),
      offset:  topOrBottomAxisExpr(orient.signal, undefined, tickPos.offset),
      round:  topOrBottomAxisExpr(orient.signal, undefined, tickPos.round),
    }

    update.y2 = enter.y2 = {
      scale:  topOrBottomAxisExpr(orient.signal, undefined, tickSize.scale),
      field:  topOrBottomAxisExpr(orient.signal, undefined, tickSize.field),
      band:  topOrBottomAxisExpr(orient.signal, undefined, tickSize.band),
      extra:  topOrBottomAxisExpr(orient.signal, undefined, tickSize.extra),
      offset:  topOrBottomAxisExpr(orient.signal, undefined, tickSize.offset),
      round:  topOrBottomAxisExpr(orient.signal, undefined, tickSize.round),
    }

    update.x = enter.x = {
      value: topOrBottomAxisExpr(orient.signal, undefined, zero.value),
      scale:  topOrBottomAxisExpr(orient.signal, tickPos.scale, undefined),
      field:  topOrBottomAxisExpr(orient.signal, tickPos.field, undefined),
      band:  topOrBottomAxisExpr(orient.signal, tickPos.band, undefined),
      extra:  topOrBottomAxisExpr(orient.signal, tickPos.extra, undefined),
      offset:  topOrBottomAxisExpr(orient.signal, tickPos.offset, undefined),
      round:  topOrBottomAxisExpr(orient.signal, tickPos.round, undefined),
    }

    exit.x = {
      scale:  topOrBottomAxisExpr(orient.signal, tickPos.scale, undefined),
      field:  topOrBottomAxisExpr(orient.signal, tickPos.field, undefined),
      band:  topOrBottomAxisExpr(orient.signal, tickPos.band, undefined),
      extra:  topOrBottomAxisExpr(orient.signal, tickPos.extra, undefined),
      offset:  topOrBottomAxisExpr(orient.signal, tickPos.offset, undefined),
      round:  topOrBottomAxisExpr(orient.signal, tickPos.round, undefined),
    }

    update.x2 = enter.x2 = {
      scale:  topOrBottomAxisExpr(orient.signal, tickSize.scale, undefined),
      field:  topOrBottomAxisExpr(orient.signal, tickSize.field, undefined),
      band:  topOrBottomAxisExpr(orient.signal, tickSize.band, undefined),
      extra:  topOrBottomAxisExpr(orient.signal, tickSize.extra, undefined),
      offset:  topOrBottomAxisExpr(orient.signal, tickSize.offset, undefined),
      round:  topOrBottomAxisExpr(orient.signal, tickSize.round, undefined),
    }

  } else {
    if (orient === Top || orient === Bottom) {
      update.y = enter.y = zero;
      update.y2 = enter.y2 = tickSize;
      update.x = enter.x = exit.x = tickPos;
    } else {
      update.x = enter.x = zero;
      update.x2 = enter.x2 = tickSize;
      update.y = enter.y = exit.y = tickPos;
    }
  }



  return guideMark(RuleMark, AxisTickRole, null, Value, dataRef, encode, userEncode);
}
