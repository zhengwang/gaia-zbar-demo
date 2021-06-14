export default class ZbarWasmClass {
    constructor(props) {
        const { instance, wasm_func, width, height } = props;
        this.instance = instance;
        this.width = width;
        this.height = height;
        this.frame_buffer_ptr = instance.malloc(width * height * 4 * Uint8Array.BYTES_PER_ELEMENT);
        this.result_buffer_ptr = instance.malloc(128 * Uint16Array.BYTES_PER_ELEMENT);
        this.bytes_memory = new Uint8Array(this.instance.memory.buffer);

        this.wasm_func = instance[wasm_func];

        this.process = this.process.bind(this);
    }

    process(data) {
        // console.log(data.length);
        this.bytes_memory.set(
            data,
            this.frame_buffer_ptr,
            this.frame_buffer_ptr / Uint8Array.BYTES_PER_ELEMENT
        );        

        this.wasm_func(
            this.frame_buffer_ptr, 
            this.width, 
            this.height,
            this.result_buffer_ptr);
        const bytes = new Uint16Array(this.instance.memory.buffer, this.result_buffer_ptr);        
        const code_amt = bytes[0];
        
        const rst = [];
        const info_digit = 2;
        
        if (code_amt > 0) {
            // console.log("code_amt: " + code_amt);
            // console.log(bytes);
            for (let i = 0, offset = 1; i < code_amt; i++) {
                let type = "", data = "";
                let type_len = bytes[offset];
                let data_len = bytes[offset + 1];

                let info_data_len = type_len + data_len;
                // console.log("info_data_len: " + info_data_len);

                for (let i = offset + info_digit; i < offset + info_data_len + info_digit; i++) {
                    if (i < offset + type_len + info_digit) {
                        type += String.fromCharCode(bytes[i]);
                    } else {
                        data += String.fromCharCode(bytes[i]);
                    }
                }
                
                offset += info_data_len + info_digit;
                rst.push({ type: type, data: data, points: 
                    {x0: bytes[offset], y0: bytes[offset + 1], 
                        x1: bytes[offset + 2], y1: bytes[offset + 3]},
                    });
                offset += 4;
            }
        }
        return rst;

    }
}