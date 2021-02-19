import {ActionEnum, ActionType, SettingStateType} from "@src/common/interface";



export function toGamePage(params?:any):ActionType<any>{
    return {
        type:ActionEnum.toGamePage,
    }
}

export function toStartPage(params?:any):ActionType<any>{
    return {
        type:ActionEnum.toStartPage
    }
}

export function setPointNum(num:number):ActionType<SettingStateType>{
    let nn=num
    if(num>20||num<5){
        nn=10
    }
    return {
        type:ActionEnum.setPointNum,
        payload:{
            pointNum:nn
        }
    }
}

export function setPointRadius(radius:number):ActionType<SettingStateType>{
    let rr=radius
    if(rr>20||rr<5){
        rr=8
    }
    return {
        type:ActionEnum.setPointRadius,
        payload:{
            pointRadius:rr
        }
    }
}

export function setSelectRadius(radius:number):ActionType<SettingStateType>{
    let rr=radius
    if(rr>40||rr<15){
        rr=15
    }
    return {
        type:ActionEnum.setSelectRadius,
        payload:{
            selectRadius:rr
        }
    }
}