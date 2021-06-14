export default class WASMClass {
    constructor(props) {
        const {data, instance, wasm_func, width, height } = props;
        // console.log(instance);
        this.instance = instance;
        this.width = width;
        this.height = height;
        this.frame_buffer_ptr = instance.malloc(data.length * Uint8ClampedArray.BYTES_PER_ELEMENT);
        this.bytes_memory = new Uint8ClampedArray(this.instance.memory.buffer);
        this.wasm_func = instance[wasm_func];        

        this.process = this.process.bind(this);
    }    

    /**
    * @function
    * @param{ImageData}: data
    * @return {ImageData}
    */
    process(data) {
        this.bytes_memory.set(
        	data,
            this.frame_buffer_ptr,
            this.frame_buffer_ptr / Uint8ClampedArray.BYTES_PER_ELEMENT);
        const _back_ptr = this.wasm_func(this.frame_buffer_ptr, this.width, this.height);
        const _bytes = new Uint8ClampedArray(
            this.instance.memory.buffer,
            _back_ptr, this.width * this.height * 4);
        const _imgdata = new ImageData(_bytes, this.width, this.height);
        return _imgdata;
    }
}