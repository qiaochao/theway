function getNearBox(p: PointType, step: number = 1): PointType[] {
    //获取四周的九宫格
    let res: PointType[] = [];
    let lt = {
        x: p.x - step,
        y: p.y - step
    }
    let rb = {
        x: p.x + step,
        y: p.y + step
    }

    let tp = Math.pow(2, step)
    //从左上角开始走
    for (let i = 1; i < tp; i++) {
        res.push({
            x: lt.x,
            y: lt.y + i
        })
        res.push({
            x: lt.x + i,
            y: lt.y
        })
    }

    //从右下角开始走
    for (let i = 1; i < tp; i++) {
        res.push({
            x: lt.x,
            y: lt.y - i
        })
        res.push({
            x: lt.x - i,
            y: lt.y
        })
    }
    res.push(lt)
    res.push(rb)
    return res
}