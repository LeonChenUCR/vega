import { topOrBottomAxisExpr } from './axis-config';
import {Top, Bottom, zero, one} from './constants';
import guideMark from './guide-mark';
import {lookup} from './guide-util';
import {RuleMark} from '../marks/marktypes';
import {AxisDomainRole} from '../marks/roles';
import {addEncoders} from '../encode/encode-util';
import { isSignal } from '../../util';

export default function(spec, config, userEncode, dataRef) {
  var _ = lookup(spec, config),
      orient = spec.orient,
      encode, enter, update, u, u2, v;

  encode = {
    enter: enter = {opacity: zero},
    update: update = {opacity: one},
    exit: {opacity: zero}
  };

  addEncoders(encode, {
    stroke:           _('domainColor'),
    strokeDash:       _('domainDash'),
    strokeDashOffset: _('domainDashOffset'),
    strokeWidth:      _('domainWidth'),
    strokeOpacity:    _('domainOpacity')
  });

  if (isSignal(spec.orient)) {
    update['x'] = enter['x'] = signalPosition(spec, position(spec,0), true);
    update['y'] = enter['y'] = signalPosition(spec, position(spec,0), false);
    update['x2'] = enter['x2'] = signalPosition(spec, position(spec,1), true);
    update['y2'] = enter['y2'] = signalPosition(spec, position(spec,1), false);
  } else {
    if (orient === Top || orient === Bottom) {
      u = 'x';
      v = 'y';
    } else {
      u = 'y';
      v = 'x';
    }
    u2 = u + '2';

    enter[v] = zero;
    update[u] = enter[u] = position(spec, 0);
    update[u2] = enter[u2] = position(spec, 1);
  }

  return guideMark(RuleMark, AxisDomainRole, null, null, dataRef, encode, userEncode);
}

function position(spec, pos) {
  return {scale: spec.scale, range: pos};
}

function signalPosition(spec, pos, topOrBottom) {
  var yes = topOrBottom ? pos.range : 0,
      no = topOrBottom ? 0 : pos.range;

  return {scale: spec.scale, range: topOrBottomAxisExpr(spec.orient.signal, yes, no).signal}
}
