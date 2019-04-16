<style lang="less">
  @import "./home.less";
  @import "../../../styles/common.less";
</style>
<template>
  <div class="home-main">
    <Row :gutter="10">
      <Col :md="24" :lg="8">
        <Row class-name="home-page-row1" :gutter="10">
          <Col :md="12" :lg="24" :style="{marginBottom: '10px'}">
            <Card>
              <Row type="flex" class="user-infor">
                <Col span="8">
                  <Row class-name="made-child-con-middle" type="flex" align="middle">
                    <img class="avator-img" :src="avatorPath" />
                  </Row>
                </Col>
                <Col span="16" style="padding-left:6px;">
                  <Row class-name="made-child-con-middle" type="flex" align="middle">
                    <div>
                      <b class="card-user-infor-name">{{ user.name }}</b>
                      <p>{{ user.role }}</p>
                    </div>
                  </Row>
                </Col>
              </Row>
              <div class="line-gray"></div>
              <Row class="margin-top-8">
                <Col span="8"><p class="notwrap">上次登录时间:</p></Col>
                <Col span="16" class="padding-left-8">{{ user.lastLogDate }}</Col>
              </Row>
              <Row class="margin-top-8">
                <Col span="8"><p class="notwrap">上次登录IP:</p></Col>
                <Col span="16" class="padding-left-8">{{ user.lastLogIP }}</Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Col>
      <Col :md="24" :lg="16">
        <Row :gutter="5">
          <Col :xs="24" :sm="24" :md="12" :style="{marginBottom: '10px'}">
            <infor-card
              id-name="user_created_count"
              :end-val="count.arc"
              iconType="android-person-add"
              color="#2d8cf0"
              intro-text="文章数"
            ></infor-card>
          </Col>
          <Col :xs="24" :sm="24" :md="12" :style="{marginBottom: '10px'}">
            <infor-card
              id-name="visit_count"
              :end-val="count.fl"
              iconType="ios-eye"
              color="#64d572"
              :iconSize="50"
              intro-text="友情链接数"
            ></infor-card>
          </Col>
          <Col :xs="24" :sm="24" :md="12" :style="{marginBottom: '10px'}">
            <infor-card
              id-name="collection_count"
              :end-val="count.ad"
              iconType="upload"
              color="#ffd572"
              intro-text="广告数"
            ></infor-card>
          </Col>
          <Col :xs="24" :sm="24" :md="12" :style="{marginBottom: '10px'}">
            <infor-card
              id-name="transfer_count"
              :end-val="count.logs"
              iconType="shuffle"
              color="#f25e43"
              intro-text="日志统计量"
            ></infor-card>
          </Col>
        </Row>
      </Col>
    </Row>
    <Row :gutter="10" class="margin-top-10">
      <Col :md="24" :lg="24" :style="{marginBottom: '10px'}">
        <Card>
          <p slot="title" class="card-title">
            <Icon type="android-map"></Icon>
            上周每日来访量统计
          </p>
          <div class="data-source-row">
            <visite-volume></visite-volume>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
  import inforCard from "./components/inforCard.vue"
import visiteVolume from "./components/visiteVolume.vue"
import cityData from "./map-data/get-city-value.js"
import Cookies from 'js-cookie'
  import { mapState } from 'vuex'

  export default {
    name: "home",
    components: {
      visiteVolume,
      inforCard
    },
    data() {
      return {
        user: {},
        toDoList: [
          {
            title: ""
          }
        ],
        count: {
          arc: 0,
          fl: 0,
          ad: 0,
          logs: 0
        },
        cityData: cityData,
        showAddNewTodo: false,
        newToDoItemValue: ""
      }
  },
    computed: {
      avatorPath() {
        return localStorage.avatorImgPath
      }
    },
    methods: {
      logout () {
        this.$confirm('是否退出系统, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('LogOut').then(() => {
            this.$router.push({ path: '/login' })
          })
        })
      }
    },
    mounted () {
      this.user = JSON.parse(Cookies.get('user'))
    },
    beforeCreate() {
      this.$store
        .dispatch('count')
        .then(() => {
          this.count = Object.assign({}, this.$store.state.global.count)
        })
    }
  }
</script>
