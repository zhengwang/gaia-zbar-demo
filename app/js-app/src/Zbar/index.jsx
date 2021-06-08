import React, { useEffect, useState } from "react";
import { fetch_imgdata_from_image } from "../misc/img-utils.js";
import WASMClass from "../misc/WASMClass.js";
import { encode, decode } from "@msgpack/msgpack";

let moduleExports;

export const Zbar = (props) => {
    const [img, setImg] = useState(null);
    const canvasRef = React.createRef();

    useEffect(() => {
        if (img) {
            WebAssembly.instantiateStreaming(fetch("wasm/zbarapp.wasm"), {
                wasi_snapshot_preview1: {
                    fd_seek: () => {},
                    fd_close: () => {},
                    fd_write: () => {},
                    fd_read: () => {},
                    environ_sizes_get: () => {},
                    environ_get: () => {},
                    proc_exit: ()=> {},
                    clock_time_get: () => {}
                }
            }).then(result => {
                console.log(result);
                moduleExports = result.instance.exports;                
                                                                
                const img_buffer_ptr = moduleExports.malloc(img.data.length * Uint8ClampedArray.BYTES_PER_ELEMENT);
                const bytes_memory = new Uint8ClampedArray(moduleExports.memory.buffer);
                bytes_memory.set(img.data, img_buffer_ptr, img_buffer_ptr / Uint8ClampedArray.BYTES_PER_ELEMENT);

                const msg_buffer_ptr = moduleExports.malloc(Uint8Array.BYTES_PER_ELEMENT * 8);
                const msg_ptr = moduleExports.func_zbar(
                    img_buffer_ptr, 
                    img.width, 
                    img.height,
                    msg_buffer_ptr
                );
                
                const offset = 35;
                const msg_data = new Uint8Array(moduleExports.memory.buffer, msg_ptr, offset);
                const msg = decode(msg_data);
                console.log(msg);              
            });
        }
    }, [img]);
    return <div>Zbar is working. <br/>
    <img src="assets/images/newbar_06.jpg" onLoad={e=>{
        setImg(fetch_imgdata_from_image(e.target));
    }}/>
    <canvas ref={canvasRef}/>
    </div>
}