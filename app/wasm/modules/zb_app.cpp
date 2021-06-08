#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#endif

#include "zbar.h"
#include <msgpack.hpp>
#include "opencv2/core.hpp"
#include "opencv2/imgproc.hpp"
#include <string>

using namespace std;

struct DecodeObject{
    MSGPACK_DEFINE_MAP(type, data, amt);
    string type;
    string data;
    int amt;
};

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
extern "C" char* func_zbar(uint8_t* im_data, int cols, int rows, uint8_t* size) {
    cv::Mat mat(rows, cols, CV_8UC4, im_data);
    cv::cvtColor(mat, mat, cv::COLOR_RGBA2GRAY);

    zbar::ImageScanner scanner;
    scanner.set_config(zbar::ZBAR_NONE, zbar::ZBAR_CFG_ENABLE, 1);
    zbar::Image image(mat.cols, mat.rows, "Y800", (uchar *)mat.data, mat.cols * mat.rows);
    int n = scanner.scan(image);

    // Print results
    DecodeObject obj;
    for(zbar::Image::SymbolIterator symbol = image.symbol_begin(); symbol != image.symbol_end(); ++symbol) {    
        obj.type = symbol->get_type_name();
        obj.data = symbol->get_data();
        obj.amt = n;
    }

    msgpack::sbuffer sbuf;
    msgpack::pack(sbuf, obj);

    *size = sbuf.size();
    return sbuf.data();            
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
extern "C" uint8_t* func_cvtcolor(uint8_t* im_data, int cols, int rows) {
	cv::Mat mat(rows, cols, CV_8UC4, im_data);	
	cv::cvtColor(mat, mat, cv::COLOR_RGBA2GRAY);
	
	zbar::ImageScanner scanner;
    scanner.set_config(zbar::ZBAR_NONE, zbar::ZBAR_CFG_ENABLE, 1);
    zbar::Image image(mat.cols, mat.rows, "Y800", (uchar *)mat.data, mat.cols * mat.rows);
    int n = scanner.scan(image);
    DecodeObject obj;
    for(zbar::Image::SymbolIterator symbol = image.symbol_begin(); symbol != image.symbol_end(); ++symbol) {    
        obj.type = symbol->get_type_name();
        obj.data = symbol->get_data();
        obj.amt = n;
    }

    msgpack::sbuffer sbuf;
    msgpack::pack(sbuf, obj);

    // *size = sbuf.size();
    // return sbuf.data();    
    cv::cvtColor(mat, mat, cv::COLOR_GRAY2RGBA);	
    return mat.data;
}