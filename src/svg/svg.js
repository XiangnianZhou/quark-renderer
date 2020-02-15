import './graphic';
import {registerPainter} from '../quark-renderer';
import SVGPainter from './SVGPainter';

registerPainter('svg', SVGPainter);