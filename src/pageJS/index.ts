import type { IChinaTotal, IData, IGDData } from '../type/index'
import axios from "axios"

class InitData implements IData{
    areaTree: any[] = []
    chinaDayList: any[] = []
    chinaTotal: IChinaTotal = {
        extData: Object,
        today: Object,
        total: Object
    }
    china: any[] = []
    gdData: IGDData = {
        extData: Object,
        today: Object,
        total: Object
    }
    mapType: number = 1
    lineType: number = 1
    lastUpdateTime: string = ""
    name: string = ""
    type: number = 1
}

const initDataFunc = (data: InitData)=>{
    axios("/api/ug/api/wuhan/app/data/list-total").then((res)=>{
        if(res.data.code && res.data.code == 10000){
            data.areaTree = res.data.data.areaTree
            data.chinaDayList = res.data.data.chinaDayList
            data.chinaTotal = res.data.data.chinaTotal
            data.china = data.areaTree.find((item: { id: string; }) => item.id === "0").children
            data.gdData = data.china.find((item: { id: string;}) => item.id === "440000")        
        }
    })
}

export {
    InitData,
    initDataFunc
}