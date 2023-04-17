interface IData {
    areaTree: any[],
    chinaDayList: any[],
    showList: any[],
    chinaTotal: {},
    china: any[],
    gdData: object,
    type: number,
    mapType: number,
    lineType: number,
    lastUpdateTime: string,
    isScroll: Boolean,
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


//List组件
interface IChina{
    children: [],
    id: string,
    name: string,
    total: {
        confirm: number,
        dead: number,
        heal: number,
        input: number,
        severe: number,
        suspect: number
    },
    today: {
        confirm: number,
        dead: number,
        heal: number,
        storeConfirm: number
    }
}

export type{
    IData,
    IChinaTotal,
    IGDData,
    IChina
}