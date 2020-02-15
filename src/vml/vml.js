import './graphic';
import {registerPainter} from '../quark-renderer';
import VMLPainter from './VMLPainter';

registerPainter('vml', VMLPainter);