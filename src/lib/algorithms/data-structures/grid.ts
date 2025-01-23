import type { Coords } from "$lib/model";
import VertexView from "./vertex";

class PathfindingGrid {
    private buffer: ArrayBuffer;
    private readonly m: number;
    private readonly n: number;
    private readonly k: number;
    private readonly parentSize: number;
    private readonly vertexSize: number;
    private vertexView: VertexView;
    readonly offsetX: number;
    readonly offsetY: number;
  
    constructor(m: number, n: number, center: Coords) {
      this.m = m;
      this.n = n;
      this.k = m * n;
      this.offsetX = Math.floor(0.5 * m - center.x);
      this.offsetY = Math.floor(0.5 * n - center.y);
  
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
  
    getIndex(x: number, y: number): number {
      x = x + this.offsetX;
      y = y + this.offsetY;
      return (y * this.m + x);
    }

    getCoords(index: number): Coords {
      const res = {
          x: index % this.m             - this.offsetX,
          y: Math.floor(index / this.m) - this.offsetY
      }
      return res;
    }
  
    getVertexView(x: number, y: number): VertexView {
      const index = this.getIndex(x, y);
      this.vertexView.pointTo(index);
      return this.vertexView;
    }
}

export default PathfindingGrid;