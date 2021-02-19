import React from 'react'
import styles from '@src/style/start.m.less'
import { useSelector, useDispatch } from 'react-redux'
import {toGamePage, toStartPage} from '@src/redux/actions'
import { PageEnum, StateType } from '@src/common/interface'

export function StartPage(): React.ReactElement {
    let dispatch=useDispatch()
    let page=useSelector((state:StateType)=>state.page)
    setTimeout(()=>{
        dispatch(toGamePage())
    },100)
    return <div className={styles.start}>
        <div>
            {page}
        </div>
        <button onClick={()=>{
            dispatch(toGamePage())
        }}>开始游戏</button>
        <div>

        </div>
    </div>
}

