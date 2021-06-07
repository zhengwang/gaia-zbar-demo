#include <msgpack.hpp>
#include "opencv2/core.hpp"

#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#endif

struct Address {
public:
    MSGPACK_DEFINE_MAP(firstName, lastName, zip, city, street, state);
    std::string firstName;
    std::string lastName;
    int zip;
    std::string city;
    std::string state;
    std::string street;
};

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
extern "C" char* get_address(unsigned long* size) {
    Address address;

    address.firstName = "Joe";
    address.lastName = "Smith";
    address.zip = 123456;
    address.state = "NY";
    address.city = "Test Town";
    address.street = "Test St. 123";

    msgpack::sbuffer sbuf;
    msgpack::pack(sbuf, address);

    *size = sbuf.size();
    return sbuf.data();
}


struct Expression {
public:
    MSGPACK_DEFINE_MAP(operand1, operand2);
    int operand1;
    int operand2;
};

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
extern "C" long add_number(char* expr, int bufferSize) {
    msgpack::object_handle oh = msgpack::unpack(expr, bufferSize);
    msgpack::object obj = oh.get();
    
    Expression expression;
    obj.convert(expression);

    return expression.operand1 + expression.operand2;
}