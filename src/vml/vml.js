import './graphic';
import {registerPainter} from '../zrender';
import VMLPainter from './VMLPainter';

registerPainter('vml', VMLPainter);