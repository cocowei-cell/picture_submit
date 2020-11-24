<template>
  <div>
    <div class="header">明哥修改页面</div>
    <div v-if="show" class="input_container">
      <div class="form">
        <input v-model="stu_number" type="text" />
        <button @click="query">查询</button>
      </div>
      <div @click="deleteUser" class="message">
        <p style="color: red; font-weight: bold; margin-bottom: 10px">
          点击即可删除该用户
        </p>
        <p>学号：{{ message.stu_number }}</p>
        <p>姓名：{{ message.stu_name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modify",
  data() {
    return {
      message: {
        stu_number: "无",
        stu_name: "无",
      },
      stu_number: "",
      show: false,
    };
  },
  methods: {
    question() {
      let tag = "";
      tag = window.prompt(
        "请回答问题以证明你的身份：\n年轻人不讲伍德是谁说的？"
      );
      if (tag == null || tag == "" || (tag && tag.trim() !== "马保国")) {
        return (this.show = false);
      } else {
        this.show = true;
      }
    },
    async query() {
      let stu_number = this.stu_number.trim();
      if (stu_number == "") {
        return alert("输入学号");
      }
      let res = await this.$request({
        url: "/api/others/getuser?stu_number=" + stu_number,
      });
      if (res.code == 200) {
        this.$toast({
          type: "success",
          duration: 800,
          message: res.msg,
        });
        this.message = res.userdata;
      } else {
        this.$toast({
          type: "fail",
          message: res.msg,
        });
      }
    },
    async deleteUser() {
      let _id = this.message._id;
      if (!_id) {
        return this.$toast({
          type: "fail",
          duration: 800,
          message: "没信息你删个der",
        });
      } else {
        if (!confirm("确定要删除吗？")) {
          return;
        }
      }
      let res = await this.$request({
        url: "/api/others/deleteuser/" + _id,
        method: "delete",
      });
      if (res.code == 200) {
        this.$toast({
          type: "success",
          duration: 800,
          message: res.msg,
        });
        this.message = {
          stu_number: "无",
          stu_name: "无",
        };
        this.stu_number = "";
      }
    },
  },
  created() {
    this.question();
  },
};
</script>
<style scoped>
.header {
  width: 100%;
  height: 40px;
  background-color: #242424;
  line-height: 40px;
  text-align: center;
  font-size: 18px;
  color: #fff;
}
/* -----------表单------------- */
.form {
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  user-select: none;
}
input {
  outline: none;
  border: none;
  width: 50%;
  height: 40px;
  transition: all 0.3s;
  border-radius: 16px;
  border: 1px solid #ccc;
  text-indent: 1em;
}
input:focus {
  width: 80%;
  border-color: #19b5fe;
}
button {
  margin-top: 16px;
  outline: none;
  background: #07c160;
  display: block;
  border: none;
  color: #ffffff;
  width: 100%;
  height: 40px;
  border-radius: 16px;
}
button:active {
  background-color: rgba(0, 0, 0, 0.8);
}
.message {
  padding-left: 10px;
}
</style>