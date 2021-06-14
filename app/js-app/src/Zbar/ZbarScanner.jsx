import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Zbar.module.css";
import Webcam from "react-webcam";
import { fetch_imagedata_from_video } from "../misc/img-utils";
import ZbarWasmClass from "./ZbarWasmClass";

const importObj = {
    wasi_snapshot_preview1: {
        fd_seek: () => { },
        fd_close: () => { },
        fd_write: () => { },
        fd_read: () => { },
        environ_sizes_get: () => { },
        environ_get: () => { },
        proc_exit: () => { },
        clock_time_get: () => { },
    },
    env: {
        log_char_arr: (msg_ptr, size) => {
            // console.log(getStringFromMemory(msg_ptr, moduleExports));
        }
    }
};
const VIDEO_WIDTH = 400;
const VIDEO_HEIGHT = 400;

let moduleExports;
let _video;
let wasmCls;

export const ZbarScanner = (props) => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    const [codes, setCodes] = useState([]);

    const webcam_cb = useCallback(() => {
        const { video } = webcamRef.current;
        const canvas = canvasRef.current;
        
        _video = video;

        const tick = () => {
            requestAnimationFrame(tick);
            if (video.paused || video.end) {
                return;
            }

            //#region -------- processing image ----------
            const img_data = fetch_imagedata_from_video(video, canvas, 1);
            if (img_data) {
                const _codes = wasmCls.process(img_data.data);
                if (_codes.length > 0) {
                    // draw code boundary 
                    for (let i = 0; i < _codes.length; i++) {
                        const { points: { x0, y0, x1, y1 } } = _codes[i];
                        const ctx = canvas.getContext("2d");
                        ctx.lineWidth = 5;
                        ctx.strokeStyle = "#FF0000";
                        ctx.beginPath();
                        ctx.moveTo(x0, y0);
                        ctx.lineTo(x0, y1);
                        ctx.lineTo(x1, y1);
                        ctx.lineTo(x1, y0);
                        ctx.lineTo(x0, y0);
                        ctx.stroke();
                    }
    
                    setCodes(_codes);
                }
            }
            
            //#endregion --------- end -------------------
        };


        video.addEventListener('play', () => {
            fetch('wasm/zbarapp.wasm').then(response =>
                response.arrayBuffer()
            ).then(bytes =>
                WebAssembly.instantiate(bytes, importObj)
            ).then(results => {
                // console.log(results);
                moduleExports = results.instance.exports;
                wasmCls = new ZbarWasmClass({
                    instance: moduleExports,
                    wasm_func: "func_zbar",
                    width: VIDEO_WIDTH,
                    height: VIDEO_HEIGHT
                });

                tick();
            });


        }, false);

    }, [webcamRef, canvasRef]);

    useEffect(() => {
        if (webcam_cb) {
            webcam_cb();
        }
    }, [webcam_cb]);

    useEffect(() => {
        return () => {
            if(_video) {                
                _video.pause();
                const stream = _video.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
                _video.srcObject = null;
            }
            if (wasmCls && moduleExports) {
                moduleExports.free(wasmCls.frame_buffer_ptr);
                moduleExports.free(wasmCls.result_buffer_ptr);
            }
        }
    }, []);

    return <>
        <Webcam audio={false}
            width={1}
            height={1}
            ref={webcamRef}
            videoConstraints={{
                width: VIDEO_WIDTH,
                height: VIDEO_HEIGHT,
                facingMode: "environment"
            }}
        />
        <div className={`container ${styles.scanner_container}`} >
            <div className="row justify-content-md-center">
                <div className={`col-6 ${styles.code}`}>
                    {codes && codes.map((code, idx) => {
                        return <label key={idx}>{`Barcode: ${code.type} - ${code.data} `}</label>
                    })}
                </div>
            </div>
            <div className="row" >
                <div className={`col-12 ${styles.scanner}`}>
                    <canvas ref={canvasRef} />
                </div>
            </div>
        </div>
    </>
}