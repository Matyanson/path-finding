import type { Coords } from "$lib/model";
import VertexView from "./vertex";

class PathfindingGrid {
    private buffer: ArrayBuffer;
    private readonly k: number;
    private readonly parentSize: number;
    private readonly vertexSize: number;
    private vertexView: VertexView;
    readonly m: number;
    readonly n: number;
    readonly offsetX: number;
    readonly offsetY: number;
  
    constructor(position: Coords, m: number, n: number) {
      this.m = Math.floor(m);
      this.n = Math.floor(n);
      this.k = m * n;
      this.offsetX = Math.floor(position.x);
      this.offsetY = Math.floor(position.y);
  
      // Determine the size of the parent field
      if (this.k <= 256) {
        this.parentSize = 1; // Use 1 byte for parent
      } else if (this.k <= 65536) {
        this.parentSize = 2; // Use 2 bytes for parent
      } else if (this.k <= 4294967296){
        this.parentSize = 4; // Use 4 bytes for parent
      } else {
        this.parentSize = 8; // Use 8 bytes for parent
      }
  
      // Calculate vertex size
      //                flags   distance    parent
      this.vertexSize = 1       + 4         + this.parentSize;
  
      // Initialize memory buffer
      this.buffer = new ArrayBuffer(this.k * this.vertexSize);
  
      // Create reusable vertex
      this.vertexView = new VertexView(this.buffer, this.parentSize);
    }
    // todo: handle negative cases!!!
    getIndex(x: number, y: number): number {
      x = x - this.offsetX;
      y = y - this.offsetY;
      return (y * this.m + x);
    }

    getCoords(index: number): Coords {
      const res = {
          x: index % this.m             + this.offsetX,
          y: Math.floor(index / this.m) + this.offsetY
      }
      return res;
    }
  
    getVertexView(x: number, y: number): VertexView {
      const index = this.getIndex(x, y);
      this.vertexView.pointTo(index);
      return this.vertexView;
    }

    isInBounds(x: number, y: number) {
      x = x - this.offsetX;
      y = y - this.offsetY;
      return x >= 0 && x < this.m && y >= 0 && y < this.n;
    }
}

export default PathfindingGrid;