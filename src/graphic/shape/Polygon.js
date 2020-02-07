/**
 * 多边形
 * @module zrender/shape/Polygon
 */

import Path from '../Path';
import * as polyHelper from '../utils/poly';

export default Path.extend({

    type: 'polygon',

    shape: {
        points: null,

        smooth: false,

        smoothConstraint: null
    },

    buildPath: function (ctx, shape) {
        polyHelper.buildPath(ctx, shape, true);
    }
});