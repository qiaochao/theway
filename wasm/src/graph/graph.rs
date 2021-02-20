use crate::common::number::Number;
use crate::graph::line::Line;
use crate::graph::point::Point;
use std::cmp;
use std::collections::HashSet;
#[derive(Debug)]
pub struct ViewPort {
    pub diagonal: Line,
    pub center: Point,
}

pub fn get_view_port(port: Point) -> ViewPort {
    let center = Point::new(port.x / Number::from_i32(2), port.y / Number::from_i32(2));
    let radius = cmp::min(port.x, port.y) / Number::from_i32(2) - get_padding(port);
    let min = Point::new(center.x - radius, center.y - radius);
    let max = Point::new(center.x + radius, center.y + radius);
    return ViewPort {
        center,
        diagonal: Line(min, max),
    };
}

pub fn get_padding(port: Point) -> Number {
    let min = cmp::min(port.x, port.y);
    return min / Number::from_i32(10);
}

pub fn get_ring_rand_point(center: Point, num: i32, radius: i32) -> Vec<Point> {
    let res: Vec<Point> = Vec::new();

    let set: HashSet<Point> = HashSet::new();
    let chunkNum: i32 = num * 3;
    let step = 360 / chunkNum;

    //TODO:还没有做完

    return res;
}
