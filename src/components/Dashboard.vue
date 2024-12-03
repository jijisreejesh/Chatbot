<script setup>
import { ref, defineProps, onMounted } from "vue";
import { useRouter } from "vue-router";
const router1 = useRouter();
const usersArray = ref([]);
let loggedUser = ref({});

//msg from input box
const msg = ref("");
const chatArrayForLocalStorage = ref([]);
//object which push to chatArrayForLocalStorage
const chatDetailsObject = ref({
  messageId: "",
  clearChat: [],
  messages: [],
});
//current chat index in localstorage
const indexOfChat=ref(null);
//only insert chatMessage details  for display in chat window
const msgsArray = ref([]);

const chatMessage = ref({
  from: "",
  to: "",
  message: "",
  time: "",
});
let newChat = false;
const selectedUser = ref(null);
const localStore = () => {
  localStorage.setItem("chats", JSON.stringify(chatArrayForLocalStorage.value));
};
onMounted(() => {
  //retrieve loggedIn user from local storage
  loggedUser.value = JSON.parse(localStorage.getItem("loggedIn"));
  if (loggedUser.value) {
    chatMessage.value.from = loggedUser.value.id;
  }
  //Retrieve All Users who registered
  let retrievedData = localStorage.getItem("user");
  if (retrievedData) {
    usersArray.value = JSON.parse(retrievedData);

    //Filter array ,only contain receivers,,not contain login user
    const arrayFiltered = usersArray.value.filter((i) => {
      return i.id !== loggedUser.value.id;
    });
    usersArray.value = arrayFiltered;
  }

  retrieveChats();
});
const retrieveChats = () => {
  const retrievedChats = localStorage.getItem("chats");
  chatArrayForLocalStorage.value = retrievedChats
    ? JSON.parse(retrievedChats)
    : [];
};

const selectUser = (i) => {
  selectedUser.value = i;
  chatMessage.value.to = selectedUser.value.id;
  chatDetailsObject.value.messageId =
    chatMessage.value.from + "-" + chatMessage.value.to;
  chatDetailsObject.value.clearChat = [];
  let msgFrom = chatDetailsObject.value.messageId.split("-");
  msgFrom = msgFrom.reverse();
  msgFrom = msgFrom.join("-");
  const chatFound = chatArrayForLocalStorage.value.find((i) => {
    return (
      i.messageId === chatDetailsObject.value.messageId ||
      i.messageId === msgFrom
    );
  });
  if (chatFound) {
    indexOfChat.value = chatArrayForLocalStorage.value.indexOf(chatFound);
    chatDetailsObject.value.messages = chatFound.messages;
    newChat = false;
    chatDetailsObject.value.clearChat=chatFound.clearChat;
    msgsArray.value = chatDetailsObject.value.messages;
    if (chatFound.clearChat.includes(loggedUser.value.id)) 
      {
        let clearChatUserId=chatFound.clearChat.indexOf(loggedUser.value.id)
        //msgsArray.value = chatData.messages.slice(chatData.clearChat[clearChatIndex]);
        let fromIndexOfChatDisplay=chatFound.clearChat[clearChatUserId+1];
        msgsArray.value = chatFound.messages.slice(fromIndexOfChatDisplay);
        
      }
  } 
  else {
    chatDetailsObject.value.messages = [];
    chatDetailsObject.value.clearChat=[];
    newChat = true;
    msgsArray.value = chatDetailsObject.value.messages;
    indexOfChat.value=null
  }

 msg.value="";
};

