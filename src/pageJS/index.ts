import type { IChinaTotal, IData, IGDData } from '../type/index'
import axios from "axios"
import * as echarts from 'echarts'
import chinaJson from "../assets/china.json"


type EChartsOption = echarts.EChartsOption

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
    let mapDom: HTMLElement | null = document.getElementById("map")
    let mapDom2: HTMLElement | null = document.getElementById("map2")
    let optionMap: EChartsOption = {
        title: {//标题内容
            // text: '中国疫情图',
            subtext: "单击省份可查看病例数",
        },
        tooltip: {//提示框组件
            trigger: "item",//触发类型 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
            formatter: "现有确诊病例<br/>{b}: {c} ",//提示框浮层内容格式器，支持字符串模板和回调函数两种形式
            //  模板变量有 { a }, { b }，{ c }，{ d }，{ e }，分别表示系列名，数据名，数据值等。 在 trigger 为 'axis' 的时候，会有多个系列的数据，此时可以通过 { a0 }, { a1 }, { a2 } 这种后面加索引的方式表示系列的索引。 不同图表类型下的 { a }，{ b }，{ c }，{ d } 含义不一样。 其中变量{ a }, { b }, { c }, { d } 在不同图表类型下代表数据含义为：

            // 折线（区域）图、柱状（条形）图、K线图: { a }（系列名称），{ b }（类目值），{ c }（数值）, { d }（无）

            // 散点图（气泡）图: { a }（系列名称），{ b }（数据名称），{ c }（数值数组）, { d }（无）

            // 地图: { a }（系列名称），{ b }（区域名称），{ c }（合并数值）, { d }（无）

            // 饼图、仪表盘、漏斗图: { a }（系列名称），{ b }（数据项名称），{ c }（数值）, { d }（百分比）

        },
        visualMap: {
            show: false,
        },
    }
    let series = {
        type: "map",
        map: "china",
        colorBy: "series",
        zoom: 1,
        top: 80,
        label: {
            show: true,
            color: "#333",
            fontSize: 10
        }
    }
    let myMap = echarts.init((mapDom as HTMLElement))
    let myMap2 = echarts.init((mapDom2 as HTMLElement))
    echarts.registerMap("china", (chinaJson as any))
    myMap.showLoading()

    axios("/api/ug/api/wuhan/app/data/list-total").then((res)=>{
        if(res.data.code && res.data.code == 10000){
            data.areaTree = res.data.data.areaTree
            data.chinaDayList = res.data.data.chinaDayList
            data.chinaTotal = res.data.data.chinaTotal
            data.china = data.areaTree.find((item: { id: string; }) => item.id === "0").children
            data.gdData = data.china.find((item: { id: string;}) => item.id === "440000")        

            let mapData: any[] = []
            let mapData2: any[] = []
            
            data.china.map( (v: any) => {
                mapData.push({
                    name: v.name,
                    value: v.total.confirm - v.total.dead - v.total.heal || 0
                })
                mapData2.push({
                    name: v.name,
                    value: v.total.confirm || 0
                })
            })
            myMap.hideLoading()
            myMap.setOption({
                ...optionMap,
                series: {
                    ...series,
                    data: mapData,

                }
            })
            myMap2.setOption({
                ...optionMap,
                series: {
                    ...series,
                    data: mapData2,

                }
            })
        }
    })
}

export {
    InitData,
    initDataFunc
}