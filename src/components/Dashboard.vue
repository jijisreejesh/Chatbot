
<script setup>
import { ref, defineProps, onMounted } from "vue";
const usersArray = ref([]);
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
//let previousReceiver;
const msg = ref("");
const chatArray = ref([]);
const chatDetails = ref({
  from: {},
  to: {},
  messages: [],
});
const selectedUser = ref(null);
const localStore = () => {
  localStorage.setItem("chats", JSON.stringify(chatArray.value));
};
onMounted(() => {
  let retrievedData = localStorage.getItem("user");
  usersArray.value = JSON.parse(retrievedData);
  const arrayFiltered = usersArray.value.filter((i) => {
    return i.id != props.id;
  });
  let userDetails = usersArray.value.find((i) => {
    return i.id == props.id;
  });
  chatDetails.value.from = userDetails;
  usersArray.value = arrayFiltered;

  let retrievedChats = localStorage.getItem("chats");
  chatArray.value = retrievedChats?JSON.parse(retrievedChats):[];
});

const selectUser = (i) => {
  selectedUser.value = i;
  chatDetails.value.to = selectedUser.value;
    
   if (chatArray.value.length !== 0) {
    //console.log(chatArray.value);
      const chatFound = chatArray.value.find((i) => {
        return (i.to.id === chatDetails.value.to.id) && (i.from.id===chatDetails.value.from.id);
      });
      if (chatFound) {
        //console.log(chatFound.messages);
         chatDetails.value.messages=[];
        chatDetails.value.messages = chatFound.messages;
        console.log(chatFound);
        
      }
      else{
        chatDetails.value.messages=[];
      }
    }
  // selectedUser.value = i;
  // chatDetails.value.to = selectedUser.value;
};
const sendMessage = () => {
  if(msg){
  chatDetails.value.messages.push(msg.value);
if (chatDetails.value.messages.length !== 0) {
    chatArray.value.push(chatDetails.value);
    localStore();
    }
  }
    msg.value = "";
};
</script>

<template>
  <div id="app" class="chat-app">
    <div class="sidebar">
      <h1>Welcome {{ chatDetails.from.name }}</h1>
      <ul>
        <li
          v-for="i in usersArray"
          :key="i.id"
          @click="selectUser(i)"
          :class="{ selected: selectedUser && selectedUser.name === i.name }"
        >
          {{ i.name }}
        </li>
      </ul>
    </div>
    <div class="chat-window" v-if="selectedUser">
      <h3>
        Chat with <span v-if="selectedUser">{{ selectedUser.name }}</span>
      </h3>
      <div class="chat-messages">
      <div v-if="chatDetails.messages">
         <div
            v-for="(i,index) in chatDetails.messages"
            :key="index"
            class='message'
          >
            {{ i }}
          </div>
      </div>
        
      </div>
      <div class="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          @keyup.enter="sendMessage"
          v-model="msg"
        />
        <button @click="sendMessage">send</button>
      </div>
    </div>
    <div v-else class="no-chat">
      <p>Select a user to start chatting.</p>
    </div>
  </div>
</template>

<style scoped>
.chat-app {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
}

.sidebar {
  width: 25%;
  background: #f4f4f4;
  padding: 20px;
  overflow-y: auto;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
}

.sidebar li.active {
  background: #ddd;
  font-weight: bold;
}

.chat-window {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: #fff;
  border-left: 1px solid #ddd;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
}

.message {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: #007bff;
}

.message.sent {
  align-self: flex-end;
  background: #007bff;
  color: white;
}

.chat-input {
  display: flex;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.no-chat {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #888;
}
.selected {
  background-color: #007bff;
  color: white;
}
</style>  
