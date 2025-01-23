export default class VertexView {
    private view: DataView;
    private index: number = 0;
  
    private parentSize: number;
    private vertexSize: number;
  
    constructor(buffer: ArrayBuffer, parentSize: number) {
        this.view = new DataView(buffer);

        this.parentSize = parentSize;
        this.vertexSize = 1 + 4 + this.parentSize;
    }

    private newTypedArray(size: number, buffer: ArrayBufferLike, byteOffset?: number, length?: number) {
        switch(size) {
            case 1: return new Uint8Array(buffer, byteOffset, length);
            case 2: return new Uint16Array(buffer, byteOffset, length);
            case 4: return new Uint32Array(buffer, byteOffset, length);
            default: throw new Error("Invalid typed array size");
        }
    }

    private getUIntValue(size: number, byteOffset: number) {
        switch(size) {
            case 1: return this.view.getUint8(byteOffset);
            case 2: return this.view.getUint16(byteOffset);
            case 4: return this.view.getUint32(byteOffset);
            default: throw new Error("Invalid typed array size");
        }
    }

    private setUIntValue(size: number, byteOffset: number, value: number) {
        switch(size) {
            case 1: return this.view.setUint8(byteOffset, value);
            case 2: return this.view.setUint16(byteOffset, value);
            case 4: return this.view.setUint32(byteOffset, value);
            default: throw new Error("Invalid typed array size");
        }
    }
  
    // Re-point the arrays to the correct location
    pointTo(baseIndex: number) {
        this.index = baseIndex;

        // const vertexSize = 1 + 4 + this.parentSize;
        // this.flagsArray = new Uint8Array(this.buffer,                       baseIndex * vertexSize + 0, 1);
        // this.distanceArray = new Float32Array(this.buffer,                  baseIndex * vertexSize + 1, 1);
        // this.parentArray = this.newTypedArray(this.parentSize, this.buffer, baseIndex * vertexSize + 5, 1);
    }
  
    get isBlocked(): boolean {
        const byteOffset = this.index * this.vertexSize + 0;
        const flags = this.view.getUint8(byteOffset);
        return (flags & 0b00000001) !== 0;
    }
  
    set isBlocked(value: boolean) {
        const byteOffset = this.index * this.vertexSize + 0;
        const flags = this.view.getUint8(byteOffset);
      if (value) {
        this.view.setUint8(byteOffset, flags | 0b00000001);
      } else {
        this.view.setUint8(byteOffset, flags & ~0b00000001);
      }
    }
  
    get isVisited(): boolean {
        const byteOffset = this.index * this.vertexSize + 0;
        const flags = this.view.getUint8(byteOffset);
      return (flags & 0b00000010) !== 0;
    }
  
    set isVisited(value: boolean) {
        const byteOffset = this.index * this.vertexSize + 0;
        const flags = this.view.getUint8(byteOffset);
        if (value) {
            this.view.setUint8(byteOffset, flags | 0b00000010);
        } else {
            this.view.setUint8(byteOffset, flags & ~0b00000010);
        }
    }

    get isInitialized(): boolean {
        const byteOffset = this.index * this.vertexSize + 0;
        const flags = this.view.getUint8(byteOffset);
      return (flags & 0b00000100) !== 0;
    }
  
    set isInitialized(value: boolean) {
        const byteOffset = this.index * this.vertexSize + 0;
        const flags = this.view.getUint8(byteOffset);
        if (value) {
            this.view.setUint8(byteOffset, flags | 0b00000100);
        } else {
            this.view.setUint8(byteOffset, flags & ~0b00000100);
        }
    }
  
  
    get distance(): number {
        const byteOffset = this.index * this.vertexSize + 1;
        const dist = this.view.getFloat32(byteOffset, true);
        return dist;
    }
  
    set distance(value: number) {
        const byteOffset = this.index * this.vertexSize + 1;
        this.view.setFloat32(byteOffset, value, true);
    }

    get parent(): number {
        const byteOffset = this.index * this.vertexSize + 1 + 4;
        const parent = this.getUIntValue(this.parentSize, byteOffset);
        return parent;
    }
  
    set parent(value: number) {
        const byteOffset = this.index * this.vertexSize + 1 + 4;
        this.setUIntValue(this.parentSize, byteOffset, value);
    }
}