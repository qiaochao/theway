export enum ActionEnum{
    toGamePage,
    toStartPage,
    setPointRadius,
    setPointNum,
    setSelectRadius
}


export enum PageEnum{
    start,
    game
}
export interface StateType{
    page:PageEnum,
    setting:SettingStateType
}
export interface ActionType<T> {
    type:ActionEnum,
    payload?:T,
}

export interface SettingStateType{
    pointRadius?:number,
    pointNum?:number,
    selectRadius?:number
}