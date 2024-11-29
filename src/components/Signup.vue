<script setup>
import { ref, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
const usersArray = ref([]);
const checkedState = ref(false);
onMounted(() => {
  let retrievedData = localStorage.getItem("user");
  usersArray.value = retrievedData?JSON.parse(retrievedData):[];
  console.log(usersArray.value);
});

const user = ref({
  id: "",
  name: "",
  email: "",
  password: "",
});
const localStore = () => {
  localStorage.setItem("user", JSON.stringify(usersArray.value));
};
const router1 = useRouter();
const handleCancel = () => {
  router1.push("/");
};
const handleSignup = () => {
   if (usersArray.value.length===0) 
   {
    const getRandomNumber = (min, max) => {
      return Math.random() * (max - min) + min;
     };

    user.value.id = getRandomNumber(0, 10000);
    usersArray.value.push(user.value);
    localStore();
    alert("Registration Successful");
    user.value.name = "";
    user.value.email = "";
    user.value.password = "";
    checkedState.value = false;
   }
  else {
  let checkEmailExist = usersArray.value.some((i) => {
    return i.email === user.value.email;
  });
  if (checkEmailExist) {
    console.log("Exists",checkEmailExist);
    alert("User Already Exists");
  } else {
    const getRandomNumber = (min, max) => {
      return Math.random() * (max - min) + min;
    };

    user.value.id = getRandomNumber(0, 10000);
    let checkId = usersArray.value.some((i) => {
      return i.id === user.id;
    });
    if (checkId) {
      user.id = getRandomNumber(0, 10000);
    }
    usersArray.value.push(user.value);
    localStore();
    alert("Registration Successful");
    user.value.name = "";
    user.value.email = "";
    user.value.password = "";
    checkedState.value = false;
    //}
  }
}
};
const myPassword = () => {
  checkedState.value = !checkedState.value;
};
</script>

<template>
  <form @submit.prevent="handleSignup">
    <fieldset>
      <legend>SignUp</legend>
      <label for="name">Enter your name</label>
      <input
        type="text"
        id="name"
        v-model.trim="user.name"
        placeholder="Enter your name"
        required
      /><br />
      <label for="email">Enter your Username</label>
      <input
        type="email"
        v-model.trim="user.email"
        id="email"
        placeholder="Enter your gmail-id"
        required
      /><br />
      <label for="password">Enter your password</label>
      <input
        :type="checkedState ? 'text' : 'password'"
        id="password"
        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
        title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
        v-model.trim="user.password"
        placeholder="Enter the password"
      /><br />
      <label />
      <input type="checkbox" @click="myPassword" v-model="checkedState" />
      <span style="font-size: large; color: blue">Show Password</span>
      <section>
        <input type="submit" />
        <button @click="handleCancel">Cancel</button>
      </section>
    </fieldset>
  </form>
</template>

<style>
form {
  margin-top: 100px;
}
form fieldset {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  line-height: 60px;
  width: 600px;
  margin-left: auto;
  margin-right: auto;
  background-image: linear-gradient(to right, #ff758c 0%, #ff7eb3 100%);
}
legend {
  text-align: center;
  font-size: 40px;
  color: rgb(9, 9, 102);
  padding-bottom: 30px;
}
label {
  display: inline-block;
  width: 350px;
  padding-left: 20px;
  font-size: x-large;
  color: rgb(171, 238, 229);
}
input[type="text"],
input[type="password"],
input[type="email"] {
  width: 200px;
  height: 40px;
  font-size: larger;
}
input[type="text"]:focus,
input[type="password"]:focus,
input[type="email"]:focus {
  background-color: antiquewhite;
}
input[type="checkbox"] {
  width: 30px; /*Desired width*/
  height: 30px; /*Desired height*/
}
section {
  margin: 10px 0px 30px 0px;
  width: 400px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
section button,
input[type="submit"] {
  margin-left: 20px;
  margin-right: 20px;
  padding: 5px;
  border-radius: 10px;
  background-color: rgb(24, 21, 204);
  color: aliceblue;
  font-size: larger;
}
section button:hover,
input[type="submit"]:hover {
  background-color: aliceblue;
  color: blue;
}
</style>
