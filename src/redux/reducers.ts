import { combineReducers } from 'redux'
import { ActionEnum, ActionType, PageEnum, SettingStateType, StateType } from '@src/common/interface'
import _ from '@src/common/lodash/index'


const preSetting:SettingStateType={
    pointNum:5,
    pointRadius:10,
    selectRadius:12
}

let reducers = combineReducers({
    page: function (state: PageEnum.start = PageEnum.start, action: ActionType<any>): PageEnum {
        let res: PageEnum = state
        switch (action.type) {
            case ActionEnum.toGamePage:
                res = PageEnum.game
                break;
            case ActionEnum.toStartPage:
                res = PageEnum.start
        }

        return res;
    },
    setting: function (state: SettingStateType=preSetting, action: ActionType<SettingStateType>): SettingStateType {
        let res: SettingStateType = _.cloneDeep<SettingStateType>(state)
        switch (action.type) {
            case ActionEnum.setPointNum:
                res.pointNum=action.payload.pointNum
                break;
            case ActionEnum.setPointRadius:
                res.pointRadius=action.payload.pointRadius
                res.selectRadius=action.payload.pointRadius*1.2
                break;
            case ActionEnum.setSelectRadius:
                if(action.payload.selectRadius<res.pointRadius){
                    res.selectRadius=res.pointRadius
                }else{
                    res.selectRadius=action.payload.selectRadius
                }
                break;
            default:
                break;
        }
        return res
    }
})
export default reducers