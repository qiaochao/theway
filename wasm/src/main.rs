mod graph;
mod common;
use graph::line::Line;
use graph::point::Point;
use common::number::Number;
use std::collections::{HashSet};
fn main() {

    let n1=Number::from_f32(12.05);
    let n2=Number::from_f32(12.0511);
    let n3=n2/n1;
    let addr1 = &n1 as *const Number as usize;
    let addr2 = &n2 as *const Number as usize;
    let addr3 = &n3 as *const Number as usize;
    println!("{:?}",n3);
    println!("{:?}",addr1);
    println!("{:?}",addr2);
    println!("{:?}",addr3);

    let mut set:HashSet<Number> = HashSet::new();
    set.insert(n1);
    set.insert(n2);
    println!("{:?}",set);
}

fn test_distance_between_point() {
    let p1 = Point::new(11, 12);
    let p2 = Point { x: 22, y: 56 };
    let dist = p1.distance_between_point(p2);
    println!("{}", dist);
}

fn test_compare_point() {
    let p1 = Point::new(11, 13);
    let p2 = Point::new(11, 12);
    let eq = p1 == p2;
    let cc = if eq { "yiyang" } else { "buyiyang" };
    println!("{}", cc);
}

fn test_line_compare() {
    let p1 = Point::new(11, 12);
    let p2 = Point::new(11, 12);
    let p3 = Point::new(11, 11);
    let p4 = Point::new(11, 12);
    let line1 = Line(p2, p1);
    let line2 = Line(p3, p4);
    println!("{}", line1 == line2)
}

fn test_get_view_port() {
    let port = Point::new(400, 500);
    println!("{:?}", graph::graph::get_view_port(port));
}
