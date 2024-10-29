<template>
  <div class="app-container">

    <!--查询表单-->
    <el-form :inline="true">
        <el-form-item>
            <el-input v-model="queryContractBaseDto.name" placeholder="合约名称"/>
        </el-form-item>

        <el-form-item>
            <el-input v-model="queryContractBaseDto.language" placeholder="语言类型"/>
        </el-form-item>

        <el-form-item>
            <el-input v-model="queryContractBaseDto.platform" placeholder="运行平台"/>
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryContractBaseDto.grade" clearable placeholder="合约等级">
                <el-option :value="1" label="Easy"/>
                <el-option :value="2" label="Medium"/>
                <el-option :value="3" label="Hard"/>
            </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryContractBaseDto.status" clearable placeholder="审计状态">
                <el-option :value="1" label="未审计"/>
                <el-option :value="2" label="审计中"/>
                <el-option :value="3" label="已审计"/>
            </el-select>
        </el-form-item>


        <!-- //TODO -->
        <!-- <el-form-item label="入驻时间">
            <el-date-picker
                            v-model="searchObj.joinDateBegin"
                            placeholder="开始时间"
                            value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item label="-">
            <el-date-picker
                            v-model="searchObj.joinDateEnd"
                            placeholder="结束时间"
                            value-format="yyyy-MM-dd" />
        </el-form-item> -->
        <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
            <el-button type="default" icon="el-icon-refresh" @click="resetData()">清空</el-button>

              <router-link :to="'/contract/create'">
                <el-button style="margin-left: 10px;" type="success" icon="el-icon-plus">添加</el-button>
              </router-link>

        </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="list" border stripe>
        <el-table-column 
          label="#"
          width="100"
          >
            <template slot-scope="scope">
              {{ (pageNo - 1) * pageSize + scope.$index + 1 }}
            </template>
          </el-table-column>
        <el-table-column prop="name" label="合约名称" width="150" />
        <!-- <el-table-column prop="contractAdd" label="合约地址" width="200" /> -->
        <!-- <el-table-column prop="companyName" label="公司名称" width="150" /> -->
        <el-table-column prop="language" label="语言类型" width="150" />
        <el-table-column prop="platform" label="运行平台" width="150" />
        <el-table-column prop="description" label="简介" width="450"/>
        <!-- <el-table-column prop="createTime" label="创建时间" width="160" /> -->
        <el-table-column
          prop="grade"
          label="合约等级"
          width="150">
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.grade === 1" type="primary" size="small"
                disable-transitions>Easy</el-tag>
              <el-tag
              v-if="scope.row.grade === 2" type="success" size="small"
              disable-transitions>Medium</el-tag>
              <el-tag
                v-if="scope.row.grade === 3" type="danger" size="small"
                disable-transitions>Hard</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="审计状态" width="150">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 1" type="danger" size="mini">未审计</el-tag>
              <el-tag v-if="scope.row.status === 2" type="warning" size="mini">审计中</el-tag>
              <el-tag v-if="scope.row.status === 3" type="success" size="mini">已审计</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <router-link :to="'/contract/edit/' + scope.row.id">
              <el-button
              icon="el-icon-edit"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            </router-link>
            <el-button
              icon="el-icon-close"
              size="mini"
              type="danger"
              @click="removeById(scope.row.id)">删除</el-button>
              
              <el-button
              icon="el-icon-download"
              size="mini"
              type="success"
              @click="download(scope.row.id)">下载</el-button>

              <router-link :to="'/contract/detect/' + scope.row.id">
                <el-button
                icon="el-icon-document"
                size="mini"
                type="warning"
                :disabled="scope.row.status !== 1"
                @click="detect(scope.row.id)">审计</el-button>
              </router-link>
          </template>
        </el-table-column>

  </el-table>
  <el-pagination
    background
    style="padding: 30px 0; text-align: center;"
    layout="prev, pager, next, sizes, jumper, ->, total"
    :current-page="pageNo"
    :page-size="pageSize"
    :page-sizes="[10,15,20,30]"
    :total="total"
    @current-change="changeCurrentPage"
    @size-change="changePageSize">
  </el-pagination>
  </div>
</template>

<script>

import contractApi from '@/api/contract'

export default {

  data() {
    return {
      list: [], //合约列表
      total: 0, // 总记录数
      pageNo: 1,
      pageSize: 10,
      queryContractBaseDto: {}, // 查询条件表单
      
    }
  },

  created() {
    this.fetchData()
  },
  

  methods: {
    fetchData() {
      contractApi.pageList(this.pageNo, this.pageSize, this.queryContractBaseDto).then(response => {
        this.list = response.data.rows,
        this.total = response.data.total
      })
    },

    // 修改页码 引用调用，系统自动传入
    changeCurrentPage(pageNo) {
      this.pageNo = pageNo;
      this.fetchData();
    },
    // 改变每页记录数
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.fetchData();
    },
    // 重置表单
    resetData() {
        this.queryContractBaseDto = {}
        this.fetchData()
    },
    //下载文件
    download(id) {
      // 询问是否下载
      this.$confirm('是否下载该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //调用后端接口
          return contractApi.getDownloadUrl(id)
        }).then(response => {
          response.data.downloadUrl
          
          window.open(response.data.downloadUrl)
        })
    },
    // 根据id删除
    removeById(id) {
      // 询问是否删除
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //调用后端接口
          return contractApi.removeById(id)
        }).then(response => {
              //刷新页面
              this.fetchData()
              // 弹出成功提示
              this.$notify({
              title: '成功',
              message: response.message,
              type: 'success'
            });
          })
        .catch((err) => {
          if(err === 'cancel') {
            this.$notify({
            type: 'info',
            message: '已取消删除'
          });   
          }       
        });
    }
  }
}
</script>
