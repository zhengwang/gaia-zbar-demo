#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#endif

#include "msgpack.hpp"
#include "opencv2/core.hpp"
#include <string>

using namespace cv;

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
extern "C" uint8_t* func_canny(uint8_t* im_data, int cols, int rows) {
    Mat im(rows, cols, CV_8UC4, im_data);
    return im.data;
}

