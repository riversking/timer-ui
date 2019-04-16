<template>
  <div class="login" @keydown.enter="handleSubmit" :class="bg">
    <div class="login-con">
      <Card :bordered="false">
        <p slot="title">
          <Icon type="log-in"></Icon>
          欢迎登录
        </p>
        <div class="form-con">
          <Form ref="loginForm" :model="form" :rules="rules">
            <FormItem prop="userName">
              <Input ref="user-name" v-model="form.username" placeholder="请输入用户名">
              <span slot="prepend">
                <Icon :size="16" type="person"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem prop="userPwd">
              <Input type="password" v-model="form.password" placeholder="请输入密码">
              <span slot="prepend">
                <Icon :size="14" type="locked"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button size="large" :loading="loading" @click="handleSubmit" type="primary" long>
                <span v-if="!loading">登录</span>
                <span v-else>Loading...</span>
              </Button>
            </FormItem>
          </Form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import { mapState } from 'vuex'
  import menuUtils from '../libs/menuUtils'
  import util from '../libs/util.js'

  export default {
    data() {
      return {
        loading: false,
        form: {
          username: 'admin',
          password: '123456',
        },
        rules: {
          username: [
            { required: true, message: '账号不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      ...mapState({
        avatar: state => state.user.avatar
      }),
      bg() {
        const i = Math.floor(Math.random() * 6)
        return `bg${i}`
      }
    },
    methods: {
      addRoutes(routes) {
        let appRouter = []
        // window.sessionStorage.setItem('routes', JSON.stringify(routes))
        window.localStorage.setItem('routes', JSON.stringify(routes))
        menuUtils(appRouter, routes)
        this.$router.addRoutes(appRouter)
      },
      handleSubmit() {
        this.$refs.loginForm.validate((valid, opt, callback) => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('login', { 'param': this.form }).then(data => {
              console.log('data', data)
              switch (data.code) {
                case '0':
                  // Cookies.set('user', JSON.stringify(data.data.sysUser))
                  this.$store.dispatch(`menu/getMenuByRoleId`, { 'param': 1 }).then(data => {
                    // this.addRoutes(data.datas)
                    this.$router.push({
                      name: 'home'
                    })
                  })

                  break
                default:
                  this.$Message.error(data.msg)
                  break
              }
              this.loading = false
            })
          }
        })
      }
    },
    mounted() {
      this.$refs['user-name'].focus()
    }
  }
</script>

<style lang="less">
  @import "./login.less";
</style>
