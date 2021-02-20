use crate::common::number::Number;
#[derive(Hash, PartialEq, Eq,Debug,Clone)]
pub struct Point {
    pub x: Number,
    pub y: Number,
}




impl Point {
    pub fn new(x: Number, y: Number) -> Point {
        return Point { x: x, y: x };
    }

    pub fn distance_between_point(&self, p2: Point) -> Number {
        let xx = (self.x - p2.x).powi(2);
        let yy = (self.y - p2.y).powi(2);
        let add = xx+yy;
        return add.powf(0.5);
    }


}

