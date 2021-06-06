import React, { useEffect, useState } from "react";
import { encode, decode } from "@msgpack/msgpack";

let moduleExports;

export const MsgPack = (props) => {
    useEffect(() => {
        WebAssembly.instantiateStreaming(fetch("wasm/main.wasm"), {
            wasi_snapshot_preview1: {
                fd_close: () => { },
                fd_write: () => { },
                fd_seek: () => { },
                proc_exit: () => { }
            }
        }).then(result => {
            console.log(result);
            moduleExports = result.instance.exports;
            const HEAP32 = new Int32Array(moduleExports.memory.buffer);
            const HEAP8 = new Int8Array(moduleExports.memory.buffer);

            const bufferSize = moduleExports.malloc(8);
            const addressPtr = moduleExports.get_address(bufferSize);
            console.log(addressPtr);

            let offset = HEAP32[bufferSize >> 2];
            console.log(offset);
            const addressData = new Uint8Array(
                moduleExports.memory.buffer,
                addressPtr,
                offset
            )
            // moduleExports.free(addressPtr);
            const address = decode(addressData);
            console.log(address);

            const expression = { operand1: 100, operand2: 200 };
            const encoded = encode(expression);
            const bufferSize2 = moduleExports.malloc(encoded.length);
            HEAP8.set(encoded, bufferSize2 / encoded.BYTES_PER_ELEMENT);
            const rst = moduleExports.add_number(bufferSize2, encoded.length);
            moduleExports.free(bufferSize2);
            console.log(rst);
        });
    }, []);
    return <div>MsgPack is working</div>
}