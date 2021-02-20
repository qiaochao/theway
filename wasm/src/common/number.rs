use std::cmp::Ordering;
use std::hash::{Hash, Hasher};
use std::ops::{Add, Div, Mul, Sub};
#[derive(Debug)]
pub struct Number(f64);

impl Number {
    pub fn from_i32(v: i32) -> Number {
        return Number(v as f64);
    }
    pub fn from_f32(v: f32) -> Number {
        return Number(v as f64);
    }
    pub fn from_u32(v: u32) -> Number {
        return Number(v as f64);
    }
    pub fn from_i64(v: i64) -> Number {
        return Number(v as f64);
    }
    pub fn from_u64(v: u64) -> Number {
        return Number(v as f64);
    }
    pub fn from_f64(v: f64) -> Number {
        return Number(v as f64);
    }

    pub fn to_i32(&self) -> i32 {
        return self.v() as i32;
    }
    pub fn to_f32(&self) -> f32 {
        return self.v() as f32;
    }
    pub fn to_u32(&self) -> u32 {
        return self.v() as u32;
    }
    pub fn to_i64(&self) -> i64 {
        return self.v() as i64;
    }
    pub fn to_u64(&self) -> u64 {
        return self.v() as u64;
    }
    pub fn to_f64(&self) -> f64 {
        return self.v() as f64;
    }

    pub fn v(&self) -> f64 {
        self.0
    }

    pub fn powi(self, n: i32) -> Self {
        Number(self.v().powi(n))
    }

    pub fn powf(self, n: f64) -> Self {
        Number(self.v().powf(n))
    }
}

impl Clone for Number {
    fn clone(&self) -> Self {
        Number(self.v())
    }
}
impl Copy for Number {}

impl PartialEq for Number {
    fn eq(&self, other: &Self) -> bool {
        self.v() == other.v()
    }
}

impl Eq for Number {}

impl PartialOrd for Number {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        self.v().partial_cmp(&other.v())
    }
}
impl Ord for Number {
    fn cmp(&self, other: &Self) -> Ordering {
        let n = self.v() - other.v();
        match n {
            n if n > 0.0 => Ordering::Greater,
            n if n < 0.0 => Ordering::Less,
            _ => Ordering::Equal,
        }
    }
}
impl Add for Number {
    type Output = Self;
    fn add(self, other: Self) -> Self::Output {
        Self(self.v().add(other.v()))
    }
}

impl Sub<Number> for Number {
    type Output = Self;
    fn sub(self, other: Self) -> Self::Output {
        Self(self.v().sub(other.v()))
    }
}

impl Mul<Number> for Number {
    type Output = Self;
    fn mul(self, rhs: Self) -> Self::Output {
        Self(self.v().mul(rhs.v()))
    }
}

impl Div<Number> for Number {
    type Output = Self;
    fn div(self, rhs: Self) -> Self::Output {
        Self(self.v().div(rhs.v()))
    }
}

impl ToString for Number {
    fn to_string(&self) -> String {
        format!("{}", self.v())
    }
}

impl Hash for Number {
    fn hash<H: Hasher>(&self, state: &mut H) {
        let ss = format!("{}", self.v());
        ss.hash(state);
    }
}
