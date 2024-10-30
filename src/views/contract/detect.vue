<template>
    <div class="app-container">
      <el-carousel :interval="5000" type="card" height="400px">
        <el-carousel-item v-for="image in images" :key="image.url">
          <img  style="width:100%; height:100%" :src="image.url" alt="Image" />
        </el-carousel-item>
      </el-carousel>
  
      <el-steps :active="activeStep" finish-status="success" simple style="margin-top: 10px">
        <el-step title="请选择智能合约审计工具"></el-step>
        <el-step title="审计中"></el-step>
        <el-step title="审计完成"></el-step>
      </el-steps>

      <div v-if="activeStep === 1"  class="transfer-container" style="margin: 10px 0 20px"  >
        <h3 style="text-align: center; margin: 10px 0 20px">选择智能合约审计工具</h3>
            <div style="text-align: center; margin: 10px 0 20px">
                <el-transfer
                style="text-align: left; display: inline-block"
                v-model="value4"
                filterable
                :left-default-checked="[2, 3]"
                :right-default-checked="[1]"
                :titles="['工具列表', '已选择']"
                :button-texts="['取消', '选择']"
                :format="{
                    noChecked: '${total}',
                    hasChecked: '${checked}/${total}'
                }"
                @change="handleChange"
                :data="data">
                <span slot-scope="{ option }">{{ option.key }} - {{ option.label }}</span>
                <el-button type="primary" class="transfer-footer" slot="right-footer" size="medium" @click="handleSubmit">审计</el-button>
                <el-button type="success" class="transfer-footer" slot="right-footer" size="medium" @click="handleCheckHis">查询以往结果</el-button>
                </el-transfer>
            </div>

      </div>


      <div v-if="activeStep === 2"  class="transfer-container word-on-canvas" style="margin: 10px 0 20px"  >
        <div class="canvas-container">
            <!-- <h3 class="typing" id="message" style="text-align: center; margin: 0px 0 5px">{{ currentText }}</h3> -->
            <div class="typing-container">
                <span id="message" class="typing">{{ currentText }}</span><span class="cursor"></span>
            </div>
            <div>
                <canvas ref="canvas" style="background:#fff; width: 100%; height: 100%;" class="blurred-canvas"></canvas>
            </div>
        </div>
      </div>

      <div v-if="activeStep === 3"  class="transfer-container" style="margin: 10px 0 20px"  >
        <h3 style="text-align: center; margin: 10px 0 20px">合约审计结果</h3>
        <!--查询表单-->
        <el-form :inline="true">
            <el-form-item>
                <el-input v-model="queryDetectResultDto.tool" placeholder="检测工具"/>
            </el-form-item>
            <el-form-item>
                <el-input v-model="queryDetectResultDto.type" placeholder="漏洞类型"/>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
                <el-button type="default" icon="el-icon-refresh" @click="resetData()">清空</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="detectResList"  border stripe>
            <el-table-column label="#" width="80">
                <template slot-scope="scope">
                {{ (pageNo - 1) * pageSize + scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column prop="contractName" label="合约名称" width="200" />
            <el-table-column prop="pc" label="程序计数器" width="150" />
            <el-table-column prop="opcode" label="操作码" width="150" />
            <el-table-column prop="type" label="漏洞类型" width="150" />
            <el-table-column prop="tool" label="检测工具" width="150" />
            <el-table-column prop="codeCoverage" label="代码覆盖率(%)" width="150" />
            <el-table-column prop="executionTime" label="执行时间(s)" width="200"/>
            <el-table-column prop="createTime" label="检测时间" width="170"/>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                        icon="el-icon-download"
                        size="mini"
                        type="success"
                        @click="download(scope.row.resultId)">下载合约审计报告</el-button>
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
    </div>



  </template>
  
  <script>

  import contractApi from '@/api/contract'


  export default {
    name: 'ContractDetect',
    data() {

        const generateData = _ => {
        const data = [];
          data.push(
            {
                key: 1,
                label: 'Osiris',
            },
            {
                key: 2,
                label: 'Oyente',
            },
            {
                key: 3,
                label: 'Mythril',
            },
            {
                key: 4,
                label: 'Sguard',
            },
            {
                key: 5,
                label: 'Smartshield',
            },

        );

        return data;
      };

      return {
        images: [
          { url: require('../assets/homeImages/1.png') },
          { url: require('../assets/homeImages/2.png') },
          { url: require('../assets/homeImages/3.png') }
        ],

        activeStep: 1,

        data: generateData(),
        value3: [1],
        value4: [1],
        renderFunc(h, option) {
          return <span>{ option.key } - { option.label }</span>;
        },

        currentText: '', // 当前显示的文本
        fullText: '智能合约正在审计中，请耐心等待...', // 完整的文本
        //fullText: '我们不生产代码，我们只是代码的搬运工', // 完整的文本
        typingInterval: null, // 定时器
        currentIndex: 0, // 当前字符的索引
        detectRes: [],  // 检测结果
        uploadFileParamsDto: {}, // 文件信息保存
        detectResList: [], // 检测结果列表
        total: 0, // 总记录数
        pageNo: 1,
        pageSize: 10,
        queryDetectResultDto: {}, // 查询条件表单
        detectFileId: ''

      };

    },

    methods: {

        //下载文件
        download(id) {
            console.log("下载############：   " + id)
        // 询问是否下载
        this.$confirm('是否下载该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
            //调用后端接口
            return contractApi.getDetectFileDownloadUrl(id)
            }).then(response => {
            console.log("urllllll:  " + response.data.downloadUrl)
            
            window.open(response.data.downloadUrl)
            })
        },

        fetchData() {
            contractApi.detectResPageList(this.pageNo, this.pageSize, this.queryDetectResultDto).then(response => {
                this.detectResList = response.data.rows,
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
            this.queryDetectResultDto = {}
            this.queryDetectResultDto.resultId = this.$route.params.fileId
            this.fetchData()
        },
        handleChange(value, direction, movedKeys) {
            console.log(value, direction, movedKeys);
        },

        handleCheckHis() {
            this.activeStep = 3
            this.queryDetectResultDto.resultId = this.$route.params.fileId
            this.fetchData()
        },

        resetText() {
            this.currentText = '';
            this.currentIndex = 0;
        },
        
        startTyping() {
            // console.log("--------------打字机启动--------------")
            this.typingInterval = setInterval(this.type, 300); // 每300毫秒添加一个字符
        },
        type() {
            if (this.currentIndex < this.fullText.length) {
                this.currentText = this.fullText.slice(0, this.currentIndex + 1);
                this.currentIndex++;
            } else {
                clearInterval(this.typingInterval); // 停止打字效果
                setTimeout(() => { // 等待一段时间后重新开始
                    clearInterval(this.typingInterval); // 组件销毁时清除定时器
                    this.resetText();
                    this.startTyping();
                }, 1000); // 等待1秒后重新开始
            }
        },

        handleSubmit() {
            
            this.activeStep = 2;
            // 构造请求数据
            this.createCodeRain();
            this.startTyping();
            
            const requestData = this.value4.map(key => {
            return this.data.find(item => item.key === key);
            });

            // 发送请求到后端
            contractApi.detectContract(requestData, this.$route.params.fileId)
            .then(response => {
                this.detectRes = response.data.res
                
                this.uploadFileParamsDto = response.data.uploadFileParamsDto

                let uploadFileParamsObj;
                try {
                uploadFileParamsObj = JSON.parse(response.data.uploadFileParamsDto);
                } catch (error) {
                console.error("解析 JSON 出错:", error);
                }

                if (uploadFileParamsObj) {
                    this.detectFileId = uploadFileParamsObj.id;
                }
                
                contractApi.saveDetectResultFile(this.uploadFileParamsDto).then(response => {
                    
                    console.log("检测结果文件上传成功")
                    
                    contractApi.saveDetectResult(this.$route.params.fileId, this.detectRes, this.detectFileId).then(response => {
                        console.log(response)
                        this.queryDetectResultDto.resultId = this.$route.params.fileId
                        contractApi.detectResPageList(this.pageNo, this.pageSize, this.queryDetectResultDto).then(response =>{
                            this.detectResList = response.data.rows,
                            console.log("这是结果列表：" + this.detectResList)
                            this.total = response.data.total
                        }).catch(error => {
                            console.error('获取数据失败:', error);
                            });
                        this.activeStep = 3;
                        console.log("为啥呀？？？  " + this.activeStep)
                    })
                }).catch(error => {
                    console.log(response.message)
                    
                })
                
            })
            .catch(error => {
                // 处理错误
                console.error(error);
                this.$router.push({ path: '/contract' });
            });
        },


        createCodeRain() {

            // console.log("code rain code rain............")

            this.$nextTick(() => { // 确保 DOM 已经更新  
                const canvas = this.$refs.canvas;  
                if (canvas) {  
                    const context = canvas.getContext("2d");  
                    const W = 1605;  
                    const H = 320;  
                    canvas.width = W;  
                    canvas.height = H;  
                    const fontSize = 16;  
                    const colunms = Math.floor(W / fontSize);  
                    const drops = [];  
                    for (let i = 0; i < colunms; i++) {  
                        drops.push(0);  
                    }  
            
                    const str = "智能 合约 正在审计";  
                    const draw = () => { 
                        context.fillStyle = "rgba(255,255,255,0.05)";  
                        context.fillRect(0, 0, W, H);  
                        context.font = "700 " + fontSize + "px 微软雅黑";  
                        context.fillStyle = "#00cc33";  
            
                        for (let i = 0; i < colunms; i++) {  
                            const index = Math.floor(Math.random() * str.length);  
                            const x = i * fontSize;  
                            const y = drops[i] * fontSize;  
                            context.fillText(str[index], x, y);  
                            if (y >= canvas.height && Math.random() > 0.99) {  
                                drops[i] = 0;  
                            }  
                            drops[i]++;  
                        }  
                    };  
            
                    draw();  
                    setInterval(draw, 30);  
                } else {  
                    console.error('Canvas element is not found');  
                }  
            });
        }

    },

    beforeDestroy() {
        clearInterval(this.typingInterval); // 组件销毁时清除定时器
    },

  };
  </script>
  
  <style>

    .typing-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10; /* 确保文本在画布上方 */
    }

    #message {
        display: inline-block; /* 确保在同一行 */
        position: relative; /* 相对定位 */
        color: 	#008000; /* 根据背景调整颜色 */
        margin: 0; /* 移除默认外边距 */
        padding: 5px; /* 根据需要添加内边距 */
        z-index: 10; /* 确保文本在画布上方 */
        font-family: '微软雅黑', sans-serif; /* 你可以选择任何你想要的字体 */
        font-size: 20px; /* 选择你想要的字号 */
        font-weight: bold; /* 字体加粗 */
    }

    .cursor {
        display: inline-block; /* 确保在同一行 */
        width: 10px; /* 光标宽度 */
        height: 1.2em; /* 光标高度 */
        background-color: 	#008000; /* 光标颜色 */
        animation: blink 1s infinite; /* 应用闪烁动画 */
        vertical-align: text-bottom; /* 确保光标与文本对齐 */
    }    

    .typing {
        display: inline-block;
        position: relative;
    }

    @keyframes blink {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
    }

    .word-on-canvas {
        position: relative; /* 确保子元素可以相对于它进行定位 */
        margin: 10px 0 20px;
    }

    .canvas-container {
        position: relative; /* 为canvas提供定位上下文 */
        width: 100%; /* 根据需要设置宽度 */
        height: 100%; /* 根据需要设置高度 */
        overflow: hidden; /* 防止内容溢出 */
    }

    .blurred-canvas {
        width: 100%; /* 宽度填充整个父容器 */
        height: 100%; /* 高度填充整个父容器 */
    }

    


    .blurred-canvas {
        filter: blur(3.5px); /* 这里的5px是模糊程度，可以根据需要调整 */
        width: 100%; /* 或者你设置的具体宽度 */
        height: 100%; /* 或者你设置的具体高度 */
    }

    .transfer-container {
        border: 2px dashed #409EFF; /* 虚线边框 */
        padding: 10px; /* 内边距 */
        margin: 0 auto; /* 水平居中 */
        width: 100%; /* 宽度以父容器为主 */
        border-radius: 4px; /* 边框圆角 */
    }

    .transfer-footer {
        margin-left: 13%;
        padding: 5px 5px;
    }

    .el-carousel__item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
    }
    
    .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
    }
  </style>