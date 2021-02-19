import _ from '../common/lodash'


test('test any',()=>{
    let arr=[{x:0,y:0},{x:5,y:5},{x:1,y:1},{x:2,y:2},{x:2,y:2}]
    console.log(_.sortPointWithdist(arr,{x:0,y:0}))
    expect(_.sortPointWithdist(arr,{x:0,y:0})).toBe(null);

})



// test('test polygon',()=>{
//     let arr=[{x:10,y:10},{x:13,y:0},{x:5,y:6},{x:15,y:6},{x:7,y:0}]
//     _.getPolygonMap(arr)
//     expect(_.sortPointWithdist(arr,{x:0,y:0})).toBe(null);

// })


// test('test polygonMaptoArr',()=>{
//     let arr=[{x:10,y:10},{x:13,y:0},{x:5,y:6},{x:15,y:6},{x:7,y:0}]
//     let map=_.getPolygonMap(arr);
//     let arr2=_.getLineArrFromPolygonMap(map)
//     expect(_.sortPointWithdist(arr,{x:0,y:0})).toBe(null);
// })


test('getNearBox',()=>{
    let near=_.getPolygonMap2(4,{x:500,y:500})
    console.log(near)
    expect(near).toBe(null);

})

test('getRandArr',()=>{
    let near=_.getRandArr(6)
    console.log(near)
    expect(near).toBe(null);

})