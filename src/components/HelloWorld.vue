<script setup lang="ts">
import { ref, onMounted, reactive, toRefs } from 'vue'
import { InitData, initDataFunc } from "../pageJS/index";
import List from "./List.vue";
import ScrollDom from "./ScrollCom.vue";

const data = reactive( new InitData() )

onMounted(()=>{
    initDataFunc(data)
})

const { chinaTotal, gdData, mapType, china, areaTree, showList, isScroll } = toRefs(data)

const tabChange = (type: number) => {
    data.type = type
}

const mapTypeChange = (type: number) => {
    data.mapType = type
}

let page:number = 0

const getList = ()=>{
    if(page === data.areaTree.length - 1){
        data.isScroll = false
        return;
    };
    page++
    data.showList.push(...data.areaTree[page])
}

const refreshFun= (fallback:Function)=>{
    initDataFunc(data).then(()=>{
        page = 0
        data.isScroll = true
        fallback()
    })
}
</script>

<template>
	<div class="box">
        <div class="top-box">
            <img class="bg-img" src="../assets/bg.png">
            <div class="title-text">
                <h1>科学防护 共渡难关</h1>
                <h2>肺炎疫情实时动态播报</h2>
            </div>
            <div class="cover-cards" v-if="chinaTotal.total">
                <div class="cover-tab">
                    <div @click="tabChange(1)" :class="{active: data.type === 1}" >全国疫情数据(含港澳台)</div>
                    <div @click="tabChange(2)" :class="{active: data.type === 2}"><li></li>广东疫情数据</div>
                </div>
                <div v-show="data.type === 1" class="cover-info">
                    <div>
                        <div>
                            <h4>现有确诊</h4>
                            <p class="now_confirm number">{{ chinaTotal.total.confirm - chinaTotal.total.heal - chinaTotal.total.dead }}</p>
                            <p>
                                <span>较昨日</span>
                                <span>+{{ chinaTotal.today.storeConfirm }}</span>
                            </p>
                        </div>
                        <div>
                            <h4>累计确诊</h4>
                            <p class="confirm number">{{ chinaTotal.total.confirm }}</p>
                            <p>
                                <span>较昨日</span>
                                <span>+{{ chinaTotal.today.confirm }}</span>
                            </p>
                        </div>
                    </div>
                    <div>
                        <div>
                            <h4>境外输入</h4>
                            <p class="input number">{{ chinaTotal.total.input }}</p>
                            <p>
                                <span>较昨日</span>
                                <span>+{{ chinaTotal.today.input }}</span>
                            </p>
                        </div>
                        <div>
                            <h4>累计死亡</h4>
                            <p class="dead number">{{ chinaTotal.total.dead }}</p>
                            <p>
                                <span>较昨日</span>
                                <span>+{{ chinaTotal.today.dead }}</span>
                            </p>
                        </div>
                        <div>
                            <h4>累计治愈</h4>
                            <p class="heal number">{{ chinaTotal.total.heal }}</p>
                            <p>
                                <span>较昨日</span>
                                <span>+{{ chinaTotal.today.heal }}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div v-show="data.type === 2" class="cover-info">
                    <div>
                        <div>
                            <h4>累计确诊</h4>
                            <p class="confirm number">{{ gdData.total.confirm }}</p>
                            <p>
                                <span>较昨日</span>
                                <span>+{{ gdData.today.confirm }}</span>
                            </p>
                        </div>
                        <div>
                            <h4>累计死亡</h4>
                            <p class="dead number">{{ gdData.total.dead }}</p>
                            <p>
                                <span>较昨日</span>
                                <span>+{{ gdData.today.dead }}</span>
                            </p>
                        </div>
                        <div>
                            <h4>累计治愈</h4>
                            <p class="heal number">{{ gdData.total.heal }}</p>
                            <p>
                                <span>较昨日</span>
                                <span>+{{ gdData.today.heal }}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>

        <!-- echarts -->
        <div class="data-map content">
            <h3>中国疫情</h3>
            <div class="map-box">
                <div :class="mapType == 1 ? 'to-left' : 'to-right'" id="map"></div>
                <div :class="mapType == 1 ? 'to-left' : 'to-right'" id="map2"></div>
            </div>
            <div class="map-btn">
                <div @click="mapTypeChange(1)" :class="{ active: mapType == 1 }">
                现有确诊
                </div>
                <div @click="mapTypeChange(2)" :class="{ active: mapType == 2 }">
                累计确诊
                </div>
            </div>
        </div>
        <div class="data-list content">
            <h3>中国病例</h3>
            <List :showChildren="true" :list="china" v-if="china.length > 0" />
        </div>
        <div v-if="areaTree.length > 0" class="data-list content">
            <h3>世界病例</h3>
            <ScrollDom 
                :distance="100" 
                :isScroll:Boolean="isScroll" 
                @getList="getList"  
                @refreshFun="refreshFun">
                    <List :showChildren="false" :list="showList"/>
            </ScrollDom>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@keyframes toRight {
    from {
        left: 0;
    }
    to {
        left: calc(0px - 100vw + 1rem);
    }
    }
