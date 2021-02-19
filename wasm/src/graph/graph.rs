use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};
#[derive(Hash, PartialEq, Eq)]
pub struct Point {
    pub x: i32,
    pub y: i32,
}

impl Point {
    pub fn new(x: i32, y: i32) -> Point {
        return Point { x: x, y: y };
    }
}

pub struct Line(Point, Point);

impl Hash for Line {
    fn hash<H: Hasher>(&self, state: &mut H) {
        let p1t = self.0;
        let p2t = self.1;
        let mut p1;
        let mut p2;
        if p1t.x > p2t.x {
            p1 = p1t;
            p2 = p2t;
        } else {
            p1 = p2t;
            p2 = p1t;
        }

        p1.hash(state);
        p2.hash(state);
    }
}

impl PartialEq for Line {
    fn eq(&self, other: &Self) -> bool {
        let mut s1 = DefaultHasher::new();
        self.hash(&mut s1);
        let h1=s1.finish();


        let mut s2 = DefaultHasher::new();
        other.hash(&mut s2);
        let h2=s2.finish();

        h1==h2
    }
}
impl Eq for Line {}

pub fn distance_between_point(p1: Point, p2: Point) -> f32 {
    let xx = (p1.x - p2.x).pow(2);
    let yy = (p1.y - p2.y).pow(2);
    let add = (xx + yy) as f32;
    return add.powf(0.5);
}

pub fn compare_point(p1: Point, p2: Point) -> bool {
    return p1.x == p2.x && p1.y == p2.y;
}
