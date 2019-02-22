<template>
  <div>
    <!--在子组件中用:value替代v-model-->
    <Modal :value="addModal" footer-hide :closable="true" @on-cancel="showModal()">
      <p slot="header">
        <span>新增用户</span>
      </p>
      <Form :model="formItem" :label-width="80">
        <FormItem label="用户名：">
          <Input v-model="formItem.username" placeholder="请输入用户名" :disabled="isDisable"></Input>
        </FormItem>
        <FormItem label="密码：" v-if="!isDisable">
          <Input v-model="formItem.password" placeholder="请输入密码" type="password" ></Input>
        </FormItem>
        <FormItem label="手机号：">
          <Input v-model="formItem.phone" placeholder="请输入手机号" :disabled="isDisable"></Input>
        </FormItem>
        <FormItem label="角色：">
          <Select v-model="formItem.roleIds" multiple :disabled="isDisable">
            <Option v-for="item in roleList" :value="item.id" :key="item.id">{{item.roleName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="头像：">
          <div>
            <img class="demo-upload-list" :src="'/api/v1/image/'+formItem.avatar" v-if="isDisable"/>
            <div class="demo-upload-list" v-for="item in uploadList">
              <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
              </template>
              <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
              </template>
            </div>
            <Upload
              ref="upload"
              :show-upload-list="false"
              :default-file-list="defaultList"
              :on-success="handleSuccess"
              :format="['jpg','jpeg','png']"
              :max-size="2048"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :before-upload="handleBeforeUpload"
              type="drag"
              :multiple=false
              action="/file/upload"
              v-show="!isDisable"
              style="display: inline-block;width:58px;">
              <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload>
            <Modal title="View Image" v-model="visible">
              <img :src="'/api/v1/image/'+this.formItem.avatar" style="width: 100%" v-if="visible">
            </Modal>
          </div>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="addUser()" v-show="!isDisable">确认</Button>
          <Button style="margin-left: 8px" v-show="!isDisable">取消</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
  import {mapState} from 'vuex'

  export default {

    name: 'addRole',
    props: {
      addModal: {
        type: Boolean,
        default: false
      },
      formItem: {
        type: Object,
      },
      isDisable: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        namespace: 'role',
        defaultList: [],
        imgName: '',
        visible: false,
        uploadList: [],
      }
    },
    methods: {
      handleView(name) {
        this.imgName = name;
        this.visible = true;
      },
      handleRemove(file) {
        const fileList = this.$refs.upload.fileList;
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
      },
      handleSuccess(res, file) {
        file.url = 'http://localhost:10500/api/v1/image/' + res.rsp;
        this.formItem.avatar = res.rsp
        file.name = res.rsp;
      },
      handleFormatError(file) {
        this.$Notice.warning({
          title: 'The file format is incorrect',
          desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
        });
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: 'Exceeding file size limit',
          desc: 'File  ' + file.name + ' is too large, no more than 2M.'
        });
      },
      handleBeforeUpload() {
        const check = this.uploadList.length < 2;
        if (!check) {
          this.$Notice.warning({
            title: 'Up to one pictures can be uploaded.'
          });
        }
        return check;
      },
      addUser() {
        this.formItem.createUser = 'admin'
        this.formItem.updateUser = 'admin'
        this.$store.dispatch('add', {'param': this.formItem})
          .then(data => {
            switch (data.code) {
              case '0':
                this.$Message.success(data.message)
                this.$emit('add-user', data.code)
                break
              default:
                this.$Message.error(data.message)
                break
            }
          })
        this.uploadList = []
      },
      showModal() {
        this.$emit('add-user', 1)
      }
    },
    computed: {
      ...mapState({
        roleList: state => state.role.roleList
      })
    },
    mounted() {
      this.uploadList = this.$refs.upload.fileList;
    },
    created() {

    }
  }
</script>
<style>
  .demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
  }

  .demo-upload-list img {
    width: 100%;
    height: 100%;
  }

  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
  }

  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
  }

  .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