@keyframes toLeft {
    from {
        left: calc(0px - 100vw + 1rem);
    }
    to {
        left: 0;
    }
}

.bg-img{
    width: 100%;
}

.top-box{
    position: relative;
    .title-text{
        position: absolute;
        color: #fff;
        top: 20px;
        left: 20px;
        font-size: 14px !important;
        h1,h2{
            margin: 0;
        }
    }
    .cover-cards{
        h4,p{
            margin: 0;
        }
        font-size: 15px;
        position: absolute;
        top: 140px;
        background-color: #fff;
        border-radius: 20px;
        width: calc( 100% - 2rem );
        left: 1rem;
        overflow: hidden;
        box-shadow: 0 2px 20px rgb(0 0 0 / 10%);
        > div{
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            &.cover-tab{
                li{
                    display: inline-block;
                    margin-top: 13px;
                    margin-right: 3px;
                    width: 11px;
                    height: 14px;
                    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAaCAMAAACAXYxPAAAAgVBMVEUAAAAzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzNi1y5rAAAAKnRSTlMAuQ/daEsK+eTDoUTvycGojVc/Oh4U88+ygHosJQXg1NKscDPqlmJdKRh9lJelAAAA8ElEQVQoz12QiXKDMAxE1wFCIEBDbgq5mp7v/z+wwh5Dp28GeSUseW0FdpsV5E36o4nBAXWRAK+xlkG5k3FoE5w8a9gqsgnVBew1U5JaPPt9uwZOrYwcaU9hKoW6ho3JN1r7bOPAdW+DCjKLvKhhITkOMi6sLJKIo62WeBxLaYWoxuHv8hSE4mlcH/TePElo73iOFnK7Un9jGw56eh8tJLdw80++pAoZfQluLePKZfSd6g/fPGQc7dfMKVjObPLEOiaOTJGKZRDLnIUCH6Rzzz2KQhMdZXhva5k5e9+1Hz5zt7ykUyQcduSM0z+GiibqX4FjFj/TNw/kAAAAAElFTkSuQmCC");
                    background-size: 100% 100%;
                }
                > div {
                    width: 50%;
                    background-color: #efefef;
                    text-align: center;
                    height: 40px;
                    line-height: 40px;
                    &.active{
                        background-color: #fff;
                    }
                }
            }
            &.cover-info{
                margin-top: 10px;
                font-size: 12px;
                flex-direction: column;
                > div {
                    display: flex;
                    width: 100%;
                    justify-content: space-between;
                    margin-bottom: 10px;
                    > div{
                        p:nth-child(3){
                            color: #999;
                        }
                        width: 50%;
                        text-align: center;
                    }
                }
                .number{
                    font:700 20px DIN Alternate,din_alternate_bold,-apple-system-font,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,Helvetica Neue,PingFang SC,Hiragino Sans GB,Microsoft YaHei UI,Microsoft YaHei,Arial
                }
                .now_confirm{
                    color: #e44a3d;
                }
                .confirm{
                    color: #a31d13;
                }
                .input{
                    color: #ffa352;
                }
                .dead{
                    color: #333;
                }
                .heal{
                    color: #34aa70;
                }
            }
        }
    }
}

.data-map,
.data-list {
  margin-top: 200px;
  overflow: hidden;
  h3 {
    border-left: 8px solid #e10000;
    padding-left: 1rem;
  }
}
.map-box {
  display: flex;
  width: 200%;
}

#line,
#line1,
#line2 {
  height: 400px;
  width: 100%;
}

#map,
#map2 {
  height: 350px;
  width: 50%;
  animation-fill-mode: forwards;
}
.to-left {
  animation: toLeft 1s;
}

.to-right {
  animation: toRight 1s;
}

#map {
  margin-right: 2rem;
  // position: relative;
}
.map-btn,
.line-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    width: 45%;
    height: 40px;
    line-height: 40px;
    border: 1px solid #d2d2d2;
    box-shadow: 0 5px 7px 1px rgb(0 0 0 / 5%);
    border-radius: 5px;
    text-align: center;
    &.active {
      border-color: #ce4733;
      background-color: #fef7f7;
      color: #ce2c1e;
    }
  }
}
.line-btn {
  > div {
    width: 30%;
    height: 55px;
    line-height: 25px;
    padding-top: 5px;
  }
}
.data-list {
  margin-top: 20px;
}
</style>
