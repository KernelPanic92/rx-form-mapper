import { ControlVisitor } from './control-visitor';

export interface ControlMetadata {
	accept<T>(visitor: ControlVisitor<T>): T;
}
