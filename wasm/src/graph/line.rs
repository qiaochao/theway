use crate::graph::point::Point;
use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};
#[derive(Debug,Clone)]
pub struct Line(pub Point, pub Point);

impl Hash for Line {
    fn hash<H: Hasher>(&self, state: &mut H) {
        let p1t = &self.0;
        let p2t = &self.1;
        let p1;
        let p2;
        if p1t.x > p2t.x {
            p1 = p1t;
            p2 = p2t;
        } else if (p1t.x == p2t.x) {
            if p1t.y > p2t.y {
                p1 = p1t;
                p2 = p2t;
            } else {
                p1 = p2t;
                p2 = p1t;
            }
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
        let h1 = s1.finish();

        let mut s2 = DefaultHasher::new();
        other.hash(&mut s2);
        let h2 = s2.finish();

        h1 == h2
    }
}
impl Eq for Line {}
