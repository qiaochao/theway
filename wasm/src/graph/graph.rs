use crate::graph::point::Point;




pub fn compare_point(p1: Point, p2: Point) -> bool {
    return p1.x == p2.x && p1.y == p2.y;
}
