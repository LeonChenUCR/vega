import { isXAxisExpr } from './axis-util';
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
    enter['y'] = [
      {
        test: isXAxisExpr(orient.signal, true),
        ...zero
      },
      {
        ...position(spec, 0)
      }
    ];

    enter['x'] = [
      {
        test: isXAxisExpr(orient.signal, false),
        ...zero
      },
      {
        ...position(spec, 0)
      }
    ]

    update['x'] = [
      {
        test: isXAxisExpr(orient.signal, true),
        ...position(spec, 0)
      }
    ]

    update['y'] = [
      {
        test: isXAxisExpr(orient.signal, false),
        ...position(spec, 0)
      }
    ]

    update['x2'] = enter['x2'] = [
      {
        test: isXAxisExpr(orient.signal, true),
        ...position(spec, 1)
      }
    ]

    update['y2'] = enter['y2'] = [
      {
        test: isXAxisExpr(orient.signal, false),
        ...position(spec, 1)
      }
    ]
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
