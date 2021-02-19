export interface PointType {
    x: number,
    y: number
}

export type LineType = [PointType, PointType]

export type PolygonType = Array<LineType>

export interface PolygonMapItemType {
    self: PointType,
    set: Set<PointType>
}
export interface PolygonMapType {
    [key: string]: PolygonMapItemType
}

export enum PointStateEnum {
    noSelect,
    selected,
    canSelect
}

export interface StatePointType {
    point: PointType,
    state: PointStateEnum
}
export interface StatePolygonMapType {
    [key: string]: StatePointType
}