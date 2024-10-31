<template>
  <div class="app-container">
    <!-- 输入表单 -->
    <el-form label-width="120px">
        <el-form-item label="合约名称">
            <el-input v-model="contract.name" />
        </el-form-item>

        <!-- <el-form-item label="合约地址">
            <el-input v-model="contract.contractAdd" />
        </el-form-item> -->

        <el-form-item label="运行平台">
          <el-select v-model="contract.platform" placeholder="请选择">
            <el-option
              v-for="item in platforms"
              :key="item.platform"
              :label="item.label"
              :value="item.platform">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="语言类型">
          <el-select v-model="contract.language" placeholder="请选择">
            <el-option
              v-for="item in languages"
              :key="item.language"
              :label="item.label"
              :value="item.language">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="合约等级">
            <el-select v-model="contract.grade">
                <!--
                数据类型一定要和取出的json中的一致，否则没法回填
                因此，这里value使用动态绑定的值，保证其数据类型是number
                -->
                <el-option :value="1" label="Easy"/>
                <el-option :value="2" label="Medium"/>
                <el-option :value="3" label="Hard"/>
            </el-select>
        </el-form-item>   

        
        <el-form-item label="合约文件">
          <el-upload
            ref="upload"
            :auto-upload="false"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :limit="1"
            action="http://localhost:8130/minio/upload">
            <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
            <div slot="tip" style="color: #c0c4cc;" class="el-upload__tip">上传合约Solidity版本不超过0.4.24，且不超过50MB</div>
            <el-button
              icon="el-icon-upload"
              :disabled="uploadBtnDisabled"
              style="margin-left: 10px;"
              size="small"
              type="success"
              @click="submitUpload">
              上传
            </el-button>
          </el-upload>
        </el-form-item>
        

        <el-form-item label="合约简介">
            <el-input v-model="contract.description" :rows="10" type="textarea"/>
        </el-form-item>
        <el-form-item>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate()">保存</el-button>
            <el-button type="default" @click="goBack()">取消</el-button>
        </el-form-item>

    </el-form>
  </div>
</template>

<script>

  import contractApi from '@/api/contract'
  export default {
    data () {
      return {
        // 合约对象
        contract: {},
        saveBtnDisabled: false,  //  默认按钮可用
        // TODO：动态查询数据
        languages: [{
          language: 'Solidity',
          label: 'Solidity'
        }, {
          language: 'Go',
          label: 'Go'
        }, {
          language: 'Javascript',
          label: 'Javascript'
        }, {
          language: 'Ruby',
          label: 'Ruby'
        }, {
          language: 'TypeScript',
          label: 'TypeScript'
        }],
        language: '',

        platforms: [{
          platform: 'Ethereum',
          label: 'Ethereum'
        }, {
          platform: 'Solana',
          label: 'Solana'
        }, {
          platform: 'Polkadot',
          label: 'Polkadot'
        }, {
          platform: 'Ergo',
          label: 'Ergo'
        }, {
          platform: 'Alogorand',
          label: 'Alogorand'
        }],
        platform: '',

        fileList: [],//上传文件列表
        uploadBtnDisabled: false

      }
    },

    created () {
      if(this.$route.params.id) {
        this.fetchDataById(this.$route.params.id)
      }
      
    },

    methods: {

      goBack() {
            this.$router.go(-1) 
        },

      saveOrUpdate() {
        this.saveBtnDisabled = true
        if(!this.contract.id) {
          this.saveData()
        } else {
          this.updataData()
        }
      },
      // 数据更新
      updataData() {
        contractApi.updateById(this.contract).then(response => {
          this.$notify({
              title: '成功',
              message: response.message,
              type: 'success'
            });
            this.$router.push({path: '/contract/list'})
        })
      }, 

      saveData() {
        contractApi.save(this.contract).then(response => {
          this.$notify({
              title: '成功',
              message: response.message,
              type: 'success'
            });
            this.$router.push({path: '/contract/list'})
        })
      },
      // 根据id查询数据
      fetchDataById(id) {
        contractApi.getById(id).then(response => {
          this.contract = response.data.data
        })
      },

      //上传多于一个文件
      handleUploadExceed(files, fileList) {
        this.$message.warning('每次仅允许上传一个文件')
      },

      // 上传
      submitUpload() {
          this.uploadBtnDisabled = true
          this.$refs.upload.submit() // 提交上传请求
      },

      // 文件上传成功的回调
      handleUploadSuccess(response, file, fileList) {
        this.uploadBtnDisabled = false
        if (response.success) {
          this.contract.fileId = response.data.fileId
        } else {
          this.$message.error('上传失败(非20000)')
        }
      },

      // 失败回调
      handleUploadError() {
        this.uploadBtnDisabled = false
        this.$message.error('上传失败2')
      },
    }
  }
</script>