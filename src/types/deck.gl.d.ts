declare module '@deck.gl/mapbox' {
    import { Layer } from '@deck.gl/core';
    export class MapboxOverlay {
        constructor(props: any);
        setProps(props: any): void;
        finalize(): void;
    }
}
