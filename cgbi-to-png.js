(async function () {
    // CRC32 calculator
    function crc32(buf) {
      let table = window.crcTable || (window.crcTable = (function () {
        let c, table = [];
        for (let n = 0; n < 256; n++) {
          c = n;
          for (let k = 0; k < 8; k++) {
            c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
          }
          table[n] = c;
        }
        return table;
      })());
  
      let crc = 0 ^ (-1);
      for (let i = 0; i < buf.length; i++) {
        crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
      }
  
      return (crc ^ (-1)) >>> 0;
    }
  
    function readUInt32BE(buf, offset) {
      return (buf[offset] * 0x1000000) + ((buf[offset + 1] << 16) | (buf[offset + 2] << 8) | buf[offset + 3]);
    }
  
    function writeUInt32BE(num) {
      return new Uint8Array([
        (num >> 24) & 0xFF,
        (num >> 16) & 0xFF,
        (num >> 8) & 0xFF,
        num & 0xFF
      ]);
    }
  
    function strToBytes(str) {
      return new TextEncoder().encode(str);
    }
  
    function bytesToStr(bytes) {
      return new TextDecoder().decode(bytes);
    }
  
    window.revertCgbiPng = async function (arrayBuffer) {
      const PNG_HEADER = atob("iVBORw0KGgo=");
      const buffer = new Uint8Array(arrayBuffer);
  
      for (let i = 0; i < 8; i++) {
        if (String.fromCharCode(buffer[i]) !== PNG_HEADER[i]) {
          throw new Error("Not a PNG file");
        }
      }
  
      let offset = 8;
      let isCgbi = false;
      let width, height;
      let idatCgbiData = new Uint8Array();
      let chunks = [];
  
      while (offset < buffer.length) {
        const length = readUInt32BE(buffer, offset);
        const type = bytesToStr(buffer.slice(offset + 4, offset + 8));
        const data = buffer.slice(offset + 8, offset + 8 + length);
        const crc = buffer.slice(offset + 8 + length, offset + 12 + length);
  
        offset += 12 + length;
  
        if (type === "CgBI") {
          isCgbi = true;
          continue;
        }
  
        if (type === "IHDR") {
          width = readUInt32BE(data, 0);
          height = readUInt32BE(data, 4);
        }
  
        if (type === "IDAT" && isCgbi) {
          const newConcat = new Uint8Array(idatCgbiData.length + data.length);
          newConcat.set(idatCgbiData, 0);
          newConcat.set(data, idatCgbiData.length);
          idatCgbiData = newConcat;
          continue;
        }
  
        if (type === "IEND" && isCgbi) {
          const uncompressed = pako.inflateRaw(idatCgbiData);
          const newData = new Uint8Array(uncompressed.length);
  
          let i = 0;
          for (let y = 0; y < height; y++) {
            newData[i] = uncompressed[i]; // filter byte
            i++;
            for (let x = 0; x < width; x++) {
              newData[i + 0] = uncompressed[i + 2]; // R <- B
              newData[i + 1] = uncompressed[i + 1]; // G
              newData[i + 2] = uncompressed[i + 0]; // B <- R
              newData[i + 3] = uncompressed[i + 3]; // A
              i += 4;
            }
          }
  
          const idatDeflated = pako.deflate(newData);
          const typeBytes = strToBytes("IDAT");
          const idatCrc = crc32(new Uint8Array([...typeBytes, ...idatDeflated]));
  
          chunks.push({
            type: "IDAT",
            data: idatDeflated,
            crc: idatCrc
          });
        }
  
        chunks.push({
          type,
          data,
          crc: readUInt32BE(crc, 0)
        });
      }
  
      const outputChunks = [new Uint8Array(8)];
      outputChunks[0].set(buffer.slice(0, 8)); // PNG header
  
      for (const chunk of chunks) {
        const lengthBytes = writeUInt32BE(chunk.data.length);
        const typeBytes = strToBytes(chunk.type);
        const crcBytes = writeUInt32BE(chunk.crc);
        outputChunks.push(lengthBytes, typeBytes, chunk.data, crcBytes);
      }
  
      const finalBuffer = new Uint8Array(outputChunks.reduce((a, b) => a + b.length, 0));
      let outOffset = 0;
      for (const part of outputChunks) {
        finalBuffer.set(part, outOffset);
        outOffset += part.length;
      }
  
      return finalBuffer;
    };
  })();  