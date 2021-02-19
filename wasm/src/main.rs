mod graph;
use graph::line::Line;
use graph::point::Point;

fn main() {
    test_line_compare();
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
    let p1 = Point::new(11, 13);
    let p2 = Point::new(11, 12);
    let p3 = Point::new(11, 13);
    let p4 = Point::new(11, 12);
    let line1 = Line(p2, p1);
    let line2= Line(p3,p4);
    println!("{}", line1==line2)
}
