#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#endif

#include "zbar.h"
// #include <msgpack.hpp>
// #include "opencv2/core.hpp"
// #include "opencv2/imgproc.hpp"
#include <string>
#include <cstring>

using namespace std;

// struct DecodeObject{
//     // MSGPACK_DEFINE_MAP(type, data, amt);
//     string type;
//     string data;    
// };

// #ifdef __cplusplus
// extern "C" {
// #endif
// extern void log_float_arr(const float* data_buffer_ptr, int data_buffer_size);
// extern void log_char_arr(const char* data_buffer_ptr, int data_buffer_size);
// #ifdef __cplusplus
// }
// #endif

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
extern "C" uint8_t* func_zbar(uint8_t* im_data, int cols, int rows) {
    // cv::Mat mat(rows, cols, CV_8UC4, im_data);
    // cv::cvtColor(mat, mat, cv::COLOR_RGBA2GRAY);

    zbar::ImageScanner scanner;
    scanner.set_config(zbar::ZBAR_NONE, zbar::ZBAR_CFG_ENABLE, 1);
    // zbar::Image image(mat.cols, mat.rows, "Y800", (uchar *)mat.data, mat.cols * mat.rows);      
    uint8_t* grey_im = _func_rgba_2_gray(im_data, cols, rows);
    zbar::Image image(
        cols, 
        rows, 
        "Y800", // "BGR4 (RGB32)"
        (uint8_t*)grey_im,
        cols * rows);   

    int n = scanner.scan(image);  

    // ------------ Debug Log ---------------
    // string msg1 = "after scan";
    // log_char_arr(msg1.c_str(), 256);	
    // ------------ Debug Log ---------------
    
    uint8_t* data_chunk = new uint8_t[128];
    data_chunk[0] = n;
    int i = 0;
    for(zbar::Image::SymbolIterator symbol = image.symbol_begin(); symbol != image.symbol_end(); ++symbol) {         
        string type = symbol->get_type_name();
        string data = symbol->get_data();

        uint8_t* sym_arr = _func_flat_symbol(type, data);
        int sym_arr_len = (int)(type.length())+ (int)(data.length()) + 2;
        for(int j=0; j < sym_arr_len; j++) {
            data_chunk[i+1] = sym_arr[j];
            i++;
        }
    }

    // ------------ Debug Log ---------------
    // string msg2 = "after iteration";
    // log_char_arr(msg2.c_str(), 256);	
    // ------------ Debug Log ---------------
        

    return data_chunk;

}

// #ifdef __EMSCRIPTEN__
// EMSCRIPTEN_KEEPALIVE
// #endif
// extern "C" uint8_t* func_cvtcolor(uint8_t* im_data, int cols, int rows) {
// 	cv::Mat mat(rows, cols, CV_8UC4, im_data);	
// 	cv::cvtColor(mat, mat, cv::COLOR_RGBA2GRAY);

//     cv::cvtColor(mat, mat, cv::COLOR_GRAY2RGBA);	
//     return mat.data;
// }