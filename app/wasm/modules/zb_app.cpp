#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#endif

#include "zbar.h"
#include <string>
#include <cstring>

using namespace std;

uint8_t* _func_flat_symbol(string type, string data) {        
    int len_type = type.length();
    int len_data = data.length();
    int max_len = (len_type > len_data ? len_type : len_data) + 2;
    
    int arr_len = len_type + len_data + 2;
    uint8_t* arr = new uint8_t[arr_len];
    arr[0] = len_type;
    arr[1] = len_data;
    
    for(int i = 0; i < max_len; i++) {
        if (i < len_type) {
            arr[i+2] = type[i];    
        }
        
        int j = 2 + len_type + i;
        if (i < len_data) {
            arr[j] = data[i];    
        }
    }    
    return arr;
}

uint8_t* _func_rgba_2_gray(uint8_t* im_data, int cols, int rows) {
    uint8_t* _gray_im = new uint8_t[cols * rows];

    for(int i=0, j = 0; i < cols * rows; i++, j+=4) {
        _gray_im[i] = (uint8_t)(im_data[j] * 0.114 + im_data[j + 1] * 0.587 + im_data[j+2] * 0.299);
    }

    return _gray_im;
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
/*
 * @param im_data: Image databuffer from Uint8Array
 * @param cols: Image width
 * @param rows: Image height
 */
extern "C" uint8_t* func_zbar(uint8_t* im_data, int cols, int rows) {

    zbar::ImageScanner scanner;
    scanner.set_config(zbar::ZBAR_NONE, zbar::ZBAR_CFG_ENABLE, 1);
    uint8_t* grey_im = _func_rgba_2_gray(im_data, cols, rows);
    zbar::Image image(
        cols, 
        rows, 
        "Y800",
        (uint8_t*) grey_im,
        cols * rows);   

    int n = scanner.scan(image);  
    
    uint8_t* data_chunk = new uint8_t[128];
    data_chunk[0] = n;
    int i = 0;
    for(
        zbar::Image::SymbolIterator symbol = image.symbol_begin(); 
        symbol != image.symbol_end(); 
        ++symbol) 
    {         
        string type = symbol->get_type_name();
        string data = symbol->get_data();

        uint8_t* sym_arr = _func_flat_symbol(type, data);
        int sym_arr_len = (int)(type.length())+ (int)(data.length()) + 2;
        for(int j=0; j < sym_arr_len; j++) {
            data_chunk[i+1] = sym_arr[j];
            i++;
        }
    }  

    return data_chunk;

}