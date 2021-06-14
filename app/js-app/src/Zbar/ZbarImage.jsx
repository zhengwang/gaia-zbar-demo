import React, { useCallback, useEffect, useState } from "react";
import { fetch_imgdata_from_image, getStringFromMemory } from "../misc/img-utils.js";
import styles from "./Zbar.module.css";

let moduleExports;
let importObj = {
    wasi_snapshot_preview1: {
        fd_seek: () => {},
        fd_close: () => {},
        fd_write: () => {},
        fd_read: () => {},
        environ_sizes_get: () => {},
        environ_get: () => {},
        proc_exit: () => {},
        clock_time_get: () => {},
    },
    env: {
        log_char_arr: (msg_ptr, size) => {
            console.log(getStringFromMemory(msg_ptr, moduleExports));
        }
    }
};

export const ZbarImage = (props) => {    
    const canvasRef = React.createRef();
    const imgRef = React.createRef();

    const [img, setImg] = useState(null);
    const [canvas, setCanvas] = useState(null);

    useEffect(() => {
        if (img && canvas) {

            fetch("wasm/zbarapp.wasm").then(response =>
                response.arrayBuffer()
            ).then(bytes =>
                WebAssembly.instantiate(bytes, importObj)
            ).then(result => {
                console.log(result);

                moduleExports = result.instance.exports;

                const img_buffer_ptr = moduleExports.malloc(img.data.length * Uint8ClampedArray.BYTES_PER_ELEMENT);
                const rst_buffer_ptr = moduleExports.malloc(128 * Uint16Array.BYTES_PER_ELEMENT);
                const bytes_memory = new Uint8ClampedArray(moduleExports.memory.buffer);
                bytes_memory.set(img.data, img_buffer_ptr, img_buffer_ptr / Uint8ClampedArray.BYTES_PER_ELEMENT);
                
                moduleExports.func_zbar(
                    img_buffer_ptr,
                    img.width,
                    img.height,
                    rst_buffer_ptr
                );

                const bytes = new Uint16Array(moduleExports.memory.buffer, rst_buffer_ptr);
                // console.log(bytes);
                const code_amt = bytes[0];
                console.log("code_amt: " + code_amt);

                console.log(" =========== split code ============");
                const codes_loc = [];
                for (let amt = 0, offset = 1; amt < code_amt; amt++) {
                    let type = "",
                        data = "";
                    let type_len = bytes[offset];
                    let data_len = bytes[offset + 1];

                    console.log("type_len: " + type_len);
                    console.log("data_len: " + data_len);

                    let info_data_len = type_len + data_len;
                    // console.log("info_data_len: " + info_data_len);

                    for (let i = offset + 2; i < offset + info_data_len + 2; i++) {
                        if (i < offset + type_len + 2) {
                            type += String.fromCharCode(bytes[i]);
                        } else {
                            data += String.fromCharCode(bytes[i]);
                        }
                    }
                    console.log("type is: " + type);
                    console.log("data is: " + data);

                    offset += info_data_len + 2;
                    const x0 = bytes[offset],
                        y0 = bytes[offset + 1],
                        x1 = bytes[offset + 2],
                        y1 = bytes[offset + 3];

                    offset += 4;
                    console.log("offset: " + offset);
                    codes_loc.push(
                        {x0, y0, x1, y1});
                }                

                moduleExports.free(img_buffer_ptr);
                moduleExports.free(rst_buffer_ptr);
            });            
        }
    }, [img, canvas]);

    const canvas_cb = useCallback(() => {
        if (canvasRef) {
            setCanvas(canvasRef.current);
        }
    }, [canvasRef]);

    useEffect(() => {
        if (canvas_cb) {
            canvas_cb();
        }
    }, [canvas_cb]);
    return <div>Zbar is working. <br/>
    <img src="assets/images/code4.png" ref={imgRef} onLoad={e=>{
        setImg(fetch_imgdata_from_image(e.target));
    }} className={`${styles.demo_img}`}/>
    <canvas ref={canvasRef} width={723} height={1112}/>
    </div>
}