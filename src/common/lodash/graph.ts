import { LineType, PointStateEnum, PointType, PolygonMapItemType, PolygonMapType, PolygonType, StatePointType, StatePolygonMapType } from "../interface";
import _ from 'lodash'
import __ from './common'
import common from "./common";
const graph = {
    distanceBetwPoint(p1: PointType, p2: PointType) {
        let xx = Math.pow(p1.x - p2.x, 2)
        let yy = Math.pow(p1.y - p2.y, 2)
        return Math.pow(xx + yy, 0.5)
    },
    lineHash(l: LineType): string {
        if (l === null) {
            return null
        } else {
            let p1 = l[0];
            let p2 = l[1];
            if (p1.x > p2.x) {
                return `${p1.x}_${p1.y}_${p2.x}_${p2.y}`
            } else if (p1.x < p2.x) {
                return `${p2.x}_${p2.y}_${p1.x}_${p1.y}`
            }
        }
    },
    pointHash(p: PointType): string {
        if (p === null) {
            return null
        } else {
            return `${p.x}_${p.y}`
        }
    },
    comparePoint(p1: PointType, p2: PointType): boolean {
        if (p1 && p2) {
            return p1.x === p2.x && p1.y === p2.y
        } else {
            return false
        }
    },
    compareLine(l1: LineType, l2: LineType) {
        let hash1 = graph.lineHash(l1);
        let hash2 = graph.lineHash(l2);
        if (hash1 && hash2) {
            return hash1 === hash2
        } else {
            return false
        }
    },
    //获取正中间的最大正方形区域
    getViewPort(port: PointType): [PointType, PointType] {
        let pad = 30;
        let center: PointType = {
            x: Math.floor(port.x / 2),
            y: Math.floor(port.y / 2)
        }
        let radius: number = Math.floor((_.min([port.x, port.y])) / 2 - pad)
        let min = { x: center.x - radius, y: center.y - radius }
        let max = { x: center.x + radius, y: center.y + radius }

        return [min, max]
    },
    //获取环形的随机点
    getRingRandPoint(center: PointType, num: number, radius: number): PointType[] {
        let res: PointType[] = []
        let set: Set<string> = new Set()

        let chunkNum: number = num * 3
        let step = 360 / chunkNum
        while (res.length < num) {
            let rand = _.random(1, chunkNum)
            let p = {
                x: Math.sin(rand * step * Math.PI / 180) * radius + center.x,
                y: Math.cos(rand * step * Math.PI / 180) * radius + center.y
            }
            let hash = graph.pointHash(p)
            if (!set.has(hash)) {
                res.push(p)
                set.add(hash)
            }
        }

        return res
    },
    //获取随机的点
    getRandPoint(num: number, max: PointType): PointType[] {
        let pad = 30;
        let center: PointType = {
            x: Math.floor(max.x / 2),
            y: Math.floor(max.y / 2)
        }
        let radius: number = Math.floor((_.min([max.x, max.y])) / 2 - pad)

        if (!_.isNaN(radius)) {
            let res: PointType[] = []
            for (let i = 0; i < num; i++) {
                let rand = _.random(1, 360)
                res.push({
                    x: Math.sin(rand * Math.PI / 180) * radius + center.x,
                    y: Math.cos(rand * Math.PI / 180) * radius + center.y
                })
            }
            return res
        } else {
            return null;
        }
    },
    getPolygonMap(plist: PointType[], max: PointType): PolygonMapType {
        if (plist.length > 3) {
            //计算线的组合
            let lineArr: PolygonType = []
            for (let i = 1; i < plist.length; i++) {
                lineArr.push([plist[i - 1], plist[i]])
            }
            lineArr.push([plist[plist.length - 1], plist[0]])
            //计算交叉线
            let lineTemp: Array<PointType[]> = [[...lineArr[0]]]
            for (let i = 1; i < lineArr.length; i++) {
                let cur = lineArr[i];
                let cur2 = _.clone(cur)
                for (let j = 0; j < lineTemp.length; j++) {
                    let item = lineTemp[j]
                    let tline: LineType = [item[0], item[1]]
                    let cross = graph.getLineCrossOver(cur, tline);
                    if (cross !== null) {
                        cur2.push(cross);
                        item.push(cross);
                    }
                }
                lineTemp.push([...cur2])
            }

            //创建邻接表，点的邻接表
            //使用x和y中间加个下划线作为map的key
            let map: PolygonMapType = {}

            let addMap = (p: PointType, nearArr: PointType[]) => {
                if (p) {
                    let key = graph.pointHash(p)
                    if (!map[key]) {
                        map[key] = {
                            self: p,
                            set: new Set<PointType>()
                        }
                    }
                    nearArr.forEach(item => {
                        map[key].set.add(item)
                    })
                }
            }
            lineTemp.forEach((arr) => {
                let _arr = graph.sortPointWithdist(arr, arr[0]);
                //添加第一个
                addMap(_arr[0], [_arr[1]])
                //添加中间的
                for (let i = 1; i < _arr.length - 1; i++) {
                    addMap(_arr[i], [_arr[i - 1], _arr[i + 1]])
                }
                //添加最后一个
                addMap(_arr[_arr.length - 1], [_arr[_arr.length - 2]])
            })


            // return graph.rankPolygonMap(map, max);
            return map
        } else {
            return null
        }
    },

    getPolygonMap2(pNum: number, viewPort: PointType): PolygonMapType {
        let [min, max] = graph.getViewPort(viewPort);
        let center = {
            x: (max.x + min.x) / 2,
            y: (max.y + min.y) / 2
        }
        let radius = (max.x - min.x) / 2;

        //只生成一个环
        let itemArr: PolygonMapItemType[] = [];
        let r: PointType[] = graph.getRingRandPoint(center, pNum, radius)
        let set1: Set<PointType> = new Set();
        set1.add(r[1])
        set1.add(r[r.length - 1])
        itemArr.push({
            self: r[0],
            set: set1
        })
        for (let i = 1; i < r.length - 1; i++) {
            let set: Set<PointType> = new Set();
            set.add(r[i + 1])
            set.add(r[i - 1])
            itemArr.push({
                self: r[i],
                set: set
            })
        }
        let set2: Set<PointType> = new Set();
        set2.add(r[0])
        set2.add(r[r.length - 2])
        itemArr.push({
            self: r.pop(),
            set: set2
        })

        try {
            //先要保证这个是联通图，所以要把所有的点都串联起来

            //获取随机数队列
            let arr = common.getRandArr(pNum);

            for (let i = 0; i < arr.length - 1; i++) {
                let rand = arr[i]
                let p1 = itemArr[rand]
                let index = 1
                while (p1.set.size < 3) {
                    let p2 = itemArr[arr[i + index]]
                    if (p2) {
                        p1.set.add(p2.self)
                        p2.set.add(p1.self)
                        index++;
                    } else {
                        break
                    }
                }
            }

            let res: PolygonMapType = {}
            itemArr.forEach(item => {
                res[graph.pointHash(item.self)] = item
            })

            return res
        } catch (e) {
            console.log(e)
            console.log(r)
            return {}
        }
    },
    rankPolygonMap(map: PolygonMapType, port: PointType): PolygonMapType {
        let xStepNum = 10;//每行的格数
        let yStepNum = 10;//每列的格数
        let [min, max] = graph.getViewPort(port);
        //获取最小跨度
        let stepX = Math.floor((max.x - min.x) / xStepNum)
        let stepY = Math.floor((max.y - min.y) / yStepNum)

        //计算每个点所在的格子，如果当前格子被占用，那么移动到下一个格子
        let filledBox: Set<number> = new Set<number>()

        const getBox = (p: PointType) => {
            let xIndex = Math.ceil((p.x - min.x) / stepX)
            let yIndex = Math.ceil((p.y - min.y) / stepY)

            return { x: xIndex, y: yIndex }
        }

        const getIndex = (box: PointType) => {
            return yStepNum * (box.y - 1) + box.x
        }

        let res: PolygonMapType = {}
        __.traverseMap<PolygonMapItemType>(map, (item, key) => {
            let p = item.self;
            //计算所在的格子
            let box = getBox(p);

            //如果当前格子有点，那么移动格子
            let step = 1
            let boxIndex = getIndex(box)
            while (filledBox.has(boxIndex)) {
                let near = graph.getNearBox(box, step)
                for (let item of near) {
                    if (_.inRange(item.x, 0, xStepNum - 1) && _.inRange(item.y, 0, yStepNum - 1)) {
                        if (!filledBox.has(getIndex(item))) {
                            box = item;
                            break
                        }
                    }
                }
                boxIndex = getIndex(box)
                step++;
            }


            filledBox.add(boxIndex)
            //如果当前格子没有点，那么点移动到格子正中间
            p.x = box.x * stepX + (stepX / 2)
            p.y = box.y * stepY + (stepY / 2)
            res[graph.pointHash(p)] = item
        })
        return res
    },
    getNearBox(p: PointType, step: number = 1): PointType[] {
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

        let tp = 2 * step
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
                x: rb.x,
                y: rb.y - i
            })
            res.push({
                x: rb.x - i,
                y: rb.y
            })
        }
        res.push(lt)
        res.push(rb)
        res.push({
            x: p.x + step,
            y: p.y - step
        })
        res.push({
            x: p.x - step,
            y: p.y + step
        })
        return res
    },
    getLineArrFromPolygonMap(polygon: PolygonMapType): Array<LineType> {
        let list: LineType[] = []
        for (let key of _.keys(polygon)) {
            let item = polygon[key]
            for (let p of item.set) {
                list.push([item.self, p])
            }
        }
        let res = _.uniqBy<LineType>(list, (item) => {
            return graph.lineHash(item)
        })
        return res
    },
    getPointArrFromPolygonMap(polygon: PolygonMapType): Array<PointType> {
        let res: PointType[] = [];
        for (let key of _.keys(polygon)) {
            res.push(polygon[key].self)
        }
        return res;
    },
    selectPoint(tap: PointType, path: PointType[], polygonMap: PolygonMapType, max: number): PointType {
        let res: PointType = null

        __.traverseMap<{ self: PointType, set: Set<PointType> }>(polygonMap, (item, key): boolean => {
            let p = item.self;
            if (graph.distanceBetwPoint(tap, p) < max) {

                res = p

                let last = path[path.length - 1]
                //如果是path的结尾也就是上一个点击的点，那么取消这个点
                if (graph.comparePoint(p, last)) {
                    if (path.length > 1) {
                        path.pop()
                    }
                }
                //不是上一个点的点，如果是可以点击的点，那么加入path
                let lastMap = polygonMap[graph.pointHash(last)].set
                let canArr = graph.getCanSelectPoint(lastMap, path.slice(1))
                canArr.forEach(_p => {
                    if (graph.comparePoint(_p, p)) {
                        path.push(p)
                    }
                })
                return true
            } else {
                return false
            }
        })
        return res
    },
    //返回被点击的那个按钮
    selectPoint2(tap: PointType, polygon: StatePolygonMapType, polygonMap: PolygonMapType, max: number, noSelectCanSelect?: boolean): PointType {
        let res: PointType = null
        __.traverseMap<StatePointType>(polygon, (item, key): boolean => {
            let p = item.point;
            if (graph.distanceBetwPoint(tap, p) < max) {
                res = p
                //如果点击的是已选择的,则取消点击，如果可点击的则改为点击
                if (item.state === PointStateEnum.selected) {
                    item.state = PointStateEnum.noSelect
                } else {
                    if (noSelectCanSelect) {
                        item.state = PointStateEnum.selected
                    } else {
                        if (item.state === PointStateEnum.canSelect) {
                            item.state = PointStateEnum.selected
                        }
                    }
                }
                return true
            } else {
                return false
            }
        })
        return res
    },
    getPathFromStatePolygon(polygon: StatePolygonMapType, polygonMap: PolygonMapType): PointType[] {
        let selectArr: PointType[] = []
        __.traverseMap<StatePointType>(polygon, (item) => {
            if (item.state === PointStateEnum.selected) {
                selectArr.push(item.point)
            }
        })
        let res: PointType[] = []
        //获取邻接表中有几个点一样，然后分左右两条线开始计算
        //计算了左右，就合并
        if (selectArr.length > 0) {
            let centerp = selectArr[0]
            let set = polygonMap[graph.pointHash(centerp)].set
            let start2Arr: PointType[] = [];
            for (let p of set) {
                let hashcode = graph.pointHash(p)
                if (polygon[hashcode]) {
                    start2Arr.push(p)
                }
            }
            if (start2Arr.length === 0) {
                return [centerp]
            } else if (start2Arr.length === 1) {
                return graph.getPathFromStatePolygonWithStart(polygon, polygonMap, centerp, start2Arr[0])
            } else {
                let line0 = graph.getPathFromStatePolygonWithStart(polygon, polygonMap, centerp, start2Arr[0])
                line0.shift()
                let line1 = graph.getPathFromStatePolygonWithStart(polygon, polygonMap, centerp, start2Arr[1])
                line1.shift()
                line0 = _.reverse(line0)

                return [...line0, centerp, ...line1]
            }
        } else {
            return []
        }

    },

    //两点才能确定一条线段，所以初始化要两个点
    getPathFromStatePolygonWithStart(polygon: StatePolygonMapType, polygonMap: PolygonMapType, start1: PointType, start2: PointType): Array<PointType> {
        //获取开始点2的邻接表
        let set = polygonMap[graph.pointHash(start2)].set
        //逐个查看邻接表中的点在不在选中点内,并且这个点不等于开始点1
        for (let p of set) {
            if (!graph.comparePoint(p, start1)) {
                let hashcode = graph.pointHash(p)
                if (polygon[hashcode]) {
                    let sub = graph.getPathFromStatePolygonWithStart(polygon, polygonMap, start2, p)
                    return [start1, start2, ...sub]
                }
            }

        }
        return [start1, start2]
    },
    //计算两条线段的交点
    getLineCrossOver(line1: LineType, line2: LineType, point: boolean = true): PointType {
        //线段ab的法线N1  
        let a = line1[0]
        let b = line1[1]
        let c = line2[0]
        let d = line2[1]

        //先判断是否有交点，如果一条线在另一条线的一侧，那么一条线两个端点到另一条两个端点的旋性是相同的
        //比如线段ab和cd，如果cd两个点在ab的一侧，那么a->c->b和a->d->c的旋形相同，如果不在一侧，则不同
        // 计算旋性
        let area_abc = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);
        if (area_abc === 0 && point) {
            return c
        }
        let area_abd = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x);
        if (area_abd === 0 && point) {
            return d
        }
        //旋形相同，就是在同一侧
        if (area_abc * area_abd >= 0) {
            return null;
        }

        // 同样方式换一条线计算
        let area_cda = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x);
        if (area_cda === 0 && point) {
            return a
        }
        let area_cdb = area_cda + area_abc - area_abd;
        if (area_cdb === 0 && point) {
            return b
        }
        if (area_cda * area_cdb >= 0) {
            return null;
        }

        //计算交点坐标  
        let t = area_cda / (area_abd - area_abc);
        let dx = t * (b.x - a.x),
            dy = t * (b.y - a.y);
        return { x: a.x + dx, y: a.y + dy };
    },


    getStatePolygon(polygon: PolygonMapType): StatePolygonMapType {
        let res: StatePolygonMapType = {}
        for (let key of _.keys(polygon)) {
            res[key] = {
                state: PointStateEnum.noSelect,
                point: polygon[key].self
            }
        }

        return res
    },
    /**
     * 给定一组点和一个起始点，按照最近原则排序所有点
     */
    sortPointWithdist(arr: PointType[], start: PointType): Array<PointType> {
        let res = [start];
        let tempArr = _.clone(arr)
        let curP = start
        while (tempArr.length > 1) {
            let minP: PointType = null;
            let mind: number = null;
            let temp: PointType[] = []
            tempArr.forEach((p) => {
                let dist = graph.distanceBetwPoint(p, curP);
                if (dist > 0) {
                    temp.push(p);

                    if ((mind === null) || (mind > dist)) {
                        mind = dist;
                        minP = p;
                    }
                }
            })
            if (minP) {
                res.push(minP)
                curP = minP
            }
            tempArr = temp
        }

        return res;
    },
    getCanSelectPoint(maybe: PointType[] | Set<PointType>, cannot: PointType[] | Set<PointType>) {
        let set: Set<string> = new Set<string>()
        for (let p of cannot) {
            set.add(graph.pointHash(p))
        }
        let res: PointType[] = []
        for (let p of maybe) {
            if (!set.has(graph.pointHash(p))) {
                res.push(p)
            }
        }

        return res
    }
}

export default graph