#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#endif

#include "zbar.h"
#include <string>
#include <cstring>

using namespace std;

int GAIA_ZBAR_INFO_LENGTH = 2; 

/**
 * Flat Zbar symbol object to an array.
 * - Type string length
 * - Data string length
 * - Type string in char array 
 * - Data string in char arry
 * 
 * @param type: barcode type
 * @param data: barcode data
 * @param symbol: SymbolIterator
 * @return array of flatting Zbar scanner symbol. Consisted of barcode information and two corner points of detected barcode area. 
 * | type-string-length | data-string-length | char-array of type string | char-array of data string | x0 | y0 | x1 | y1| 
 * */
uint16_t* _func_flat_symbol(
    string type, 
    string data, 
    zbar::Image::SymbolIterator symbol) {        
    int len_type = type.length();
    int len_data = data.length();
    int len_points = symbol->get_location_size();

    
    int max_len = (len_type > len_data) ? len_type : len_data + GAIA_ZBAR_INFO_LENGTH;    
    int arr_len = GAIA_ZBAR_INFO_LENGTH + len_type + len_data + 4;
    uint16_t* arr = new uint16_t[arr_len];
    arr[0] = len_type;
    arr[1] = len_data;    
    
    for(int i = 0; i < max_len; i++) {
        if (i < len_type) {
            arr[i+GAIA_ZBAR_INFO_LENGTH] = type[i];    
        }
        
        int j = GAIA_ZBAR_INFO_LENGTH + len_type + i;
        if (i < len_data) {
            arr[j] = data[i];    
        }        
    }    

    int i = GAIA_ZBAR_INFO_LENGTH + len_data + len_type;

    int x_min = symbol->get_location_x(0), 
        y_min = symbol->get_location_y(0), 
        x_max = x_min, y_max = y_min;

    for(int k = 1; k < len_points; k++) {
        int x = symbol->get_location_x(k);
        int y = symbol->get_location_y(k);
        if (x < x_min) {
            x_min = x;
        } else if (x > x_max) {
             x_max = x;
        } 

        if (y < y_min) {
            y_min = y;
        } else if (y > y_max) {
            y_max = y;
        }
    }

    arr[i] = x_min;
    arr[i+1] = y_min;
    arr[i+2] = x_max;
    arr[i+3] = y_max; 

    return arr;
}

/**
 * Conver RGBA image to Grey
 * @param im_data: image databuffer. Uint8Array in Javascript
 * @param cols: image width
 * @param rows: image height
 * @return grey image.
 */
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
 * @param im_data: Image databuffer from Uint8Array.
 * @param cols: Image width.
 * @param rows: Image height.
 * @param result_data: allocated data pointer in emscripten memory buffer, used to return scan result.
 */
extern "C" void func_zbar(uint8_t* im_data, int cols, int rows, uint16_t* result_data) {

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
        
    result_data[0] = n;
    int i = 0;
    for(
        zbar::Image::SymbolIterator symbol = image.symbol_begin(); 
        symbol != image.symbol_end(); 
        ++symbol) 
    {         
        string type = symbol->get_type_name();
        string data = symbol->get_data();
        int loc_size = symbol->get_location_size();

        uint16_t* sym_arr = _func_flat_symbol(type, data, symbol);
        int sym_arr_len = GAIA_ZBAR_INFO_LENGTH + (int)(type.length())+ (int)(data.length()) + 4;
        for(int j=0; j < sym_arr_len; j++) {
            result_data[i+1] = sym_arr[j];
            i++;
        }        
    }  

    delete grey_im;    
    zbar::zbar_image_destroy(image);
}