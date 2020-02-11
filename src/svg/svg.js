import './graphic';
import {registerPainter} from '../zrender';
import SVGPainter from './SVGPainter';

registerPainter('svg', SVGPainter);