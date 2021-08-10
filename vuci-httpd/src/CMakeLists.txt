cmake_minimum_required(VERSION 3.0)

project(vuci-httpd C)

list(APPEND CMAKE_MODULE_PATH "${CMAKE_SOURCE_DIR}/cmake/Modules/")

include(FindPkgConfig)

find_package(Libev REQUIRED)
find_package(Libuhttpd 3.12 REQUIRED)
find_package(Lua51 REQUIRED)

pkg_search_module(JANSSON REQUIRED jansson)
pkg_search_module(SQLITE3 REQUIRED sqlite3)

add_definitions(-D_GNU_SOURCE)
add_compile_options(-O -Wall -Werror --std=gnu99)

include_directories(${LUA_INCLUDE_DIR})

aux_source_directory(. SRCS)

add_executable(vuci-httpd ${SRCS})
target_include_directories(vuci-httpd PRIVATE ${LIBUHTTPD_INCLUDE_DIR} ${LIBEV_INCLUDE_DIR} ${JANSSON_INCLUDE_DIRS} ${SQLITE3_INCLUDE_DIRS})
target_link_libraries(vuci-httpd PRIVATE ${LIBUHTTPD_LIBRARY} ${LIBEV_LIBRARY} ${LUA_LIBRARY} ${JANSSON_LIBRARIES} ${SQLITE3_LIBRARIES} pthread)

install(
	TARGETS vuci-httpd
	DESTINATION bin
)

add_subdirectory(lua)