const sendMessage = () => {
  if (msg.value) {
    const newMessage = {
      ...chatMessage.value,
      message: msg.value,
      time: new Date().toISOString(),
    };
    chatDetailsObject.value.messages.push(newMessage);

    if (newChat) {
      chatArrayForLocalStorage.value.push({ ...chatDetailsObject.value });
      newChat = false;
      localStore();
      indexOfChat.value=chatArrayForLocalStorage.value.length-1;
    } 
    else {
      chatArrayForLocalStorage.value[indexOfChat.value].messages = [
        ...chatDetailsObject.value.messages,
      
      ];
      localStore()
    }
 
    msg.value = "";
    msgsArray.value = [...chatDetailsObject.value.messages];
    if (chatArrayForLocalStorage.value[indexOfChat.value].clearChat.includes(loggedUser.value.id)) 
    {
      let clearChatUserId=chatArrayForLocalStorage.value[indexOfChat.value].clearChat.indexOf(loggedUser.value.id)
        //msgsArray.value = chatData.messages.slice(chatData.clearChat[clearChatIndex]);
        let fromIndexOfChatDisplay=chatArrayForLocalStorage.value[indexOfChat.value].clearChat[clearChatUserId+1];
        msgsArray.value = chatArrayForLocalStorage.value[indexOfChat.value].messages.slice(fromIndexOfChatDisplay);
       //console.log(chatArrayForLocalStorage.value[indexOfChat.value].messages.slice(fromIndexOfChatDisplay));
    }
  }
};
const clearChat = () => {
  console.log("Chat cleared");
   if (msgsArray.value) {
     if (chatArrayForLocalStorage.value[indexOfChat.value].clearChat.includes(loggedUser.value.id)) 
      {
         let clearChatIndexOfId=chatArrayForLocalStorage.value[indexOfChat.value].clearChat.indexOf(loggedUser.value.id)
        chatArrayForLocalStorage.value[indexOfChat.value].clearChat[clearChatIndexOfId+1] += msgsArray.value.length;
      }
      // else if(chatArrayForLocalStorage.value[indexOfChat.value].clearChat.length)
      // {
      //   console.log("hai");
       
      //   chatDetailsObject.value.clearChat.push(loggedUser.value.id,msgsArray.value.length);
      //   console.log(chatDetailsObject.value.clearChat);
        
        
      // }
      else
      {
        chatDetailsObject.value.clearChat.push(loggedUser.value.id,msgsArray.value.length);
        chatArrayForLocalStorage.value[indexOfChat.value].clearChat = [
        ...chatDetailsObject.value.clearChat

      ];
      }
    
    
    localStore();
    console.log(chatArrayForLocalStorage.value[indexOfChat.value])
    msgsArray.value=[];   
   }
};
const handleLogout = () => {
  localStorage.removeItem("loggedIn");
  router1.push("/");
};
</script>

<template>
  <div id="app" class="chat-app">
    <div class="sidebar">
      <h1>Welcome {{ loggedUser.name }}</h1>
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
      <button @click="handleLogout">LogOut</button>
    </div>
    <div class="chat-window" v-if="selectedUser">
      <h3>
        Chat with <span v-if="selectedUser">{{ selectedUser.name }}</span>
        <span @click="clearChat" id="clear">Clear Chat</span>
      </h3>
      <div class="chat-messages">
        <div v-if="msgsArray.length">
          <div
            v-for="(i, index) in msgsArray"
            :key="index"
            class="message"
            :class="{
              sender: i.from == loggedUser.id,
              receiver: i.from != loggedUser.id,
            }"
          >
            {{ i.message }}
            <sub style="float: right">{{
              new Date(i.time).toLocaleTimeString([], {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            }}</sub>
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
  position: relative;
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
.sidebar h1 {
  margin-bottom: 20px;
  color: green;
}
.sidebar li.active {
  background: #ddd;
  font-weight: bold;
}
.sidebar button {
  position: absolute;
  bottom: 0;
  margin-bottom: 20px;
  font-size: xx-large;
  background-color: red;
  border-radius: 10px;
  padding: 3px;
}
.sidebar button:active {
  background-color: #007bff;
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
.chat-window h3 {
  color: rgb(138, 11, 177);
}
.chat-input button {
  font-size: large;
  padding: 3px;
  padding-left: 5px;
  padding-right: 5px;
  background-color: #ebd086;
  color: red;
  border-radius: 10px;
}
.chat-input button:active {
  background-color: #007bff;
}
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
}

.message {
  color: whitesmoke;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: #007bff;
  overflow: hidden;
  max-width: 70%;
  word-wrap: break-word; /* Allow words to break */
  overflow: hidden; /* Hide overflowing content */
  text-overflow: ellipsis; /* Add "..." for overflowing text */
  white-space: wrap; /* Prevent text wrapping */
}
.chat-window h3 #clear {
  color: red;
  float: right;
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
  background-color: #74a9e2;
  color: white;
}
.sender {
  background-color: turquoise;
  margin-left: auto;
  align-self: flex-start;
}
.receiver {
  margin-right: auto;
  align-self: flex-start;
  background-color: #f1f1f1;
  color: black;
  text-align: left;
}
</style>
