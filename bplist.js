(function() {
    const debug = false;
  
    function parseBPlist(buffer) {
      if (buffer instanceof ArrayBuffer) {
        buffer = new Uint8Array(buffer);
      }
      
      const len = buffer.length;
      const header = new TextDecoder().decode(buffer.slice(0, 8));
      
      if (header !== 'bplist00') {
        throw new Error("Invalid binary plist header: " + header);
      }
      
      // Trailer is the last 32 bytes
      const trailerOffset = len - 32;
      const trailer = buffer.slice(trailerOffset);
      const dataView = new DataView(trailer.buffer, trailer.byteOffset, trailer.byteLength);
      
      // Trailer parsing
      // 6 bytes padding
      const offsetByteSize = dataView.getUint8(6);
      const objectRefSize = dataView.getUint8(7);
      const numObjects = Number(dataView.getBigUint64(8, false)); // requires modern browser or polyfill? iOS/Android usually fine
      const topObjectOffset = Number(dataView.getBigUint64(16, false));
      const offsetTableStart = Number(dataView.getBigUint64(24, false));
      
      if (debug) console.log({ offsetByteSize, objectRefSize, numObjects, topObjectOffset, offsetTableStart });
      
      // Parse offset table
      const offsetTable = [];
      for (let i = 0; i < numObjects; i++) {
        const off = offsetTableStart + i * offsetByteSize;
        offsetTable.push(readUInt(buffer, off, offsetByteSize));
      }
      
      function readUInt(buf, offset, bytes) {
        let res = 0;
        for (let i = 0; i < bytes; i++) {
            res = (res << 8) + buf[offset + i];
        }
        return res;
      }

      function readObject(objOffset) {
         const typeByte = buffer[objOffset];
         const type = typeByte & 0xF0;
         const info = typeByte & 0x0F;
         
         let length = 0;
         let payloadOffset = objOffset + 1;
         
         if (type !== 0x00 && info === 0x0F) {
            // Long length
            const lengthTypeByte = buffer[payloadOffset];
            const lengthIntBytes = 1 << (lengthTypeByte & 0x0F);
            payloadOffset++;
            length = readUInt(buffer, payloadOffset, lengthIntBytes);
            payloadOffset += lengthIntBytes;
         } else {
            length = info;
         }
         
         switch (type) {
            case 0x00: // simple
              switch (info) {
                case 0x00: return null;
                case 0x08: return false;
                case 0x09: return true;
                case 0x0F: return null; // fill byte
                default: return null;
              }
            case 0x10: // integer
               return readUInt(buffer, objOffset + 1, 1 << info);
            case 0x20: // real
               const realBytes = 1 << info;
               const realView = new DataView(buffer.buffer, buffer.byteOffset + objOffset + 1, realBytes);
               if (realBytes === 4) return realView.getFloat32(0, false);
               if (realBytes === 8) return realView.getFloat64(0, false);
               return 0;
            case 0x30: // date
               // 8 byte float, seconds since 2001-01-01
               const dateView = new DataView(buffer.buffer, buffer.byteOffset + objOffset + 1, 8);
               const seconds = dateView.getFloat64(0, false);
               const date = new Date(Date.UTC(2001, 0, 1) + seconds * 1000);
               return date;
            case 0x40: // data
               return buffer.slice(payloadOffset, payloadOffset + length);
            case 0x50: // ASCII string
               // The length is count of bytes
               return new TextDecoder("ascii").decode(buffer.slice(payloadOffset, payloadOffset + length));
            case 0x60: // UTF-16 string
               // The length is count of chars (2 bytes each)
               return new TextDecoder("utf-16be").decode(buffer.slice(payloadOffset, payloadOffset + length * 2));
            case 0x80: // UID
               return readUInt(buffer, objOffset + 1, length + 1);
            case 0xA0: // Array
               const array = [];
               for (let k = 0; k < length; k++) {
                   const refOffset = payloadOffset + k * objectRefSize;
                   const objRef = readUInt(buffer, refOffset, objectRefSize);
                   array.push(readObject(offsetTable[objRef]));
               }
               return array;
            case 0xD0: // Dictionary
               const dict = {};
               for (let k = 0; k < length; k++) {
                   const keyRefOffset = payloadOffset + k * objectRefSize;
                   const valRefOffset = payloadOffset + (length * objectRefSize) + k * objectRefSize;
                   
                   const keyRef = readUInt(buffer, keyRefOffset, objectRefSize);
                   const valRef = readUInt(buffer, valRefOffset, objectRefSize);
                   
                   const key = readObject(offsetTable[keyRef]);
                   const val = readObject(offsetTable[valRef]);
                   dict[key] = val;
               }
               return dict;
            default:
               throw new Error("Unknown object type: " + type.toString(16));
         }
      }
      
      const topObjectRef = offsetTable[topObjectOffset];
      
      // Should we start from topObjectOffset (index) or the offset itself? 
      // Trailer gives topObjectOffset as INDEX into global object table? 
      // Actually trailers' topObjectOffset is usually the OFFSET of the top object in the offset table?
      // No: "index of top object in offset table" according to some docs.
      // But typically bplist trailer has "index of the top level object".
      // Let's verify: readUInt for topObjectOffset returns the index inside offsetTable?
      // Wait. The code says: const topObjectOffset = Number(dataView.getBigUint64(16, false));
      // In trailer, byte 16..23 is "index of top object".
      
      // So if topObjectOffset is the index, we look it up in offsetTable:
      // const topObjectRealOffset = offsetTable[topObjectOffset]; 
      // But earlier I just parsed `numObjects` which is the count. 
      // If `topObjectOffset` is an index, it should be < numObjects.
      
      return readObject(offsetTable[topObjectOffset]);
    }
  
    // Polyfill for BigUint64 if needed?
    if (!DataView.prototype.getBigUint64) {
         DataView.prototype.getBigUint64 = function(byteOffset, littleEndian) {
            const lo = this.getUint32(byteOffset + (littleEndian ? 0 : 4), littleEndian);
            const hi = this.getUint32(byteOffset + (littleEndian ? 4 : 0), littleEndian);
            // We can't return real BigInt if environment fails, but we can approximate or use string
            // For plist offsets, safely assuming < 2^53 for safe integer
            return BigInt(hi) * BigInt(4294967296) + BigInt(lo);
         }
    }

    window.parseBPlist = parseBPlist;
  })();
