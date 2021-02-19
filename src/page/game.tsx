import React, { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from '@src/style/game.m.less'
import { PointType, PolygonMapItemType, PolygonMapType, SettingStateType } from '@src/common/interface';
import _ from '@src/common/lodash/index'
import { StateType } from '@src/common/interface'
import { setPointNum } from '@src/redux/actions'





export function GamePage(): React.ReactElement {

    const [game, setGame] = useState<{ instante: { reSet: () => void, newGame: () => void } }>({ instante: null })
    const [pathLength, setPathLength] = useState<{ selected: number, noSelected: number }>({ selected: 0, noSelected: 0 })

    const newGame = () => {
        console.log(game)
        if (game.instante) {
            game.instante.newGame()
        }
    }

    const reSet = () => {
        if (game) {
            game.instante.reSet()
        }
    }

    return <div className={styles.game}>
        <Header newGame={newGame} reSet={reSet} selected={pathLength.selected} noSelected={pathLength.noSelected}></Header>

        <div className={styles.content}>
            <div className={styles.explain}>
                <h1>游戏说明</h1>
                <p className={styles.text}>
                    点说明：起始点是蓝色的，可选择点是黄色的，不可选择点是白色的。
                    游戏的目的就是找到一条串联所有的点的路径，最后回到起始点
            </p>
            </div>
            <Game instant={(gameIn) => {
                game.instante = gameIn
            }}
                pathChange={(selected, noSelected) => {
                    setPathLength({
                        selected: selected,
                        noSelected: noSelected
                    })
                }}
            />
        </div>
    </div>
}

function Header(prop: { newGame: () => void, reSet: () => void , selected: number, noSelected: number}): React.ReactElement {
    const dispatch = useDispatch()

    return <div className={styles.header}>
        <button className={styles.button} onClick={() => prop.newGame()}>新游戏</button>

        <button className={styles.button} onClick={() => prop.reSet()}>重置</button>
        <div className={styles.button}>
            <label>选择定点的数量</label>
            <select className={styles.button} onChange={(e) => {
                let num = parseInt(e.target.value)
                if (!_.isNaN(num)) {
                    dispatch(setPointNum(num))
                }
            }}>
                <option value="6">6个定点</option>
                <option value="8">8个定点</option>
                <option value="10">10个定点</option>
                <option value="12">12个定点</option>
            </select>
        </div>
        <div className={styles.button}>
            <label>已选中</label>
            <span>{prop.selected}</span>
            <label>；未选中</label>
            <span>{prop.noSelected}</span>
        </div>

    </div>
}


function Game(prop: {
    instant: (game: { newGame: () => void, reSet: () => void }) => void,
    pathChange: (selected: number, noSelected: number) => void
}): React.ReactElement {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hw, setHW] = useState<PointType>({ x: 1200, y: 1000 })
    const [canvasStyle, setCanvasStyle] = useState<{ width: number | string, height: number | string }>({ width: '100%', height: '100%' })
    const [polygonMap, setPolygonMap] = useState<PolygonMapType>(null)
    const [startP, setStartP] = useState<PointType>(null)
    const [path, setPath] = useState<PointType[]>([])



    const setting: SettingStateType = useSelector<StateType, any>(state => {
        let res: SettingStateType = {
            pointRadius: state.setting.pointRadius,
            pointNum: state.setting.pointNum,
            selectRadius: state.setting.selectRadius
        }
        return res
    })



    useEffect(() => {
        newGame()
    }, [canvasRef, setting.pointNum])


    const reSet = () => {
        let ele = canvasRef.current;
        if (ele !== null) {
            setPath([startP])
            reDraw()
        }
    }

    const newGame = () => {
        let ele = canvasRef.current;
        if (ele !== null) {
            let max: PointType = {
                x: ele.scrollWidth,
                y: ele.scrollHeight
            }
            setHW(max)
            setCanvasStyle({
                width: max.x,
                height: max.y
            })
            // let topList: PointType[] = _.getRandPoint(setting.pointNum, max)

            let polygon: PolygonMapType = _.getPolygonMap2(setting.pointNum, max)
            setPolygonMap(polygon)
            console.log(polygon)
            let firstp = polygon[_.keys(polygon)[0]]
            setStartP(firstp.self)
            setPath([firstp.self])
        }
    }

    prop.instant({ reSet: reSet, newGame: newGame })

    useEffect(() => {
        reDraw()
    }, [polygonMap])

    const reDraw = () => {
        let ele = canvasRef.current;
        if (ele !== null) {
            let ctx: CanvasRenderingContext2D | null = ele.getContext('2d');

            ctx?.clearRect(0, 0, hw.x, hw.y)

            if (_.keys(polygonMap).length > 3) {
                //绘制所有的线段
                _.getLineArrFromPolygonMap(polygonMap).forEach((line) => {
                    if (ctx !== null) {
                        let start = line[0];
                        let end = line[1];
                        ctx.strokeStyle = "#0000FF";
                        ctx.beginPath();
                        ctx.moveTo(start.x, start.y);
                        ctx.lineWidth = 3;
                        ctx.lineTo(end.x, end.y);
                        ctx.stroke();
                    }
                })

                //绘制已经成型的线段
                for (let i = 1; i < path.length; i++) {
                    let start = path[i - 1]
                    let end = path[i]
                    ctx.strokeStyle = "#FF1155";
                    ctx.beginPath();
                    ctx.moveTo(start.x, start.y);
                    ctx.lineWidth = 3;
                    ctx.lineTo(end.x, end.y);
                    ctx.stroke();
                }

                //绘制所有的点
                _.traverseMap<PolygonMapItemType>(polygonMap, (item, key) => {
                    ctx.beginPath()
                    ctx.strokeStyle = "#000000";
                    ctx.lineWidth = 1;
                    ctx.fillStyle = "#FFFFFF";
                    let top = item.self
                    ctx.arc(top.x, top.y, setting.pointRadius, 0, 2 * Math.PI);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                })



                //绘制可以选择的点
                let maybeSet = polygonMap[_.pointHash(path[path.length - 1])].set
                let canArr = _.getCanSelectPoint(maybeSet, path)
                canArr.forEach((top) => {
                    ctx.beginPath()
                    ctx.lineWidth = 1;
                    ctx.fillStyle = "#FFFF00";
                    ctx.arc(top.x, top.y, setting.pointRadius, 0, 2 * Math.PI);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                })

                //绘制起点
                ctx.beginPath()
                ctx.lineWidth = 1;
                ctx.fillStyle = "#00FFFF";
                ctx.arc(startP.x, startP.y, setting.pointRadius, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                //绘制被选择的点
                path.slice(1).forEach((top) => {
                    ctx.beginPath()
                    ctx.lineWidth = 1;
                    ctx.fillStyle = "#FF1155";
                    ctx.arc(top.x, top.y, setting.pointRadius, 0, 2 * Math.PI);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                })
            }


            prop.pathChange(path.length, setting.pointNum - path.length)
        }
    }

    const onClike = (ev) => {
        let nav = ev.nativeEvent
        let tap: PointType = {
            x: nav.offsetX,
            y: nav.offsetY,
        }
        let seleP = _.selectPoint(tap, path, polygonMap, setting.selectRadius)
        reDraw()
        if (path.length > 1 && _.comparePoint(startP, path[path.length - 1])) {
            gameEnd()
        }
    }

    const gameEnd = () => {
        path.pop()
        //TODO 游戏结束时
        alert('游戏结束')
    }


    return <canvas onClick={onClike} width={hw.x} height={hw.y} style={canvasStyle} className={styles.canvas} ref={canvasRef} />

}