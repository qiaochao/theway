use std::hash::Hash;

mod graph;
fn main() {
    test_compare_point();
}

fn test_distance_between_point(){
    let p1=graph::Point::new(11, 12);
    let p2=graph::Point{
        x:22,
        y:56
    };
    let dist=graph::distance_between_point(p1, p2);
    println!("{}",dist);
}

fn test_compare_point(){
    let p1=graph::Point::new(11, 13);
    let p2=graph::Point::new(11, 12);
    println!("{}",);
    println!("{}",graph::compare_point(p1, p2));
}


