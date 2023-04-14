interface IData {
    areaTree: any[],
    chinaDayList: any[],
    chinaTotal: {},
    china: any[],
    gdData: object,
    type: number,
    mapType: number,
    lineType: number,
    lastUpdateTime: string,
}

interface IAreaTree {

}

interface IChinaTotal {
    extData: object,
    today: any,
    total: any
}

interface IGDData {
    extData: object,
    today: any,
    total: any
}

export type{
    IData,
    IChinaTotal,
    IGDData
}