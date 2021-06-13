import React, { useEffect, useState } from "react";
import { fetch_imgdata_from_image, getStringFromMemory } from "../misc/img-utils.js";
import WASMClass from "../misc/WASMClass.js";
// import { encode, decode } from "@msgpack/msgpack";

let moduleExports;
let importObj = {
    wasi_snapshot_preview1: {
        fd_seek: () => {},
        fd_close: () => {},
        fd_write: () => {},
        fd_read: () => {},
        environ_sizes_get: () => {},
        environ_get: () => {},
        proc_exit: ()=> {},
        clock_time_get: () => {},                    
    },
    env: {
        log_char_arr: (msg_ptr, size) => {
            console.log(getStringFromMemory(msg_ptr, moduleExports));
        }
    }
};

export const Zbar = (props) => {
    const [img, setImg] = useState(null);
    const canvasRef = React.createRef();

    useEffect(() => {
        if (img) {
            
            fetch("wasm/zbarapp.wasm").then(response => 
                response.arrayBuffer()
            ).then(bytes => 
                WebAssembly.instantiate(bytes, importObj)
            ).then(result => {
                console.log(result);

                moduleExports = result.instance.exports;                
                                                                
                const img_buffer_ptr = moduleExports.malloc(img.data.length * Uint8ClampedArray.BYTES_PER_ELEMENT);
                const bytes_memory = new Uint8ClampedArray(moduleExports.memory.buffer);
                bytes_memory.set(img.data, img_buffer_ptr, img_buffer_ptr / Uint8ClampedArray.BYTES_PER_ELEMENT);
                
                console.log("before zbar func");
                const msg_ptr = moduleExports.func_zbar(
                    img_buffer_ptr, 
                    img.width, 
                    img.height                    
                );
                console.log(msg_ptr);
                                
                const bytes = new Uint8Array(moduleExports.memory.buffer, msg_ptr);                
                const code_amt = bytes[0];             
                console.log("code_amt: " + code_amt)  ;

                console.log(" =========== split code ============");
                for (let amt = 0, offset = 1; amt < code_amt; amt++) {
                    let type = "", data = "";  
                    let type_len = bytes[offset];
                    let data_len = bytes[offset + 1];           
                    
                    console.log("type_len: " + type_len);
                    console.log("data_len: " + data_len);       

                    let info_data_len = type_len + data_len;
                    // console.log("info_data_len: " + info_data_len);

                    for(let i = offset+2; i < offset + info_data_len + 2; i++) {       
                        if (i < offset + type_len + 2) {                        
                            type += String.fromCharCode(bytes[i]);
                        } else {
                            data += String.fromCharCode(bytes[i]);
                        }                    
                    }
                    console.log("type is: " + type);
                    console.log("data is: " + data);

                    offset += info_data_len + 2;
                    console.log("offset: " + offset);
                } 
            })
            

            //#region -------- instantitateStreaming --------------
            /*
            WebAssembly.instantiateStreaming(fetch("wasm/zbarapp.wasm"), {
                wasi_snapshot_preview1: {
                    fd_seek: () => {},
                    fd_close: () => {},
                    fd_write: () => {},
                    fd_read: () => {},
                    environ_sizes_get: () => {},
                    environ_get: () => {},
                    proc_exit: ()=> {},
                    clock_time_get: () => {},                    
                },
                env: {
                    log_char_arr: (msg_ptr, size) => {
                        console.log(getStringFromMemory(msg_ptr, moduleExports));
                    }
                }
            }).then(result => {
                // console.log(result);
                moduleExports = result.instance.exports;                
                                                                
                const img_buffer_ptr = moduleExports.malloc(img.data.length * Uint8ClampedArray.BYTES_PER_ELEMENT);
                const bytes_memory = new Uint8ClampedArray(moduleExports.memory.buffer);
                bytes_memory.set(img.data, img_buffer_ptr, img_buffer_ptr / Uint8ClampedArray.BYTES_PER_ELEMENT);
                          
                const msg_ptr = moduleExports.func_zbar(
                    img_buffer_ptr, 
                    img.width, 
                    img.height                    
                );
                console.log(msg_ptr);
                                
                const bytes = new Uint8Array(moduleExports.memory.buffer, msg_ptr);                
                const code_amt = bytes[0];

                //#region ----------- debug --------------
                // console.log("code amt: " + code_amt);
                // let character = "";
                // for(let i =0; i < 128; i++) {
                //     // console.log(bytes[i]);
                //     character += String.fromCharCode(bytes[i]);
                // }
                // console.log(character);
                //#endregion

                console.log(" =========== split code ============");
                for (let amt = 0, offset = 1; amt < code_amt; amt++) {
                    let type = "", data = "";  
                    let type_len = bytes[offset];
                    let data_len = bytes[offset + 1];           
                    
                    console.log("type_len: " + type_len);
                    console.log("data_len: " + data_len);       

                    let info_data_len = type_len + data_len;
                    // console.log("info_data_len: " + info_data_len);

                    for(let i = offset+2; i < offset + info_data_len + 2; i++) {       
                        if (i < offset + type_len + 2) {                        
                            type += String.fromCharCode(bytes[i]);
                        } else {
                            data += String.fromCharCode(bytes[i]);
                        }                    
                    }
                    console.log("type is: " + type);
                    console.log("data is: " + data);

                    offset += info_data_len + 2;
                    console.log("offset: " + offset);
                }                
            });*/
            //#endregion -------------------------------------------
        }
    }, [img]);
    return <div>Zbar is working. <br/>
    <img src="assets/images/code4.png" onLoad={e=>{
        setImg(fetch_imgdata_from_image(e.target));
    }}/>
    <canvas ref={canvasRef}/>
    </div>
}