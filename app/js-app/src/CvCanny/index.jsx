import React, { useEffect, useState } from "react";
import { fetch_imgdata_from_image } from "../misc/img-utils.js";
import WASMClass from "../misc/WASMClass.js";

let exportModule;

export const CvCanny = (props) => {
    const [img, setImg] = useState(null);
    const canvasRef = React.createRef();

    useEffect(() => {
        if (img) {
            WebAssembly.instantiateStreaming(fetch("wasm/cvcanny.wasm"), {
                wasi_snapshot_preview1: {
                    fd_close: () => {},
                    fd_write: () => {},
                    fd_seek: () => {},
                    proc_exit: ()=> {},
                    environ_sizes_get: () => {},
                    environ_get: () => {}
                }
            }).then(
                result => {
                    console.log(result);
                    exportModule = result.instance.exports;
                    const wasmCls = new WASMClass({
                        data: img.data,
                        width: img.width,
                        height: img.height,
                        instance: exportModule,
                        wasm_func: "func_canny"
                    });
                    const rst_img_data = wasmCls.process(img.data);
                    const draft_canvas = canvasRef.current;
                    draft_canvas.width = img.width;
                    draft_canvas.height = img.height;
                    const draft_ctx = draft_canvas.getContext("2d");
                    draft_ctx.putImageData(rst_img_data, 0, 0);
                }
            );
        }
        
    }, [img]);
    return <div>CvCanny is working. <br/>
    <img src="assets/images/grant.jpg" onLoad={e => {
        setImg(fetch_imgdata_from_image(e.target));
    }}/>
    <canvas ref={canvasRef}/>
    </div>
}