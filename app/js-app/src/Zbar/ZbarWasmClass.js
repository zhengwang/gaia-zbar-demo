export default class ZbarWasmClass {
    constructor(props) {
        const {instance, wasm_func, width, height} = props;
        this.instance = instance;
        this.width = width;
        this.height = height;
        this.frame_buffer_ptr = instance.malloc(width * height * 4 * Uint8ClampedArray.BYTES_PER_ELEMENT);
        this.bytes_memory = new Uint8ClampedArray(this.instance.memory.buffer);
        this.wasm_func = instance[wasm_func];

        this.process = this.process.bind(this);        
    }

    process(data) {
        // console.log(data.length);
        this.bytes_memory.set(
            data,
            this.frame_buffer_ptr,
            this.frame_buffer_ptr / Uint8ClampedArray.BYTES_PER_ELEMENT
        );
        const _back_ptr = this.wasm_func(this.frame_buffer_ptr, this.width, this.height);
        const bytes = new Uint8Array(this.instance.memory.buffer, _back_ptr);                
        const code_amt = bytes[0];         
        const rst = [];    
        if (code_amt > 0) {
            // console.log("code_amt: " + code_amt);
            for(let i=0, offset = 1; i <code_amt; i++) {
                let type = "", data = "";  
                let type_len = bytes[offset];
                let data_len = bytes[offset + 1];             

                let info_data_len = type_len + data_len;
                // console.log("info_data_len: " + info_data_len);

                for(let i = offset+2; i < offset + info_data_len + 2; i++) {       
                    if (i < offset + type_len + 2) {                        
                        type += String.fromCharCode(bytes[i]);
                    } else {
                        data += String.fromCharCode(bytes[i]);
                    }                    
                }
                // console.log("type is: " + type);
                // console.log("data is: " + data);

                offset += info_data_len + 2;
                // console.log("offset: " + offset);
                rst.push({type: type, data: data});
            }
        }
        return rst;
        
    }
}