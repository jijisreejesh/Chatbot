<script setup>
import { ref, defineProps, onMounted } from "vue";
import { useRouter } from "vue-router";
const router1 = useRouter();
const usersArray = ref([]);
let loggedUser=ref({});

//msg from input box
const msg = ref("");
const chatArrayForLocalStorage = ref([]);
//object which push to chatArrayForLocalStorage
const chatDetailsObject = ref({
  messageId: "",
  messages: [],
});
//current chat index in localstorage
let indexOfChat;
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
  loggedUser.value=JSON.parse(localStorage.getItem('loggedIn'))
  if(loggedUser.value){
      chatMessage.value.from=loggedUser.value.id;  
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
  //let msgId = chatMessage.value.to+"-"+chatMessage.value.from;
  let msgFrom = chatDetailsObject.value.messageId.split("-");
  msgFrom = msgFrom.reverse();
  msgFrom = msgFrom.join("-");
  //console.log(msgFrom);
  const chatFound = chatArrayForLocalStorage.value.find((i) => {
    return (
      i.messageId === chatDetailsObject.value.messageId ||
      i.messageId === msgFrom
    );
  });
  if (chatFound) {
    indexOfChat = chatArrayForLocalStorage.value.indexOf(chatFound);
    chatDetailsObject.value.messages = chatFound.messages;
    newChat = false;
  } else {
   // indexOfChat = -1;
    chatDetailsObject.value.messages = [];
    newChat = true;
  }

  msgsArray.value = chatDetailsObject.value.messages;
};

const sendMessage = () => {
  if (msg.value) {
    //Cloning ensures that the data stored for each message is distinct and separate from other messages. This is important in JavaScript, where objects and arrays are stored and passed by reference.
    // Clone the chatMessage object for each message
    const newMessage = { ...chatMessage.value, message: msg.value, time: new Date().toISOString() };
    
    // Push the cloned message to the messages array
    chatDetailsObject.value.messages.push(newMessage);

    if (newChat) {
      // Save the new chat object
      chatArrayForLocalStorage.value.push({ ...chatDetailsObject.value });
      newChat = false;
    } else {
      // Update existing chat's messages
      chatArrayForLocalStorage.value[indexOfChat].messages = [...chatDetailsObject.value.messages];
    }

    localStore();
    msgsArray.value = [...chatDetailsObject.value.messages];
    msg.value = "";
  }
};

const handleLogout = () => {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("loggedOrNot");
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
  /* overflow-y: auto; */
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
.sender{
  background-color:turquoise;
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