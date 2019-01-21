<style lang="less" scoped>
  @import "../../styles/common.less";
</style>
<template>
  <Card>
    <div slot="title" ref="searchContainer" style="height: 32px">
      <Row>
        <Col span="24">
          <div class="fr">
            <Button icon="plus-round" type="success">新增</Button>
          </div>
        </Col>
      </Row>
    </div>
    <Row>
      <Col span="24">
        <Table stripe border highlight-row ref="tableList" size="small"></Table>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <Modal title="权限分配"
               v-model="modal1"
               @on-cancel="modal1 = false">
          <Tree class="filter-tree"
                ref="tree"
                multiple
                show-checkbox style="margin-top:-7px"
          >
          </Tree>
        </Modal>
        <!--<Page :total="total" :current="query.page" :page-size="query.pageSize" show-elevator show-total class-name="list" ></Page>-->
      </Col>
    </Row>
  </Card>
</template>

<script>
  export default {
    name: 'roleList'
  }
</script>

<style lang="less" scoped>
  @import "../../styles/common.less";
  @import "../../styles/content.less";
</style>