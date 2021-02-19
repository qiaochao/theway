#[derive(Hash, PartialEq, Eq)]
pub struct Point {
    pub x: i32,
    pub y: i32,
}




impl Point {
    pub fn new(x: i32, y: i32) -> Point {
        return Point { x: x, y: y };
    }

    pub fn distance_between_point(&self, p2: Point) -> f32 {
        let xx = (self.x - p2.x).pow(2);
        let yy = (self.y - p2.y).pow(2);
        let add = (xx + yy) as f32;
        return add.powf(0.5);
    }


}

