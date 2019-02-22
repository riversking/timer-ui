<template>
  <Card>
    <div>
      <Row :gutter="16">
        <Col span="6">
          <Button icon="md-add" type="primary" @click="showModal">新增</Button>
          <AddUserModal :addModal="addModal" v-on:add-user="refreshUser" :formItem="formItem"
                        :isDisable="isDisable"></AddUserModal>
        </Col>
        <Col span="18" style="text-align: right">
          <Input v-model="userName" placeholder="请输入用户名称" clearable style="width: 200px;margin-right: 5px"></Input>
          <Input v-model="phone" placeholder="请输入手机号" clearable style="width: 200px;margin-right: 5px"></Input>
          <DatePicker v-model="createTime" type="datetime" placeholder="请选择创建时间"
                      style="width: 200px;margin-right: 5px"></DatePicker>
          <DatePicker v-model="updateTime" type="datetime" placeholder="请选择更新时间"
                      style="width: 200px;margin-right: 5px"></DatePicker>
          <Button icon="md-search" type="primary" @click="searchUser()">搜索</Button>
        </Col>
      </Row>
      <br>
      <Row :gutter="12">
        <Col span="24">
          <Table border :columns="userColumns" :data="listData"></Table>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <Page :total="total" prev-text="上一页" next-text="下一页" style="margin-top: 10px"/>
        </Col>
      </Row>
    </div>
  </Card>
</template>
<script>
  import {mapState} from 'vuex'
  import AddUserModal from './add'

  export default {

    name: 'userList',
    components: {
      AddUserModal
    },
    data() {
      return {
        namespace: 'user',
        addModal: false,
        isDisable: false,
        showCom: true,
        showImg: false,
        isVisable: true,
        userName: '',
        phone: '',
        createTime: '',
        updateTime: '',
        formItem: {
          username: '',
          password: '',
          phone: '',
          roleIds: [],
          avatar: ''
        },
        userColumns: [
          {
            title: '序号',
            key: 'id',
            align: 'center',
          },
          {
            title: '用户名',
            key: 'username',
            align: 'center',
          },
          {
            title: '手机号',
            key: 'phone',
            align: 'center',
          },
          {
            title: '头像',
            key: 'avatar',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('img', {
                  attrs: {
                    src: "http://localhost:10500/api/v1/image/" + params.row.avatar
                  },
                  style: {
                    widget: '40px',
                    height: '40px'
                  },
                  on: {
                    click: () => {
                      this.formItem.avatar = params.row.avatar
                    }
                  }
                },)
              ])
            }
          },
          {
            title: '角色',
            key: 'roleName',
            align: 'center',
            render: (h, params) => {
              return h('div',
                params.row.sysRoleModels.map(i => {
                  return h('Tag', {
                    style: {
                      marginRight: '5px'
                    },
                  }, i.roleName)
                })
              )
            }
          },
          {
            title: '创建时间',
            key: 'createTime',
            align: 'center',
          },
          {
            title: '更新时间',
            key: 'updateTime',
            align: 'center',
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small',
                    icon: 'md-eye'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.getUserDetail(params.row.id)
                    }
                  }
                }, '查看'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                    icon: 'md-trash'
                  },
                  on: {
                    click: () => {
                      this.deleteUser(params.index, params.row.id)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ]
      }
    },
    methods: {
      showModal() {
        this.addModal = true
        this.showCom = true
        this.isVisable = true
        this.isDisable = false
        this.showImg = false
        this.formItem = {
          username: '',
          password: '',
          phone: '',
          roleIds: [],
          avatar: ''
        }
      },
      getRoleList() {
        this.$store.dispatch(`role/getRoleList`)
          .then(data => {
            // console.log('datadatadatadata', data)
          })
      },
      getList() {
        let query = {
          page: 1,
          pageSize: 20,
          username: this.userName,
          phone: this.phone,
          createTime: this.createTime,
          updateTime: this.updateTime,
        }
        this.$store.dispatch(`getListData`, {'param': query})
          .then(data => {
            console.log('datadatadatadata', data)
          })
      },
      getUserDetail(id) {
        this.$store.dispatch(`getUserById`, {'param': id})
          .then(data => {
            switch (data.code) {
              case '0':
                this.formItem = data.datas
                this.addModal = true
                this.isDisable = true
                break
              default:
                this.$Message.error('失败!')
                break
            }
          })
      },
      deleteUser(index, id) {
        this.$store.dispatch(`deleteById`, {'param': id})
          .then(data => {
            switch (data.code) {
              case '0':
                this.listData.splice(index, 1)
                break
              default:
                this.$Message.error('失败!')
                break
            }
          })
      },
      searchUser() {
        this.getList()
      },
      refreshUser(item) {
        if (item === '0') {
          this.getList()
        }
        this.addModal = false
      }
    },
    computed: {
      ...mapState({
        listData: state => state.user.listData,
        roleList: state => state.role.roleList,
        total: state => state.user.total,
        token: state => state.user.token
      })
    },
    mounted() {
      this.getRoleList()
    },
    created() {
      this.getList()
    }
  }
</script>
